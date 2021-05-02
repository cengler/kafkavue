<template>
  <v-container>
    <v-row dense>
      <v-col
        v-for="(item) in connections"
        :key="item.name"
        cols="12"
      >
        <v-card dark :outlined="connection && item.id === connection.id" style="border-color: green">
              <v-card-title
                v-text="item.name"
              ></v-card-title>
                <v-timeline align-top dense>
                  <v-timeline-item
                    v-for="message in item.boostrapServers"
                    :key="message"
                    color="green"
                    small
                  >
                      <div class="font-weight-normal">
                        <strong>{{ message }}</strong>
                      </div>
                  </v-timeline-item>
                </v-timeline>
              <v-card-actions>
                <v-btn class="ml-2 mt-5" text small color="success" @click="select(item)">
                  SELECT
                </v-btn>
                <v-btn class="ml-2 mt-5" text small color="warning" @click="edit(item)">
                  EDIT
                </v-btn>
                <v-btn class="ml-2 mt-5" text small color="error" @click="deleteItem(item)">
                  DELETE
                </v-btn>
              </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Connection from '@/model/Connection'
@Component
export default class Home extends Vue {
  get connections () {
    return this.$store.getters.connections
  }

  get connection () {
    return this.$store.getters.connection
  }

  edit (item: Connection) {
    this.$router.push({
      name: 'Edit', params: { id: item.id.toString(), name: item.name, bootstrapServersString: item.boostrapServers.join(',') }
    })
  }

  deleteItem (item: Connection) {
    this.$store.commit('deleteConnection', item)
  }

  select (item: Connection) {
    this.$store.commit('setSelectedConnection', item)
  }
}
</script>
