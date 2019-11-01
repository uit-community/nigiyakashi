import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { config } from './firebase.config'

const app = firebase.initializeApp({
  ...config
})

export default app
