<template>
  <v-container class="ma-0 pa-0">
    <div v-if="offset !== null">{{ offset }}</div>
    <v-progress-circular
      v-else
      :size="15"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-container>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import kafka from '@/services/kafka'

@Component({ inheritAttrs: true })
export default class Offset extends Vue {
  @Prop({ required: true })
  topic

  offset=null

  created () {
    return kafka.getKafka(this.connection).fetchTopicOffsets(this.topic.name)
      .then(ts => {
        this.offset = ts.map(t => t.high - t.low).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      })
  }

  get connection () {
    return this.$store.getters.connection
  }
}

</script>

<style type="scss">
</style>
