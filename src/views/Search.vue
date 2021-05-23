<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
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
              <v-autocomplete
                label="Topic"
                placeholder="Select a topic"
                :items="topics"
                v-model="topic"
                dense
                hide-details
                item-text="name"
                class="mr-3"
              />
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
                     :disabled="!topicSelected"
                     @click="loadMessages"
                     class="mr-1">
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn color="primary"
                     small
                     :disabled="!topicSelected"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script type="ts">
import kafka from '../services/kafka'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { StatusCode } from '@/model/Status'
import JsonEditor from '../components/JsonEditor.vue'

@Component({
  components: {
    JsonEditor
  }
})
export default class Brokers extends Vue {
  topics = []
  topic = null
  filter = null
  expanded = []
  messages = []
  columnsString = ''
  loading = true
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
    this.loadTopics()
    this.onColumnsChange()
    if (this.$route.params.topic) {
      this.topic = this.$route.params.topic
    }
  }

  loadTopics () {
    this.topics = []
    this.topic = null
    this.loading = true
    kafka.getKafka(this.connection).getTopics()
      .then(topics => {
        this.topics = topics
        this.loading = false
      })
  }

  get connection () {
    return this.$store.getters.connection
  }

  get topicSelected () {
    return this.topic != null
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
