<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="topics"
          :loading="loading"
          :items-per-page="100"
        >
          <template v-slot:item.partitions="{ item }">
              {{ item.partitions.length }}
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
  loading = true
  headers = [
    {
      text: 'Name',
      value: 'name'
    },
    {
      text: 'Partitions',
      value: 'partitions'
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

  @Watch('connection')
  onPropertyChanged () {
    this.load()
  }
}

</script>
