<template>
  <div id="editor" ref="editor" style="height: 300px; width: 100%"/>
</template>

<script type="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
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
    this.updateValue()
  }

  setJSONMode () {
    this.editor.session.setMode('ace/mode/json')
  }

  updateValue () {
    this.editor.setValue(JSON.stringify(JSON.parse(this.value), null, 2), 1)
  }

  setupEditor () {
    this.editor = edit(this.$refs.editor, {
      autoScrollEditorIntoView: true,
      readOnly: this.readOnly
    })
    this.editor.getSession().setUseWorker(false)
    this.editor.getSession().setMode(mode.value)
    this.editor.setFontSize('13px')
    this.editor.setShowPrintMargin(false)
    this.editor.$blockScrolling = Infinity
  }

  remove () {
    this.editor.destroy()
  }

  setTheme () {
    this.editor.setTheme(theme)
  }
}
</script>
