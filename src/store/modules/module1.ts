import { Commit } from 'vuex'
import Vuex from 'vuex'

export interface Module1State {
  name: null | string
}

export default new Vuex.Store({
  state: {
    name: null
  } as Module1State,
  getters: {
    message: (state: Module1State) => `Hello, ${state.name}!`
  },
  mutations: {
    SET_NAME(state: Module1State, newName: string) {
      state.name = newName
    },
  },
  actions: {
    async loadName({ commit }, payload: { id: string }) {
      const name = `Name-${payload.id}` // load it from somewhere
      commit("SET_NAME", name)
      return { name }
    }
  }
})
