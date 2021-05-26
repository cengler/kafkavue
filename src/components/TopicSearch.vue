<template>
  <v-container fluid class="ma-0 pa-0">
    <v-alert v-if="statusMessage" :type="statusType" dismissible>
      {{ statusMessage }}
    </v-alert>
    <!-- fade-alert :message="statusMessage" :type="statusType" dismissible :duration="2" / -->
    <v-data-table
      dense
      :headers="headers"
      :items="messages"
      item-key="meta.internalKey"
      :expanded.sync="expanded"
      show-expand
      single-expand
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            label="Filter"
            dense
            v-model="filter"
            hide-details
            placeholder="Add filter text"
            class="mr-3"
          />
          <v-text-field
            label="Columns"
            dense
            hide-details
            v-model="columnsString"
            placeholder=""
            class="mr-3"
          />
          <v-btn :class="{active: !advanced}"
                 small
                 fab
                 text
                 @click="advanced = !advanced">
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
          <v-btn color="error"
                 small
                 :disabled="messages && messages.length === 0"
                 @click="clearMessages"
                 class="mr-1">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          <v-btn color="primary"
                 small
                 @click="loadMessages"
                 class="mr-1">
            <v-icon>mdi-play</v-icon>
          </v-btn>
          <v-btn color="primary"
                 small
                 @click="stopConsumer">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar flat v-if="advanced">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-combobox
                :disabled="true"
                v-model="dates"
                multiple
                chips
                small-chips
                label="Dates"
                hide-details
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-combobox>
            </template>
            <v-date-picker
              v-model="dates"
              multiple
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(dates)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-checkbox
            v-model="fromBeginning"
            label="From Beginning"
            dense
            hide-details
            class="mr-3"
          />
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <json-editor
            :json="JSON.stringify(item.msg, null, 2)"
            :read-only="true">
          </json-editor>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script type="ts">
import kafka from '../services/kafka'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { StatusCode } from '@/model/Status'
import JsonEditor from './JsonEditor.vue'

@Component({
  components: {
    JsonEditor
  }
})
export default class Brokers extends Vue {
  @Prop({ required: true }) topic

  filter = null
  expanded = []
  messages = []
  columnsString = ''
  loading = false
  headers = []
  fromBeginning = false
  statusMessage = null
  statusType = 'success'
  dates = []
  menu = false
  advanced = false

  dateRangeText () {
    return this.dates.join(' ~ ')
  }

  loadMessages () {
    this.messages = []
    this.loading = true
    kafka.getKafka(this.connection).getMessages(
      this.topic,
      this.filter,
      this.fromBeginning,
      (message) => this.messages.push(message)
    )
  }

  created () {
    this.onColumnsChange()
  }

  get connection () {
    return this.$store.getters.connection
  }

  clearMessages () {
    this.messages = []
  }

  stopConsumer () {
    kafka.getKafka(this.connection).stopConsumer()
      .then(s => {
        this.loading = false
        this.statusMessage = s.message
        this.statusType = s.code = StatusCode.ERROR ? 'error' : 'success'
      })
  }

  @Watch('connection')
  onPropertyChanged () {
    this.loadTopics()
  }

  cName (h) {
    if (h === 'meta.key') return 'Key'
    if (h === 'meta.internalKey') return 'KafkaVue key'
    if (h === 'meta.partition') return 'Partition'
    else return h.charAt(0).toUpperCase() + h.slice(1)
  }

  cValue (h) {
    if (h === 'meta.key') return 'meta.key'
    if (h === 'meta.internalKey') return 'meta.internalKey'
    if (h === 'meta.partition') return 'meta.partition'
    if (h === 'msg') return 'msg' // TODO
    else return 'msg.' + h
  }

  @Watch('columnsString')
  onColumnsChange () {
    this.headers = (this.columnsString ? this.columnsString : 'meta.key,meta.partition,meta.internalKey')
      .split(',')
      .map(h => h.trim())
      .map(h => ({ text: this.cName(h), value: this.cValue(h), sortable: true }))
  }
}

</script>

<style lang="scss" scoped>
.v-btn.active .v-icon {
  transform: rotate(-180deg);
}
</style>
