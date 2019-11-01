import firebase from './firebase'
import { firestore } from 'firebase/app'

import store from '@/store'

const datastore = firebase.firestore()

export const usersRef = datastore.collection('/users')
const NUM_SHARDS = 10

export const initCounter = async () => {
  const batch = datastore.batch()
  const presentationsRef = datastore.collection('/presentations')
  const countersRef = datastore.collection('/counters')

  const data = await presentationsRef.get()
  data.forEach(async doc => {
    for (let i = 0; i < ~~3; i++) {
      const test = countersRef
        .doc(doc.id)
        .collection('counters')
        .doc(i.toString())
      batch.set(test, { count: 0 })
    }
  })
  batch.commit()
}

export const incrementCounter = (presentationName: string) => {
  const SHARD_ID = Math.floor(Math.random() * NUM_SHARDS).toString()
  return datastore
    .collection('counters')
    .doc(presentationName)
    .collection('counters')
    .doc(SHARD_ID)
    .update('count', firestore.FieldValue.increment(1))
}

const setCounter = (presentation: string) => {
  datastore
    .collection('counters')
    .doc(presentation)
    .collection('counters')
    .onSnapshot(snapshot => {
      let TOTAL_COUNT = 0
      snapshot.forEach(doc => {
        if (doc.data().count) {
          TOTAL_COUNT += doc.data().count
        }
      })
      store.dispatch('reaction/addReactionCounter', TOTAL_COUNT)
    })
}

datastore
  .collection('admin')
  .doc('setting')
  .onSnapshot(snapshot => {
    const presentation = snapshot.get('presentation')
    const threshold = snapshot.get('threshold')
    if (!presentation || presentation === '') {
      store.dispatch('reaction/deletePresentation')
    } else {
      store.dispatch('reaction/addPresentation', presentation)
      setCounter(presentation)
    }

    store.dispatch('reaction/addThreshold', threshold)
  })
