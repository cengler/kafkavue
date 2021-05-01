import Vue from 'vue'
import Vuex from 'vuex'
import Connection from '@/model/Connection'

Vue.use(Vuex)

interface State {
  connections: Array<Connection>;
  selectedConnection: Connection | null;
}

const state: State = {
  connections: Array<Connection>(),
  selectedConnection: null
}

export default new Vuex.Store({
  state,
  getters: {
    connections (state) {
      return state.connections
    },
    connection (state) {
      return state.selectedConnection
    }
  },
  mutations: {
    addConnection (state, connection: Connection) {
      state.connections.push(connection)
      state.selectedConnection = connection
    },
    setSelectedConnection (state, connection: Connection) {
      state.selectedConnection = connection
    }
  },
  actions: {
    addConnection (context, connection: Connection) {
      context.commit('addConnection', connection)
    }
  },
  modules: {}
})
