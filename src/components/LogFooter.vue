<template>
  <v-container>
    {{ log }}
  </v-container>
</template>

<script type="ts">
import { Vue, Component } from 'vue-property-decorator'
import kafka from '@/services/kafka'

@Component({ inheritAttrs: true })
export default class Offset extends Vue {
  log = ''

  created () {
    kafka.getSubscriber().on('dsfsdf', () => {
      this.log += 'Connected to Kafka\n'
    })

    kafka.getSubscriber().on('dsfsdfsdfsdf', () => {
      this.log += 'Disconnected from Kafka\n'
    })
  }
}

</script>

<style type="scss">
</style>
