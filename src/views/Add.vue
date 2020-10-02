<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>New Connection</v-card-title>

          <v-card-text>
            <v-text-field clearable label="Bootstrap Servers"
                          v-model="bootstrapServersString"
                          placeholder="add bootstrap servers list"
                          :rules="[validHost]"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="info"
                   :disabled="!validHost(bootstrapServersString)"
                   text
                   @click="testConnection">
              Test Connection
            </v-btn>
            <v-btn color="success" text>
              Add
            </v-btn>
          </v-card-actions>

          <v-card-text>
            <v-alert v-if="result" :type="status">
              {{result}}
            </v-alert>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import kafka from '@/services/kafka'
@Component
export default class Add extends Vue {
  bootstrapServersString = 'localhost:9092'
  result = ''
  status = 'success'
  validHost (v: string) {
    return v.match(/^.+:[0-9]+/) ? true : 'bootstrap servers list must be valid'
  }

  testConnection () {
    this.result = ''
    kafka.test(this.bootstrapServersString)
      .then(c => {
        this.status = 'success'
        this.result = `Connection Success ${c}`
      })
      .catch(e => {
        this.status = 'error'
        this.result = e
      })
  }

  @Watch('bootstrapServersString')
  onPropertyChanged (value: string, oldValue: string) {
    this.result = ''
  }
}
</script>
