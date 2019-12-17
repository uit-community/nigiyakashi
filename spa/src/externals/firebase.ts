import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { config } from './firebase.config'

export const app = firebase.initializeApp({
  ...config
})
export const firestore = app.firestore()
export const auth = app.auth()
export const FieldValue = firebase.firestore.FieldValue

export const METADATA_REF = firestore.collection('shared').doc('metadata')
