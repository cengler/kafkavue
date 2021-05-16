<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-alert v-if="statusMessage" :type="statusType" dismissible>
          {{ statusMessage }}
        </v-alert>
        <!-- fade-alert :message="statusMessage" :type="statusType" dismissible :duration="2" / -->
        <v-data-table
          dense
          :headers="headers"
          :items="messages"
          item-key="key"
          :expanded.sync="expanded"
          show-expand
          :loading="loading"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-autocomplete
                label="Topic"
                placeholder="Select a topic"
                :items="topics"
                v-model="topic"
                dense
                hide-details
                item-text="name"
                class="mr-3"
              />
              <v-text-field
                label="Filter"
                dense
                v-model="filter"
                hide-details
                placeholder="Add filter text"
                class="mr-3"
              />
              <v-text-field
                label="Columns"
                dense
                hide-details
                v-model="columnsString"
                placeholder=""
                class="mr-3"
              />
              <v-checkbox
                v-model="fromBeginning"
                label="From Beginning"
                dense
                hide-details
                class="mr-3"
              />
              <v-btn color="error"
                     small
                     :disabled="messages && messages.length === 0"
                     @click="clearMessages"
                     class="mr-1">
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
              <v-btn color="primary"
                     small
                     :disabled="!topicSelected"
                     @click="loadMessages"
                     class="mr-1">
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn color="primary"
                     small
                     :disabled="!topicSelected"
                     @click="stopConsumer">
                <v-icon>mdi-stop</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <json-viewer
                :value="item.msg"
                :expand-depth=5
                copyable
                boxed
                sort></json-viewer>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="ts">
import kafka from '../services/kafka'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { StatusCode } from '@/model/Status'

@Component
export default class Brokers extends Vue {
  topics = []
  topic = null
  filter = null
  expanded = []
  messages = []
  columnsString = ''
  loading = true
  headers = []
  fromBeginning = false
  statusMessage = null
  statusType = 'success'

  loadMessages () {
    this.messages = []
    this.loading = true
    const brokers = this.connection.boostrapServers
    kafka.getMessages(brokers,
      this.topic,
      this.filter,
      this.fromBeginning,
      (message) => this.messages.push(message))
      .then(e => console.log('iiiiiii', e))
      .catch(e => console.log('>>>>>>>', e))
  }

  created () {
    this.loadTopics()
    this.onColumnsChange()
    if (this.$route.params.topic) {
      this.topic = this.$route.params.topic
    }
  }

  loadTopics () {
    this.topics = []
    this.topic = null
    this.loading = true
    const brokers = this.connection.boostrapServers
    kafka.getTopics(brokers)
      .then(topics => {
        this.topics = topics
        this.loading = false
      })
  }

  get connection () {
    return this.$store.getters.connection
  }

  get topicSelected () {
    return this.topic != null
  }

  clearMessages () {
    this.messages = []
  }

  stopConsumer () {
    kafka.stopConsumer()
      .then(s => {
        this.loading = false
        this.statusMessage = s.message
        this.statusType = s.code = StatusCode.ERROR ? 'error' : 'success'
      })
  }

  @Watch('connection')
  onPropertyChanged () {
    this.loadTopics()
  }

  cName (h) {
    if (h === 'meta.key') return 'Key'
    if (h === 'meta.partition') return 'Partition'
    else return h.charAt(0).toUpperCase() + h.slice(1)
  }

  cValue (h) {
    if (h === 'meta.key') return 'meta.key'
    if (h === 'meta.partition') return 'meta.partition'
    else return 'msg.' + h
  }

  @Watch('columnsString')
  onColumnsChange () {
    this.headers = (this.columnsString ? this.columnsString : 'meta.key,meta.partition')
      .split(',')
      .map(h => h.trim())
      .map(h => ({ text: this.cName(h), value: this.cValue(h), sortable: true }))
  }
}

</script>

<style type="scss">

.text-start {
  text-overflow: ellipsis;
}

.dark-json-theme {
  background: #131313;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #999;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }

  .jv-button {
    color: #49b3ff
  }

  .jv-key {
    color: #111111
  }

  .jv-item {
    &.jv-array {
      color: #111111
    }

    &.jv-boolean {
      color: #fc1e70
    }

    &.jv-function {
      color: #067bca
    }

    &.jv-number {
      color: #fc1e70
    }

    &.jv-number-float {
      color: #fc1e70
    }

    &.jv-number-integer {
      color: #fc1e70
    }

    &.jv-object {
      color: #111111
    }

    &.jv-undefined {
      color: #e08331
    }

    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }

  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }

      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>
