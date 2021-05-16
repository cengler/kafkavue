<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          dense
          :headers="headers"
          :items="topic.partitions"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ inheritAttrs: true })
export default class TopicExtra extends Vue {
  @Prop({ required: true })
  topic

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
}

</script>
