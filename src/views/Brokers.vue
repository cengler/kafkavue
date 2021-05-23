<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :loading="loading"
          :headers="headers"
          :items="brokers"
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
  brokers = []
  search = ''
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
    kafka.getKafka(this.connection).getBrokers()
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
