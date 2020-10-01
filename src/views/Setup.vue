<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="topics"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import kafka from '../services/kafka'
import { Vue, Component } from 'vue-property-decorator'
@Component({
  components: {
  },
  data: () => ({
    topics: [],
    headers: [
      {
        text: 'Source',
        value: 'c_source'
      }
    ]
  }),
  created () {
    console.log('create')
    // kafka.getTopics('sem-kafka-a-14.despexds.net:9092')
    //   .then(data => {
    //     console.log(data)
    //     this.topics = data.map(a => ({ name: a }))
    //   })
    //   .catch(e => console.log(e))
    kafka.getMessages(['sem-kafka-a-14.despexds.net:9092'],
      'caeycae',
      'raw-event',
      (topic, partition, message) => {
        console.log(topic, partition, message.value.toString())
        this.topics.push(JSON.parse(message.value.toString()))
      })
  }
})

export default class Setup extends Vue {}
</script>
