import Vue from 'vue'
import Vuex from 'vuex'
import auth, { AuthState } from './auth'
import reaction, { ReactionState } from './reaction'

Vue.use(Vuex)

export interface RootState {
  auth: AuthState
  reaction: ReactionState
}

export default new Vuex.Store<RootState>({
  modules: { auth, reaction }
})
