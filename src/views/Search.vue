<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-autocomplete
          label="Topic"
          placeholder="Select a topic"
          :items="topics"
          v-model="topic"
          dense
          hide-details
          item-text="name"
          />
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="Filter"
          dense
          hide-details
          placeholder="Add filter text"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="Columns"
          dense
          hide-details
          v-model="columnsString"
          placeholder=""
        />
      </v-col>
      <v-col cols="3" class="d-flex align-end flex-column">
        <v-row dense>
          <v-btn color="error" small :disabled="this.messages.length === 0">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn color="primary" small @click="loadMessages" :disabled="!topicSelected">
            <v-icon>mdi-play</v-icon>
          </v-btn>
          <v-btn color="primary" small :disabled="!topicSelected">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="messages"
          :expanded.sync="expanded"
          show-expand
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <json-viewer
                :value="item"
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

<script>
import kafka from '../services/kafka'
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Brokers extends Vue {
  topics = []
  topic = null
  expanded = []
  messages = []
  columnsString = 'topic,partition'
  loading = true
  headers = []

  loadMessages () {
    this.messages = []
    const brokers = this.connection.boostrapServers
    kafka.getMessages(brokers,
      'caeycae' + Date.now().toString(), // TODO random
      this.topic,
      (topic, partition, message) => {
        // console.log(topic, partition, message.value.toString())
        const m = JSON.parse(message.value.toString())
        m.topic = topic
        m.partition = partition
        this.messages.push(m)
      })
  }

  created () {
    this.loadTopics()
    this.onColumnsChange()
  }

  loadTopics () {
    this.topics = []
    this.topic = null
    this.loading = true
    const brokers = this.connection.boostrapServers
    kafka.getTopics(brokers)
      .then(topics => {
        this.topics = topics.topics
        this.loading = false
      })
  }

  get connection () {
    return this.$store.getters.connection
  }

  get topicSelected () {
    return this.topic != null
  }

  @Watch('connection')
  onPropertyChanged () {
    this.loadTopics()
  }

  @Watch('columnsString')
  onColumnsChange () {
    this.headers = this.columnsString
      .split(',')
      .map(h => h.trim())
      .map(h => ({ text: h, value: h }))
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
