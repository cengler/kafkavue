<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      mini-variant
    >
      <!--  -->
      <v-list dense>
        <v-list-item link to="/search">
          <v-list-item-action>
            <v-icon>fas fa-search</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Search</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/nodes">
          <v-list-item-action>
            <v-icon>fas fa-server</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Nodes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/consumers">
          <v-list-item-action>
            <v-icon>fas fa-user-friends</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Consumers</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/setup">
          <v-list-item-action>
            <v-icon>fas fa-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Setup</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-btn icon @click="drawer = !drawer"><v-icon>fas fa-bars</v-icon></v-btn>

      <v-toolbar-title>Kafkavue</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data: () => ({
    drawer: null
  }),
  created () {
    this.$vuetify.theme.dark = true
  }
}
</script>

<style lang="scss">
</style>
