<template>
  <transition name="fade">
    <v-alert v-show="syncedMessage" v-bind="$attrs" v-on="$listeners">
      {{ syncedMessage }}
    </v-alert>
  </transition>
</template>

<script type="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
@Component({ inheritAttrs: true })
export default class FadeAlert extends Vue {
  timer = null

  @Prop({ required: true }) duration
  @PropSync('message', { type: String }) syncedMessage

  mounted () {
    this.fade()
  }

  fade () {
    const value = parseInt(Math.max(this.duration, 0))
    if (value !== 0) {
      this.timer = setTimeout(() => (this.syncedMessage = null), 1000 * value)
    }
  }
}

</script>
