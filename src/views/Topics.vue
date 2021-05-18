<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="topics"
          :loading="loading"
          :search="search"
          item-key="name"
          single-expand
          :expanded="expanded"
          show-expand
          :items-per-page="100"
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <topic-extra :topic="item" />
            </td>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="search"
                label="Search"
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <add-topic :topics="topicsNames" @new-topic="newTopic"/>
              <v-btn icon @click="load">
                <v-icon class="fas fa-sync"></v-icon>
              </v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.offsets="{ item }">
            <offset :topic="item" />
          </template>
          <template v-slot:item.partitions="{ item }">
              {{ item.partitions.length }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="searchItem(item)">
              mdi-magnify
            </v-icon>
            <v-icon small @click="sendItem(item)">
              mdi-send
            </v-icon>
          </template>
        </v-data-table>
        <v-snackbar v-model="snackbar" :timeout="5000" bottom>
          {{ snackbarText }}
          <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import kafka from '../services/kafka'
import { Vue, Component, Watch } from 'vue-property-decorator'
import AddTopic from '../components/AddTopic'
import TopicExtra from '../components/TopicExtra'
import Offset from '../components/Offset'

@Component({
  components: {
    AddTopic,
    TopicExtra,
    Offset
  }
})
export default class Brokers extends Vue {
  topics = []
  search = ''
  loading = true
  snackbar = false
  snackbarText = null
  expanded = []
  headers = [
    {
      text: 'Name',
      value: 'name'
    },
    {
      text: 'Message Count',
      value: 'offsets',
      width: 150
    },
    {
      text: 'Partitions',
      value: 'partitions',
      width: 150
    },
    {
      text: 'Actions',
      value: 'actions',
      align: 'end',
      width: 100,
      sortable: false
    }
  ]

  created () {
    this.load()
  }

  load () {
    this.topics = []
    this.loading = true
    const brokers = this.connection.boostrapServers
    kafka.getTopicsMetadata(brokers)
      .then(topics => {
        this.topics = topics.topics
        this.loading = false
      })
  }

  newTopic () {
    this.snackbarText = 'Topic created'
    this.snackbar = true
    this.load()
  }

  get connection () {
    return this.$store.getters.connection
  }

  get topicsNames () {
    return this.topics.map(t => t.name)
  }

  searchItem (item) {
    this.$router.push({
      name: 'Search', params: { topic: item.name }
    })
  }

  sendItem (item) {
    this.$router.push({
      name: 'Sender', params: { topic: item.name }
    })
  }

  @Watch('connection')
  onPropertyChanged () {
    this.load()
  }
}

</script>
