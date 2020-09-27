<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      mini-variant
    >
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

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
