<template>
  <div id="editor" ref="editor" style="height: 100%; width: 100%"/>
</template>

<script type="ts">
import { Vue, Component, Prop, Watch, PropSync } from 'vue-property-decorator'
import { edit } from 'ace-builds'
import theme from 'ace-builds/src-noconflict/theme-monokai'
import mode from 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/webpack-resolver'

@Component({ inheritAttrs: true })
export default class JSONEditor extends Vue {
  @PropSync('json', { type: String }) jsonSync
  @PropSync('isValid', { type: Boolean }) isValidSync
  @PropSync('isArray', { type: Boolean }) isArraySync
  @Prop({ required: false, default: false }) readOnly

  editor = null

  mounted () {
    this.setupEditor()
    this.externalUpdate(this.jsonSync)
    this.editor.focus()
  }

  // external update
  @Watch('json')
  externalUpdate (newValue) {
    if (this.editor.getValue() !== newValue) {
      this.editor.setValue(newValue, 1)
    }
  }

  setupEditor () {
    this.editor = edit(this.$refs.editor, {
      autoScrollEditorIntoView: true,
      readOnly: this.readOnly
    })
    this.editor.setOptions({ maxLines: Infinity })
    this.editor.getSession().setMode(mode.value)
    this.editor.setFontSize('13px')
    this.editor.setShowPrintMargin(false)
    this.editor.$blockScrolling = Infinity
    this.editor.session.setMode('ace/mode/json')
    this.editor.setTheme(theme)
    this.editor.session.on('change', () => {
      const value = this.editor.getSession().getValue()
      this.jsonSync = value
      this.setStatusFlags(value)
    })
  }

  setStatusFlags (value) {
    try {
      const jsonObject = JSON.parse(value)
      this.isValidSync = true
      this.isArraySync = Array.isArray(jsonObject)
    } catch (e) {
      this.isValidSync = false
      this.isArraySync = false
    }
  }

  remove () {
    this.editor.destroy()
  }
}
</script>
