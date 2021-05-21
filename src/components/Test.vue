<template>
  <div style="margin: 10px; height: 100px; background-color: yellow">
    <v-text-field v-model="dataSync" style="background-color: #00b0ff" />
    Adentro {{ dataSync }}
  </div>
</template>

<script type="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class Test extends Vue {
  @PropSync('data', { type: String })
  dataSync
  // <test :data.sync="data"/>
}
</script>
