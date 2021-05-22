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
                   :disabled="!topicSelected || !isValid"
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
            <json-editor
              :json.sync="jsonString"
              :read-only="false"
              :isArray.sync="isArray"
              :isValid.sync="isValid"
            ></json-editor>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="ts">
import kafka from '../services/kafka'
import { Component, Vue, Watch } from 'vue-property-decorator'
import JsonEditor from '../components/JsonEditor.vue'
import data from '../example/data.json'

@Component({
  components: {
    JsonEditor
  }
})
export default class Brokers extends Vue {
  jsonString = JSON.stringify(data, null, 2)
  topics = []
  topic = null
  time = 1000
  loop = false
  isArray = false
  isValid = false
  loading = true
  statusMessage = null
  statusType = 'success'

  startSender () {
    this.loading = true
    const messages = JSON
      .parse(this.isArray ? this.jsonString : '[' + this.jsonString + ']')
      .map(j => JSON.stringify(j))
    kafka.getKafka(this.connection).startSender(
      messages,
      this.topic,
      this.time,
      this.loop
    )
  }

  created () {
    this.loadTopics()
    if (this.$route.params.topic) {
      this.topic = this.$route.params.topic
    }
  }

  loadTopics () {
    this.topics = []
    this.topic = null
    this.loading = true
    kafka.getKafka(this.connection).getTopics()
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

  stopSender () {
    kafka.getKafka(this.connection).stopSender()
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
