<template>
  <v-container fluid>
  <v-breadcrumbs :items="items"></v-breadcrumbs>
  <v-tabs
    v-model="tab"
    centered
    dark
    icons-and-text
  >
    <v-tabs-slider></v-tabs-slider>
    <v-tab href="#tab-config">
      Config<v-icon>mdi-cog</v-icon>
    </v-tab>
    <v-tab href="#tab-partitions">
      Partitions<v-icon>mdi-cog</v-icon>
    </v-tab>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-config">
        <topic-config :topic="topic"/>
      </v-tab-item>
      <v-tab-item value="tab-partitions">
        <topic-partitions :topic="topic"/>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
  </v-container>
</template>

<script type="ts">
import { Vue, Component } from 'vue-property-decorator'
import TopicConfig from '@/components/TopicConfig.vue'
import TopicPartitions from '@/components/TopicPartitions.vue'

@Component({
  components: {
    TopicConfig,
    TopicPartitions
  }
})
export default class Topic extends Vue {
  topic
  tab = null

  created () {
    if (this.$route.params.topic) {
      this.topic = this.$route.params.topic
    }
  }

  get items () {
    return [
      {
        text: 'Topics',
        disabled: false,
        to: '/topics'
      },
      {
        text: this.topic,
        disabled: true,
        to: 'none'
      }
    ]
  }
}

</script>
