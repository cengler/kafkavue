<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item tag="div">
          <v-list-item-content><v-list-item-title>Kafka Vue</v-list-item-title></v-list-item-content>
        </v-list-item>
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
      <v-toolbar-title>{{ viewName }}</v-toolbar-title>
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

    <v-main>
      <router-view />
    </v-main>

    <v-footer app inset class="hidden-md-and-down">
      <v-layout justify-center row wrap>
        <span>Please, report errors to:
          <a href="https://github.com/cengler/kafkavue/issues">Github issues</a>
        </span>
      </v-layout>
    </v-footer>

  </v-app>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component
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
      icon: 'fas fa-search',
      link: '/search',
      title: 'Search'
    },
    {
      icon: 'fas fa-paper-plane',
      link: '/sender',
      title: 'Sender'
    },
    {
      icon: 'fas fa-cog',
      link: '/',
      title: 'Setup'
    }
  ]

  created () {
    this.$vuetify.theme.dark = true
    console.log(this.connections.length)
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
