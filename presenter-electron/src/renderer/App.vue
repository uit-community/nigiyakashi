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
      const batch = firebase.firestore().batch()
      const talksRef = firebase
        .firestore()
        .collection('shared')
        .doc('public')
        .collection('talks')
      const votesRef = firebase.firestore().collection('votes')

      const talks = await talksRef.get()
      await Promise.all(
        talks.docs.map(async talkSnapshot => {
          for (let i = 0; i < 10; i++) {
            const test = votesRef
              .doc(talkSnapshot.id)
              .collection('counters')
              .doc(`${i}`)
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
  border: solid 1px #fff;
  border-radius: 4px;
  -webkit-app-region: drag;
  background: rgba(0, 0, 0, 0);
  font-family: 'Source Sans Pro', sans-serif;
}
</style>
