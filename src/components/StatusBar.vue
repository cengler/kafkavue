<template>
  <div>
    <v-system-bar
      v-bind:class="{ 'left': orientation === 'left', 'right': orientation === 'right' }"
      dark
      color="gray"
    >
      <v-icon>{{ icon }}</v-icon>
      <span>{{ text }}</span>
    </v-system-bar>
  </div>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class StatusBar extends Vue {
  @Prop({ type: String }) icon
  @Prop({ required: false, default: 'tito', type: String }) text
  @Prop({ required: false, default: 'left', type: String }) orientation
  // <test :data.sync="data"/>
}
</script>

<style type="text/css">
.left {
  float: left; width: 50%
}

.right {
  display: block !important; width: 50%; text-align: right;
}
</style>
