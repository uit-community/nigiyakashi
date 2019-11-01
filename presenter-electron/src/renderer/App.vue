<template>
  <div id="app">
    <TheMainView :firebase="firebase" v-if="isPlaying" />
    <TheInitialize @submit="launchPresenterView" v-else />
  </div>
</template>

<script>
import TheMainView from './components/TheMainView.vue'
import TheInitialize from './components/TheInitialize.vue'
import firebase, { firestore } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default {
  name: 'nigiyakashi-viewer',
  components: {
    TheInitialize,
    TheMainView
  },
  data() {
    return {
      isPlaying: false,
      firebase: null
    }
  },
  mounted() {
    window.document.onkeydown = event => {
      if (event.keyCode === 219 && event.altKey) {
        window.history.back()
      }
    }
  },
  methods: {
    async launchPresenterView(config) {
      firebase.initializeApp({
        ...config
      })
      await firebase.auth().signInWithEmailAndPassword('admin@example.com', config.password)
      const batch = firebase.firestore().batch()
      const presentationsRef = firebase.firestore().collection('/presentations')
      const countersRef = firebase.firestore().collection('/counters')

      const data = await presentationsRef.get()
      await Promise.all(
        data.forEach(async doc => {
          for (let i = 0; i < ~~3; i++) {
            const test = countersRef
              .doc(doc.id)
              .collection('counters')
              .doc(i.toString())
            batch.set(test, { count: 0 })
          }
        })
      )
      batch.commit()
      this.firebase = firebase
      this.isPlaying = true
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}
</style>
