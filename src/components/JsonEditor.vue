<template>
  <div id="editor" ref="editor" style="height: 100%; width: 100%"/>
</template>

<script type="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { edit } from 'ace-builds'
import theme from 'ace-builds/src-noconflict/theme-monokai'
import mode from 'ace-builds/src-noconflict/mode-json'

@Component({ inheritAttrs: true })
export default class JSONEditor extends Vue {
  @Prop({ required: true })
  value

  @Prop({ required: false, default: false })
  readOnly

  editor = null

  mounted () {
    this.setupEditor()
    this.setTheme()
    this.setJSONMode()
    this.updateValue(this.value)
  }

  setJSONMode () {
    this.editor.session.setMode('ace/mode/json')
  }

  updateValue (value) {
    if (typeof value === 'string') {
      this.editor.setValue(value, 1)
    } else {
      this.editor.setValue(JSON.stringify(value, null, 2), 1)
    }
  }

  @Watch
  watch (newValue) {
    if (this.editor.value.getValue() !== newValue) {
      this.updateValue(newValue)
    }
  }

  setupEditor () {
    this.editor = edit(this.$refs.editor, {
      autoScrollEditorIntoView: true,
      readOnly: this.readOnly
    })
    this.editor.setOptions({
      maxLines: Infinity
    })
    this.editor.getSession().setUseWorker(false)
    this.editor.getSession().setMode(mode.value)
    this.editor.setFontSize('13px')
    this.editor.setShowPrintMargin(false)
    this.editor.$blockScrolling = Infinity

    this.editor.on('change', () => {
      if (this.editor.getValue() !== this.value) {
        this.value = this.editor.getValue()
      }
    })
  }

  remove () {
    this.editor.destroy()
  }

  setTheme () {
    this.editor.setTheme(theme)
  }
}
</script>
