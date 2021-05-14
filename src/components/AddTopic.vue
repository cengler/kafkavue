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
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.topic"
                label="Topic"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model.number="editedItem.replicationFactor"
                label="Replication factor"
                type="number"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model.number="editedItem.partitions"
                label="Partitions"
                type="number"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click="save">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script type="ts">
import { Vue, Component } from 'vue-property-decorator'
import kafka from '../services/kafka'

@Component({ inheritAttrs: true })
export default class AddTopic extends Vue {
  timer = null
  add = false
  defaultItem = {
    topic: '',
    replicationFactor: 1,
    partitions: 1
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

  save () {
    const brokers = this.connection.boostrapServers
    kafka.createTopic(brokers,
      this.editedItem.topic,
      this.editedItem.replicationFactor,
      this.editedItem.partitions)
    this.close()
  }
}

</script>
