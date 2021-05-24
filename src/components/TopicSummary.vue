<template>
  <v-container fluid class="ma-0 pa-0">
    <v-col class="ma-0 pa-0">
      <v-row>
        <v-col>
          <summary-card class="ma-0 pa-0" title="Messages" sub-title="Total Count" :value="offset"/>
        </v-col>
        <v-col>
          <summary-card title="Messages" sub-title="Total Count" :value="offset"/>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import kafka from '@/services/kafka'
import SummaryCard from '@/components/SummaryCard.vue'

@Component({
  inheritAttrs: true,
  components: {
    SummaryCard
  }
})
export default class Offset extends Vue {
  @Prop({ required: true })
  topic

  offset = null

  created () {
    return kafka.getKafka(this.connection).fetchTopicOffsets(this.topic)
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
