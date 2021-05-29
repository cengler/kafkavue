<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-img src="/icon.png"/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Kafka Vue</v-list-item-title>
            <v-list-item-subtitle>Kafka tool</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list dense>
        <v-divider/>
        <template v-for="menu in menuItems">
          <v-list-item link :to="menu.link" :key="menu.link" :disabled="menu.link !== '/' && connection === null">
            <v-list-item-action>
              <v-icon>{{menu.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{menu.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title>
        <v-breadcrumbs large :items="breadcrumbs"></v-breadcrumbs>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon class="ml-2 mr-2" to="/edit">
        <v-icon class="fas fa-plus-circle"></v-icon>
      </v-btn>
      <v-select
        ma-5
        :items="connections"
        label="Kafka"
        placeholder="Select a kafka"
        item-text="name"
        v-model="connection"
        return-object
        style="max-width: 400px"
        flat
        solo-inverted
        hide-details
      >
        <template v-slot:item="{ item }">
          <span> {{ item.name }} {{item.boostrapServers}} </span>
        </template>
        <template v-slot:selection="{ item }">
          <span> {{ item.name }} {{item.boostrapServers}} </span>
        </template>
      </v-select>
    </v-app-bar>

    <v-main fluid>
      <router-view />
    </v-main>

    <v-footer app inset>
        <LogFooter/>
    </v-footer>

  </v-app>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import LogFooter from './components/LogFooter'

@Component({
  components: {
    LogFooter
  }
})
export default class App extends Vue {
  drawer = null
  menuItems = [
    {
      icon: 'fas fa-user-secret',
      link: '/brokers',
      title: 'Brokers'
    },
    {
      icon: 'fas fa-stream',
      link: '/topics',
      title: 'Topics'
    },
    {
      icon: 'fas fa-user-friends',
      link: '/consumers',
      title: 'Consumers'
    },
    {
      icon: 'fas fa-cog',
      link: '/',
      title: 'Setup'
    }
  ]

  get breadcrumbs () {
    return this.$store.getters.breadcrumbs
  }

  created () {
    this.$vuetify.theme.dark = true
    if (!this.connections.length) {
      this.$router.push({ path: '/edit' })
    }
  }

  get viewName () {
    return this.$route.name
  }

  get connection () {
    return this.$store.getters.connection
  }

  set connection (value) {
    this.$store.commit('setSelectedConnection', value)
  }

  get connections () {
    return this.$store.getters.connections
  }
}
</script>

<style>
.v-navigation-drawer {
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.v-navigation-drawer::-webkit-scrollbar {
  display: none;
}

.v-application--is-ltr .v-list-item__icon:first-child, .v-application--is-ltr .v-list-item__action:first-child {
  margin-right: 11px !important;
}

.v-list-item__action {
  margin-top:8px;
  margin-bottom:8px;
}
</style>
