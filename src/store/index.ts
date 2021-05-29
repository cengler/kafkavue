import Vue from 'vue'
import Vuex from 'vuex'
import Connection from '@/model/Connection'
import electronStore from '@/store/electronStore'

Vue.use(Vuex)

interface State {
  connections: Array<Connection>;
  selectedConnection: Connection | null;
  breadcrumbs: {
    text: string;
    disabled: boolean;
    to: string;
  }[];
  status: {
    left: {text: string; icon: string};
    right: {text: string; icon: string};
  };
}

const state: State = {
  connections: electronStore.getConnections(),
  selectedConnection: electronStore.getConnection(),
  breadcrumbs: [],
  status: { left: { text: '', icon: '' }, right: { text: '', icon: '' } }
}

export default new Vuex.Store({
  state,
  getters: {
    connections (state): Array<Connection> {
      return state.connections
    },
    connection (state): Connection | null {
      return state.selectedConnection
    },
    breadcrumbs (state): { text: string; disabled: boolean; to: string }[] {
      return state.breadcrumbs
    },
    status (state): {left: {text: string; icon: string}; right: {text: string; icon: string}} {
      return state.status
    }
  },
  mutations: {
    setBreadcrumbs (state, breadcrumbs: { text: string; disabled: boolean; to: string }[]) {
      state.breadcrumbs = breadcrumbs
    },
    setConnections (state, connections: Array<Connection>) {
      state.connections = connections
      electronStore.setConnections(connections)
    },
    setStatus (state, status: {left: {text: string; icon: string}; right: {text: string; icon: string} }) {
      state.status = status
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
    /*
    registerListener({ state, commit }, event: ValueOf<ConsumerEvents | AdminEvents>, listener: (...args: any[]) => void) {
      commit(e, null)
    }
    */
  },
  modules: {}
})
