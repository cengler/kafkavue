<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-autocomplete
          label="Topic"
          placeholder="Select a topic"
          :items="topics"
          item-text="name"
          />
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="Filter"
          placeholder="Add filter text"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          label="Columns"
          placeholder=""
        />
      </v-col>
      <v-col cols="3" class="d-flex align-end flex-column">
        <v-row dense>
          <v-btn color="error" small >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn color="primary" small>
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
    kafka.getMessages(['localhost:9092'],
      'caeycae',
      'raw-event',
      (topic, partition, message) => {
        console.log(topic, partition, message.value.toString())
        this.topics.push(JSON.parse(message.value.toString()))
      })
  }
})

export default class Search extends Vue {}
</script>
