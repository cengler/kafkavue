<template>
  <v-data-table
    dense
    :headers="headers"
    :items="configs"
  >
    <template v-slot:item.isDefault="{ item }">
      <v-simple-checkbox
        v-model="item.isDefault"
        disabled
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.isSensitive="{ item }">
      <v-simple-checkbox
        v-model="item.isSensitive"
        disabled
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.readOnly="{ item }">
      <v-simple-checkbox
        v-model="item.readOnly"
        disabled
      ></v-simple-checkbox>
    </template>
  </v-data-table>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import kafka from '@/services/kafka'

@Component({ inheritAttrs: true })
export default class TopicConfig extends Vue {
  @Prop({ required: true })
  topic

  configs = []

  headers = [
    {
      text: 'configName',
      value: 'configName'
    },
    {
      text: 'configValue',
      value: 'configValue'
    },
    {
      text: 'isDefault',
      value: 'isDefault'
    },
    {
      text: 'isSensitive',
      value: 'isSensitive'
    },
    {
      text: 'readOnly',
      value: 'readOnly'
    }
  ]

  created () {
    this.load()
  }

  load () {
    const brokers = this.connection.boostrapServers
    kafka.describeTopicConfigs(brokers, this.topic.name)
      .then(cs => {
        this.configs = cs
      })
  }

  get connection () {
    return this.$store.getters.connection
  }
}

</script>
