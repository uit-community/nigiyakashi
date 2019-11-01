import { UserInfo } from '@/types/user'
import { usersRef } from '@/utils/firestore'
import firebase from 'firebase'
import { Module } from 'vuex'
import { RootState } from './index'

export interface AuthState {
  user: firebase.User | null
  userInfo: UserInfo | null
  unsubscribe: firebase.Unsubscribe | null
  isLoading: boolean
  error: firebase.FirebaseError | null
}

const auth: Module<AuthState, RootState> = {
  namespaced: true,

  state: () => ({
    user: null,
    userInfo: null,
    unsubscribe: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isSignedIn(state) {
      return state.user && state.userInfo
    }
  },

  mutations: {
    setUser(state, user: firebase.User | null) {
      state.user = user
      state.userInfo = user ? state.userInfo : null
      state.isLoading = false
    },

    setUserInfo(state, userInfo: UserInfo | null) {
      state.userInfo = state.user ? userInfo : null
      state.isLoading = false
    },

    setUnsubscribe(state, unsubscribe: firebase.Unsubscribe | null) {
      state.unsubscribe = unsubscribe
    },

    startLoading(state) {
      state.isLoading = true
      state.error = null
    },

    endLoading(state, error: firebase.FirebaseError | null) {
      state.isLoading = false
      state.error = error
    }
  },

  actions: {
    async observeUser({ state, commit, dispatch }) {
      if (state.unsubscribe) {
        return
      }

      commit('startLoading')

      const unsubscribe = await firebase.auth().onAuthStateChanged(
        user => {
          commit('setUser', user)
          dispatch('getUserInfo')
        },
        error => commit('endLoading', error)
      )

      commit('setUnsubscribe', unsubscribe)
    },

    async signIn({ state, commit, dispatch }) {
      if (state.user) {
        return
      }

      commit('startLoading')
      try {
        const { user } = await firebase.auth().signInAnonymously()
        commit('setUser', user)
        dispatch('getUserInfo')
      } catch (error) {
        commit('endLoading', error)
      }
    },
    async signOut({ commit }) {
      commit('startLoading')
      try {
        await firebase.auth().signOut()
        commit('endLoading')
      } catch (error) {
        commit('endLoading', error)
      }
    },

    async getUserInfo({ state, commit }) {
      if (!state.user) {
        return
      }

      commit('startLoading')
      try {
        const snapshot = await usersRef.doc(state.user!.uid).get()
        commit('setUserInfo', snapshot.data())
      } catch (error) {
        commit('endLoading', error)
      }
    },

    async updateUserInfo({ state, commit }, userInfo: UserInfo) {
      if (!state.user) {
        return
      }

      commit('startLoading')
      try {
        await usersRef.doc(state.user!.uid).set({ name: userInfo })
        commit('setUserInfo', { name: userInfo })
      } catch (error) {
        commit('endLoading', error)
      }
    }
  }
}

export default auth
