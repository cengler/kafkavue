<template>
  <v-dialog v-model="add" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-on="on" v-bind="attrs">
        <v-icon class="fas fa-plus"></v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Create Topic</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.topic"
                  label="Topic"
                  autofocus
                  :rules="[requiredRule, topicRule]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="editedItem.replicationFactor"
                  label="Replication factor"
                  type="number"
                  :rules="[requiredRule, positiveRule]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="editedItem.partitions"
                  label="Partitions"
                  type="number"
                  :rules="[requiredRule, positiveRule]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">
          Cancel
        </v-btn>
        <v-btn color="success" text @click="save" :disabled="!form">
          Create
        </v-btn>
        <v-dialog v-model="subDialog" persistent :max-width="400">
          <v-card>
            <v-card-title class="headline">
              Topic Already exists
            </v-card-title>
            <v-card-text>Topic whit name {{defaultItem.topic}} already exists</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="subDialog = false">
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script type="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator'
import kafka from '../services/kafka'

@Component({ inheritAttrs: true })
export default class AddTopic extends Vue {
  @Prop({ required: true })
  topics

  form = false
  timer = null
  add = false
  subDialog = false
  defaultItem = {
    topic: '',
    replicationFactor: 1,
    partitions: 1
  }

  requiredRule (v) {
    return !!v || 'This field is required'
  }

  positiveRule (v) {
    return (v > 0) || 'Must be positive'
  }

  topicRule (v) {
    return !this.topics.includes(v) || 'Topic name already exists'
  }

  editedItem = Object.assign({}, this.defaultItem)

  close () {
    this.add = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
  }

  get connection () {
    return this.$store.getters.connection
  }

  @Emit('new-topic')
  topicCreated () {
    this.$emit('new-topic')
    this.close()
  }

  save () {
    const brokers = this.connection.boostrapServers
    kafka.createTopic(brokers,
      this.editedItem.topic,
      this.editedItem.replicationFactor,
      this.editedItem.partitions)
      .then(created => {
        if (created) {
          this.topicCreated()
        } else {
          this.subDialog = true
        }
      })
      .catch(ee => console.log(ee))
  }
}

</script>
