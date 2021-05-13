<template>
  <v-container fluid style="height: 100%">
    <v-row fluid style="height: 100%">
      <v-col cols="12" fluid style="height: 100%">
        <v-card fluid style="height: 100%">
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
              label="Time between messages"
              dense
              v-model="time"
              hide-details
              placeholder="Time between messages"
              class="mr-3"
            />
            <v-checkbox
              v-model="loop"
              label="Loop"
              dense
              hide-details
              class="mr-3"
            ></v-checkbox>
            <v-btn color="primary"
                   small
                   :disabled="!topicSelected"
                   @click="startSender"
                   class="mr-1">
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn color="primary"
                   small
                   :disabled="!topicSelected"
                   @click="stopSender"
                   class="mr-1">
              <v-icon>mdi-stop</v-icon>
            </v-btn>
            <v-alert v-if="statusMessage" :type="statusType" dismissible>
              {{ statusMessage }}
            </v-alert>
          </v-toolbar>
          <v-card-text fluid style="height: 100%">
            <v-progress-linear indeterminate v-if="loading" />
            <vue-json-editor
              style="height:100%"
              v-model="json"
              mode="code"
              :modes="['code']"
              :expandedOnStart="true"
            ></vue-json-editor>
          </v-card-text>
        </v-card>
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
  loop = false
  loading = true
  statusMessage = null
  statusType = 'success'
  startSender () {
    this.loading = true
    const brokers = this.connection.boostrapServers
    const messages = this.json.map(j => JSON.stringify(j))
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
    this.loading = false
  }

  @Watch('connection')
  onPropertyChanged () {
    this.loadTopics()
  }

  beforeRouteLeave (to, from, next) {
    const answer = !this.loading || window.confirm('Do you really want to leave? you are sending messages!')
    if (answer) {
      this.stopSender()
      next()
    } else {
      next(false)
    }
  }
}

</script>

<style type="scss">

.jsoneditor-vue {
  height: 95%;
}

</style>
