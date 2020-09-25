<template>
  <v-container grid-list-xs fluid>
    <v-row>
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <v-card class="mx-auto" outlined >

          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">Setup</v-list-item-title>
              <v-list-item-subtitle>Configure brokers</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-text-field
                    value="http://localhost:9290"
                    clearable/>
          </v-card-text>
          <v-card-actions>
            <v-btn color="info">Test Connection</v-btn>
            <v-btn color="info">Connect</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>



  </v-container>
</template>

<script>
export default {
  name: 'Home',
  components: {
  }
}
</script>
