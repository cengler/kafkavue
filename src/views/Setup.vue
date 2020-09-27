<template>
  <div class="about">
    <h1>Setup: {{topics}}</h1>
  </div>
</template>

<script>
import kafka from '../services/kafka'

export default {
  components: {},
  data: () => ({
    topics: null
  }),
  created () {
    kafka.getTopics('sem-kafka-a-14.despexds.net:9092')
      .then(data => {
        this.topic = data
      })
  }
}
</script>
