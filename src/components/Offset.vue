<template>
  <div :class="offset === null ? 'dot-flashing' : ''">
    {{ offset }}
  </div>
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
    const brokers = this.connection.boostrapServers
    return kafka.fetchTopicOffsets(brokers, this.topic.name)
      .then(ts => {
        this.offset = ts.map(t => t.high - t.low).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      })
  }

  get connection () {
    return this.$store.getters.connection
  }
}

</script>
