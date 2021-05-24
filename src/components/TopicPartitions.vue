<template>
  <v-data-table
    dense
    :headers="headers"
    :items="partitions"
    :items-per-page="1000"
  >
  </v-data-table>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import kafka from '@/services/kafka'

@Component({ inheritAttrs: true })
export default class TopicExtra extends Vue {
  @Prop({ required: true })
  topic

  partitions = []

  headers = [
    {
      text: 'partitionId',
      value: 'partitionId'
    },
    {
      text: 'partitionErrorCode',
      value: 'partitionErrorCode'
    },
    {
      text: 'leader',
      value: 'leader'
    },
    {
      text: 'replicas',
      value: 'replicas'
    },
    {
      text: 'isr',
      value: 'isr'
    }
  ]

  created () {
    this.load()
  }

  load () {
    kafka.getKafka(this.connection).getTopicMetadata(this.topic)
      .then(m => {
        this.partitions = m.partitions
      })
  }

  get connection () {
    return this.$store.getters.connection
  }
}

</script>
