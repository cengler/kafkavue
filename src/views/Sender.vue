<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
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
      <v-col cols="2">
        <v-text-field
          label="Time"
          dense
          v-model="time"
          hide-details
          placeholder="Time between messages"
        />
      </v-col>
      <v-col cols="2">
        <v-checkbox
          v-model="loop"
          label="Loop"
          dense
        ></v-checkbox>
      </v-col>
      <v-col cols="2" class="d-flex align-end flex-column">
        <v-row dense>
          <!--v-btn color="error" small :disabled="this.messages.length === 0" @click="clearMessages">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn-->
          <v-btn color="primary" small :disabled="!topicSelected" @click="startSender" >
            <v-icon>mdi-play</v-icon>
          </v-btn>
          <v-btn color="primary" small :disabled="!topicSelected" @click="stopSender">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert v-if="statusMessage" :type="statusType" dismissible>
          {{ statusMessage }}
        </v-alert>
        <vue-json-editor
          v-model="json"
          mode="code"
          :modes="['code']"
          :expandedOnStart="true"
        ></vue-json-editor>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="ts">
import kafka from '../services/kafka'
import { Component, Vue, Watch } from 'vue-property-decorator'
import VueJsonEditor from 'vue-json-editor/vue-json-editor'

@Component({
  components: {
    VueJsonEditor
  }
})
export default class Brokers extends Vue {
  json = [{ msg: 'demo 1' }, { msg: 'demo 2' }]
  topics = []
  topic = null
  time = 1000
  loop = true
  loading = true
  statusMessage = null
  statusType = 'success'
  startSender () {
    const brokers = this.connection.boostrapServers
    const messages = this.json.map(j => JSON.stringify(j))
    console.log(messages)
    kafka.startSender(
      brokers,
      messages,
      this.topic,
      this.time,
      this.loop
    )
  }

  created () {
    this.loadTopics()
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

  stopSender () {
    kafka.stopSender()
  }

  @Watch('connection')
  onPropertyChanged () {
    this.loadTopics()
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
