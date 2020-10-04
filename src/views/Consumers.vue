<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="consumers"
          :loading="loading"
        >
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
    consumers: [],
    loading: true,
    headers: [
      {
        text: 'Group ID',
        value: 'groupId'
      },
      {
        text: 'Protocol Type',
        value: 'protocolType'
      }
    ]
  }),
  created () {
    this.loading = true
    kafka.getConsumers(['localhost:9092'])
      .then(consumers => {
        console.log(consumers)
        this.consumers = consumers
        this.loading = false
      })
  }
})

export default class Consumers extends Vue {}
</script>
