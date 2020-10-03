<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="topics"
          :loading="loading"
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
import { Vue, Component } from 'vue-property-decorator'
@Component({
  components: {},
  data: () => ({
    topics: [],
    loading: true,
    headers: [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Partitions',
        value: 'partitions'
      }
    ]
  }),
  created () {
    this.loading = true
    kafka.getTopics(['sem-kafka-a-14.despexds.net:9092'])
      .then(topics => {
        console.log(topics)
        this.topics = topics.topics
        this.loading = false
      })
  }
})

export default class Topics extends Vue {}
</script>
