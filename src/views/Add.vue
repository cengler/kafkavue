<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-card-title>New Connection</v-card-title>

            <v-card-text>
              <v-text-field clearable label="Cluster Name"
                            v-model="name"
                            placeholder="add cluster name"
                            :rules="[notEmpty]"
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
              <v-btn color="success" text @click="validate">
                Add
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
import { Vue, Component, Watch } from 'vue-property-decorator'
import kafka from '@/services/kafka'
// import store from '../store';

@Component
export default class Add extends Vue {
  valid = false
  name = ''
  bootstrapServersString = 'localhost:9092'
  result = ''
  status = 'success'
  validHost (v: string) {
    return v && v.match(/^.+:[0-9]+/) ? true : 'bootstrap servers list must be valid'
  }

  notEmpty (v: string) {
    return v ? true : 'name must have a value'
  }

  validate () {
    if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
      // store.dispatch
    }
  }

  testConnection () {
    this.result = ''
    kafka.test(this.bootstrapServersString)
      .then(() => {
        this.status = 'success'
        this.result = 'Connection Success'
      })
      .catch(e => {
        this.status = 'error'
        this.result = e
      })
  }

  @Watch('bootstrapServersString')
  onPropertyChanged (value: string, oldValue: string) {
    this.result = ''
    console.log(oldValue)
    console.log(value)
  }
}
</script>
