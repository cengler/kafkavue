<template>
  <v-app id="inspire">
    <v-navigation-drawer
            v-model="drawer"
            app
            mini-variant
            clipped
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Setup</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-toolbar-title>Kafkavue</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer app>
      <v-row>
        <v-col class="text-left" cols="4">Kafkavue</v-col>
        <v-col class="text-center" cols="4">©2020 - Christian Engler</v-col>
        <v-col class="text-right" cols="4">Github</v-col>
      </v-row>
    </v-footer>
  </v-app>

</template>

<script>
  export default {
    name: 'App',
    components: {},
    data: () => ({
      //
    }),
    created() {
      this.$vuetify.theme.dark = true
    },
  }
</script>

<style lang="scss">
</style>
