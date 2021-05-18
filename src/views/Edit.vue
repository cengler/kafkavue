<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-card-title>Connection</v-card-title>

            <v-card-text>
              <v-text-field clearable label="Cluster Name"
                            v-model="name"
                            placeholder="add cluster name"
                            :rules="[notEmpty, duplicatedName]"
              ></v-text-field>
              <v-text-field clearable label="Bootstrap Servers"
                            v-model="bootstrapServersString"
                            placeholder="add bootstrap servers list"
                            :rules="[validHost]"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="info"
                     :disabled="!bootstrapServersString"
                     text
                     @click="testConnection">
                Test Connection
              </v-btn>
              <v-btn color="success" text @click="save">
                {{ id ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>

            <v-card-text>
              <v-alert v-if="result" :type="status">
                {{result}}
              </v-alert>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import kafka from '@/services/kafka'
import Connection from '@/model/Connection'

@Component
export default class Edit extends Vue {
  id = 0
  name = ''
  bootstrapServersString = ''
  valid = false
  result = ''
  status = 'success'

  created () {
    if (this.$route.params.id) {
      this.id = Number.parseInt(this.$route.params.id)
    }
    this.name = this.$route.params.name
    this.bootstrapServersString = this.$route.params.bootstrapServersString
  }

  validHost (v: string) {
    return v && v.match(/^.+:[0-9]+/) ? true : 'bootstrap servers list must be valid'
  }

  notEmpty (v: string) {
    return v ? true : 'name must have a value'
  }

  duplicatedName (v: string) {
    const cs: Connection[] = this.$store.getters.connections
    const names: string[] = cs
      .filter(c => c.id !== this.id)
      .map(c => c.name)
    return !names.includes(v) ? true : 'name already exists'
  }

  async save () {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      const testResult = await this.testConnection()
      if (testResult) {
        await this.$store.dispatch('saveConnection', new Connection(this.id, this.name, this.bootstrapServersString))
        await this.$router.push({ path: '/' })
      }
    } else {
      this.status = 'error'
      this.result = 'Missing fields'
    }
  }

  testConnection () {
    this.result = ''
    return kafka.test(this.bootstrapServersString)
      .then(() => {
        this.status = 'success'
        this.result = 'Connection Success'
        return true
      })
      .catch(e => {
        this.status = 'error'
        this.result = `Connection error: ${e}`
        return false
      })
  }
}
</script>
