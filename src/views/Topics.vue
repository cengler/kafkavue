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
          :items-per-page="100"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="search"
                label="Search"
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <add-topic :topics="topicsNames" @new-topic="load"/>
              <v-btn icon @click="load">
                <v-icon class="fas fa-sync"></v-icon>
              </v-btn>
            </v-toolbar>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import kafka from '../services/kafka'
import { Vue, Component, Watch } from 'vue-property-decorator'
import AddTopic from '../components/AddTopic'

@Component({
  components: {
    AddTopic
  }
})
export default class Brokers extends Vue {
  topics = []
  search = ''
  loading = true
  headers = [
    {
      text: 'Name',
      value: 'name'
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
    kafka.getTopics(brokers)
      .then(topics => {
        this.topics = topics.topics
        this.loading = false
      })
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
