<template>
  <v-container fluid>
  <topic-summary :topic="topic"/>
  <v-tabs
    class="pt-3"
    v-model="tab"
    centered
    dark
    icons-and-text
  >
    <v-tabs-slider></v-tabs-slider>
    <v-tab href="#tab-config">
      Config<v-icon>fas fa-cogs</v-icon>
    </v-tab>
    <v-tab href="#tab-partitions">
      Partitions<v-icon>fas fa-pizza-slice</v-icon>
    </v-tab>
    <v-tab href="#tab-search">
      Search<v-icon>fas fa-search</v-icon>
    </v-tab>
    <v-tab href="#tab-sender">
      Sender<v-icon>fas fa-paper-plane</v-icon>
    </v-tab>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-config">
        <topic-config :topic="topic"/>
      </v-tab-item>
      <v-tab-item value="tab-partitions">
        <topic-partitions :topic="topic"/>
      </v-tab-item>
      <v-tab-item value="tab-search">
        <topic-search/>
      </v-tab-item>
      <v-tab-item value="tab-sender">
        <topic-sender/>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
  </v-container>
</template>

<script type="ts">
import { Vue, Component } from 'vue-property-decorator'
import TopicConfig from '@/components/TopicConfig.vue'
import TopicPartitions from '@/components/TopicPartitions.vue'
import TopicSearch from '@/components/TopicSearch.vue'
import TopicSender from '@/components/TopicSender.vue'
import TopicSummary from '@/components/TopicSummary.vue'

@Component({
  components: {
    TopicConfig,
    TopicPartitions,
    TopicSummary,
    TopicSender,
    TopicSearch
  }
})
export default class Topic extends Vue {
  topic
  tab = null

  created () {
    if (this.$route.params.topic) {
      this.topic = this.$route.params.topic
    }
    this.setBreadcrumbs()
  }

  get setBreadcrumbs () {
    this.$store.commit('setBreadcrumbs', [
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
    ])
  }
}

</script>
