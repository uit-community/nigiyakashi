import { RootState } from '@/store'
import { Module } from 'vuex'
import { incrementCounter } from '@/utils/firestore'

export interface ReactionState {
  isLoading: boolean
  reactionData: number
  presentationName: string
  threshold: number
}

const reaction: Module<ReactionState, RootState> = {
  namespaced: true,

  state: {
    isLoading: false,
    reactionData: 0,
    presentationName: '',
    threshold: 100
  },

  getters: {
    getReactionData(state) {
      return state.reactionData
    },
    getPresentationName(state) {
      return state.presentationName
    }
  },

  mutations: {
    startLoading(state) {
      state.isLoading = true
    },
    endLoading(state) {
      state.isLoading = false
    },
    setReaction(state, data) {
      state.reactionData = data
      state.isLoading = false
    },
    setPresentation(state, data) {
      state.presentationName = data
      state.isLoading = false
    },
    resetPresentation(state) {
      state.presentationName = ''
      state.isLoading = false
    },
    setThreshold(state, data) {
      state.threshold = data
      state.isLoading = false
    }
  },

  actions: {
    reactionPresentation({ state, rootState }) {
      if (
        !rootState.auth.user ||
        !state.presentationName ||
        state.presentationName === ''
      ) {
        return
      }
      incrementCounter(state.presentationName)
    },

    addReactionCounter({ commit }, reactionData: number) {
      commit('setReaction', reactionData)
    },

    addPresentation({ commit }, presentationName: string) {
      commit('startLoading')
      commit('setPresentation', presentationName)
    },

    deletePresentation({ commit }) {
      commit('startLoading')
      commit('resetPresentation')
    },

    addThreshold({ commit }, threshold: number) {
      if (!threshold) {
        return
      }
      commit('startLoading')
      commit('setThreshold', threshold)
    }
  }
}

export default reaction
