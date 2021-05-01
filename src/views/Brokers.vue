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
import { Vue, Component, Watch } from 'vue-property-decorator'
@Component
export default class Brokers extends Vue {
  brokers = []
  loading = true
  headers = [
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

  created () {
    this.load()
  }

  load () {
    this.brokers = []
    this.loading = true
    const brokers = this.connection.boostrapServers
    kafka.getBrokers(brokers)
      .then(brokers => {
        this.brokers = brokers
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
