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
            <v-toolbar flat>
              <v-text-field
                v-model="search"
                label="Search"
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn icon @click="load">
                <v-icon class="fas fa-sync"></v-icon>
              </v-btn>
            </v-toolbar>
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
