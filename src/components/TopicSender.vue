<template>
  <v-container fluid class="ma-0 pa-0" style="height: 100%">
    <v-row fluid style="height: 100%">
      <v-col cols="12" fluid style="height: 100%">
        <v-card fluid style="height: 100%">
          <v-toolbar flat>
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
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import JsonEditor from './JsonEditor.vue'
import data from '../example/data.json'

@Component({
  components: {
    JsonEditor
  }
})
export default class Brokers extends Vue {
  @Prop({ required: true }) topic

  jsonString = JSON.stringify(data, null, 2)
  time = 1000
  loop = false
  isArray = false
  isValid = false
  loading = false
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
