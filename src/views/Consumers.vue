<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="consumers"
          :loading="loading"
          :search="search"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
            ></v-text-field>
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
  consumers = []
  loading = true
  search = ''
  headers = [
    {
      text: 'Group ID',
      value: 'groupId'
    },
    {
      text: 'Protocol Type',
      value: 'protocolType'
    }
  ]

  created () {
    this.load()
  }

  load () {
    this.consumers = []
    this.loading = true
    const brokers = this.connection.boostrapServers
    kafka.getConsumers(brokers)
      .then(consumers => {
        this.consumers = consumers
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
