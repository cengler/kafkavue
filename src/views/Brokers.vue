<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :loading="loading"
          :headers="headers"
          :items="brokers"
        ></v-data-table>
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
    brokers: [],
    loading: true,
    headers: [
      {
        text: 'Host',
        value: 'host'
      },
      {
        text: 'Node ID',
        value: 'nodeId'
      },
      {
        text: 'Port',
        value: 'port'
      }
    ]
  }),
  created () {
    this.loading = true
    const brokers = this.$store.getters.connection.boostrapServers
    kafka.getBrokers(brokers)
      .then(brokers => {
        this.brokers = brokers
        this.loading = false
      })
  }
})

export default class Brokers extends Vue {}
</script>
