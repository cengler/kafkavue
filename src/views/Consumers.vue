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
          item-key="groupId"
          single-expand
          :expanded="expanded"
          show-expand
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <consumer-extra :consumer="item" />
            </td>
          </template>
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
          <template v-slot:item.members="{ item }">
            {{ item.members.length }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import kafka from '../services/kafka'
import { Vue, Component, Watch } from 'vue-property-decorator'
import ConsumerExtra from '@/components/ConsumerExtra'

@Component({
  components: {
    ConsumerExtra
  }
})
export default class Brokers extends Vue {
  consumers = []
  loading = true
  search = ''
  expanded = []
  kafka = kafka.forBrokers(this.connection.boostrapServers)
  headers = [
    {
      text: 'Group ID',
      value: 'groupId'
    },
    {
      text: 'Members',
      value: 'members'
    },
    {
      text: 'Protocol',
      value: 'protocol'
    },
    {
      text: 'Protocol Type',
      value: 'protocolType'
    },
    {
      text: 'State',
      value: 'state'
    }
  ]

  created () {
    this.load()
  }

  load () {
    this.consumers = []
    this.loading = true
    this.kafka.getConsumersMetadata()
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
