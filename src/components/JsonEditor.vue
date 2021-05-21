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
    this.setTheme()
    this.setJSONMode()
    this.externalUpdate(this.jsonSync)
    this.editor.focus()
  }

  setJSONMode () {
    this.editor.session.setMode('ace/mode/json')
  }

  updateValue (value) {
    this.editor.setValue(value, 1)
  }

  // external update
  @Watch('value')
  externalUpdate (newValue) {
    if (this.editor.getValue() !== newValue) {
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
    // this.editor.getSession().setUseWorker(false)
    this.editor.getSession().setMode(mode.value)
    this.editor.setFontSize('13px')
    this.editor.setShowPrintMargin(false)
    this.editor.$blockScrolling = Infinity

    this.editor.on('change', () => {
      if (this.editor.getValue() !== this.jsonSync) {
        this.jsonSync = this.editor.getValue()
        this.setStatusFlags()
      }
    })
  }

  setStatusFlags () {
    try {
      const jsonObject = JSON.parse(this.jsonSync)
      this.isValidSync = true
      this.isArraySync = Array.isArray(jsonObject)
      console.log('va', jsonObject)
    } catch (e) {
      this.isValidSync = false
      this.isArraySync = false
      console.log('in')
    }
  }

  remove () {
    this.editor.destroy()
  }

  setTheme () {
    this.editor.setTheme(theme)
  }
}
</script>
