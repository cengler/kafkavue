<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-data-table
      :height="height"
      :items="items"
      :headers="headers"
      dense
      disable-pagination
      hide-default-footer
      hide-default-header
    >
      <template v-slot:top>
        <v-toolbar dense height="20" class="ma-0 pa-0">
          <!--v-icon>mdi-console-line</v-icon-->
          <v-icon class="ma-0 pb-2">mdi-router-network</v-icon>
          <v-spacer/>
            <v-btn
              :class="{active: height === 33}"
              small fab
              text
              @click="switchLog()">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.level="{ item }">
        <v-chip small :color="getColor(item.level)" dark>
          {{ item.level }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script type="ts">
import { Vue, Component } from 'vue-property-decorator'
import kafka from '@/services/kafka'

const ROW_H = 33

@Component({ inheritAttrs: true })
export default class Offset extends Vue {
  log = 'init'
  onScroll = null
  height = ROW_H
  headers = [
    {
      text: 'level',
      value: 'level',
      width: 50,
      align: 'start',
      sortable: false
    },
    {
      text: 'log',
      value: 'log',
      align: 'start',
      sortable: false
    }
  ]

  items = [
    { level: 'warn', log: 'Closing Consumer...' },
    { level: 'info', log: 'Consuming 3..' },
    { level: 'error', log: 'Consuming 2..' },
    { level: 'warn', log: 'Consuming 1..' },
    { level: 'warn', log: 'Consumer connected' },
    { level: 'warn', log: 'Kafka connected' }
  ]

  created () {
    kafka.getSubscriber().on('dsfsdf', () => {
      this.log += 'Connected to Kafka\n'
    })

    kafka.getSubscriber().on('dsfsdfsdfsdf', () => {
      this.log += 'Disconnected from Kafka\n'
    })
  }

  getColor (level) {
    if (level === 'warn') {
      return 'warning'
    } else if (level === 'error') {
      return 'error'
    }
    return 'info'
  }

  switchLog () {
    if (this.height === 200) {
      this.height = ROW_H
    } else {
      this.height = 200
    }
  }
}

</script>

<style type="css">
.v-btn.active .v-icon {
  transform: rotate(-180deg);
}
</style>
