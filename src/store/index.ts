import Vue from 'vue'
import Vuex from 'vuex'
import Connection from '@/model/Connection'
import electronStore from '@/store/electronStore'

Vue.use(Vuex)

interface State {
  connections: Array<Connection>;
  selectedConnection: Connection | null;
}

const state: State = {
  connections: electronStore.getConnections(),
  selectedConnection: electronStore.getConnection()
}

export default new Vuex.Store({
  state,
  getters: {
    connections (state): Array<Connection> {
      return state.connections
    },
    connection (state): Connection | null {
      return state.selectedConnection
    }
  },
  mutations: {
    setConnections (state, connections: Array<Connection>) {
      state.connections = connections
      electronStore.setConnections(connections)
    },
    setSelectedConnection (state, connection: Connection) {
      state.selectedConnection = connection
      electronStore.setConnection(connection)
    },
    deleteConnection (state, connection: Connection) {
      const c: Connection | undefined = state.connections.find(c => c.id === connection.id)
      if (c) {
        state.connections.splice(state.connections.indexOf(c), 1)
      }
      if (state.selectedConnection && state.selectedConnection.id === connection.id) {
        state.selectedConnection = null
        electronStore.setConnection(null)
      }
      electronStore.setConnections(state.connections)
    }
  },
  actions: {
    saveConnection ({ state, commit }, connection: Connection) {
      if (connection.id) { // UPDATE
        const c: Connection | undefined = state.connections.find(c => c.id === connection.id)
        if (c) {
          c.name = connection.name
          c.boostrapServers = connection.boostrapServers
        }
      } else { // NEW
        connection.id = state.connections.length === 0 ? 1 : Math.max(...state.connections.map(c => c.id)) + 1
        state.connections.push(connection)
      }
      commit('setSelectedConnection', connection)
      commit('setConnections', state.connections)
    }
  },
  modules: {}
})
