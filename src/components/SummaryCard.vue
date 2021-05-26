<template>
  <v-card class="mx-auto">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ title }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ subTitle }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      <v-row align="center">
        <v-col class="display-3" cols="6">
          <div v-if="value !== null">{{ value }}</div>
          <v-progress-circular
            v-else
            :size="15"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ inheritAttrs: true })
export default class Offset extends Vue {
  @Prop({ required: true }) title
  @Prop({ required: false }) subTitle
  @Prop({ required: true }) value
}

</script>
