<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-autocomplete
          label="Topic"
          placeholder="Select a topic"
          :items="topics"
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
          <v-btn color="error" small >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn color="primary" small @click="loadMessages">
            <v-icon>mdi-play</v-icon>
          </v-btn>
          <v-btn color="primary" small >
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
        ></v-data-table>
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
  messages = []
  columnsString = ''
  loading = true
  headers = []

  loadMessages () {
    this.messages = []
    const brokers = this.connection.boostrapServers
    kafka.getMessages(brokers,
      'caeycae1', // TODO random
      'raw-event',
      (topic, partition, message) => {
        // console.log(topic, partition, message.value.toString())
        this.messages.push(JSON.parse(message.value.toString()))
      })
  }

  created () {
    this.loadTopics()
  }

  loadTopics () {
    this.topics = []
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

  @Watch('connection')
  onPropertyChanged () {
    this.loadTopics()
  }

  @Watch('columnsString')
  onColumnsChange () {
    this.headers = this.columnsString
      .split(',')
      .map(h => ({ text: h, value: h }))
  }
}

</script>
