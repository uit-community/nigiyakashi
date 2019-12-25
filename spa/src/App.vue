<template>
  <div
    class="container home-wrapper"
    :class="{
      'is-main': true,
      'is-active': reactionAnimationStacks.length
    }"
  >
    <div class="home-first" v-if="!latestSyncedAt">
      <div></div>
      <TheLoader />
      <div></div>
    </div>
    <div class="content home" v-else>
      <div class="home">
        <template>
          <div class="reaction-info">
            <!-- <h2>Reactions: {{ reactionData }}</h2> -->
            <h2>Current Talk: {{ talkData.title }} </h2>
          </div>
          <div class="home-main-content">
            <div
              class="balloon"
              :class="{ 'is-hidden': reactionAnimationStacks.length }"
            >「いいね」と思ったらタップ！</div>
            <button ontouchstart @click="handleClickUpvote" class="button add_btn">
              <div style="width: 100px;height: 100px;position: relative">
                <img src="@/assets/thumbs-up.svg" key="1" width="100" alt />
                <img
                  src="@/assets/thumbs-up.svg"
                  class="reaction-animation"
                  v-for="anim in reactionAnimationStacks"
                  :key="anim"
                  width="100"
                  alt
                />
              </div>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TheLoader from "./components/TheLoader.vue";
import { firestore, METADATA_REF, FieldValue } from "./externals/firebase";

const SHARDS = 30

type MetaData = {
  id: string;
  isVisibleCount: boolean;
  currentTalk: string;
};

type TalkData = {
  id: string;
  title: string;
};

type LocalData = {
  reactionAnimationStacks: any[];
  latestSyncedAt: number;
  metaData: MetaData;
  talkData: TalkData;
};

export default Vue.extend({
  name: "app",
  data(): LocalData {
    return {
      reactionAnimationStacks: [],
      latestSyncedAt: 0,
      metaData: {
        id: "",
        isVisibleCount: false,
        currentTalk: ""
      },
      talkData: {
        id: "",
        title: ""
      }
    };
  },
  components: {
    TheLoader
  },
  mounted() {
    METADATA_REF.onSnapshot(snapshot => {
      this.onUpdateMetaData(snapshot);
    });
  },
  methods: {
    async handleClickUpvote() {
      const randomId = `${Math.random()}`.split(".")[1];
      this.reactionAnimationStacks.push(randomId);
      setTimeout(() => {
        this.reactionAnimationStacks = this.reactionAnimationStacks.filter(
          id => {
            return id !== randomId;
          }
        );
      }, 2000);
      const SHARD_ID = Math.floor(Math.random() * SHARDS).toString()
      try {
        await firestore
          .collection('votes')
          .doc(this.talkData.id)
          .collection('counters')
          .doc(SHARD_ID)
          .update('count', FieldValue.increment(1))
      } catch(e) {

      }
    },
    async onUpdateMetaData(metaSnapshot: firebase.firestore.DocumentSnapshot) {
      const metaData = {
        id: metaSnapshot.id,
        ...metaSnapshot.data()
      } as MetaData;
      this.metaData = metaData;
      const talkSnapshot = await firestore
        .collection("shared")
        .doc("public")
        .collection("talks")
        .doc(metaData.currentTalk)
        .get();
      this.talkData = {
        id: talkSnapshot.id,
        ...talkSnapshot.data()
      } as TalkData;
      this.latestSyncedAt = new Date().getTime();
    }
  }
});
</script>

<style lang="scss">
html {
  touch-action: manipulation;
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: calc(var(--vh, 1vh) * 100);
}

.container {
  width: 100vw;
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  padding: 1rem 2rem;
  background-color: #fcfcfd;
  box-shadow: 0 0 1px 0 rgba(10, 31, 68, 0.08),
    0 1px 1px 0 rgba(10, 31, 68, 0.08);
  border: none;
  border-radius: 4px;
}

header {
  position: fixed;
  width: 100%;
  height: 60px;
  background: #fcfcfd;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  font-weight: bold;
  text-align: center;
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &.is-main {
    &::before {
      animation: fadeOutColor 0.6s ease-out;
      z-index: 10;
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      opacity: 0;
      pointer-events: none;
      background: linear-gradient(-120deg, #60b0d7, #00f1b8);
    }
  }
  &::after {
    z-index: 20;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    transition: 0.4s ease-out;
    opacity: 0;
    pointer-events: none;
    background: linear-gradient(-120deg, #60b0d7, #00f1b8);
  }
  &.is-active {
    .reaction-info {
      color: #fff;
      h2 {
        color: #fff;
        border-bottom-color: #fff;
      }
    }
    &::after {
      opacity: 1;
      background: linear-gradient(-120deg, #60b0d7, #00f1b8);
    }
  }
}

.content.home {
  // display: none
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeOutColor {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.home-first {
  width: 100%;
  min-height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.home-main-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.signin-wrapper {
  animation: horizontal 1s ease-in-out infinite alternate;
}

.signin {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  font-size: 24px;
  color: #fff;
  background: transparent;
  border: solid 2px #fff;
  background: linear-gradient(-120deg, #60b0d7, #00f1b8);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: vertical 1s ease-in-out infinite alternate;
}

@keyframes horizontal {
  0% {
    -webkit-transform: translateX(-3px);
  }
  100% {
    -webkit-transform: translateX(0px);
  }
}

@keyframes vertical {
  0% {
    -webkit-transform: translateY(-3px);
  }
  100% {
    -webkit-transform: translateY(0px);
  }
}
.home {
  z-index: 100;
  width: 100%;
  min-height: 40vh;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  .add_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    background-color: transparent;
    font-size: 90px;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    border-radius: 100%;
    border: solid 3px #fff;
    outline: none;
    transition: 0.05s ease-in;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background: linear-gradient(-120deg, #60b0d7, #00f1b8);
    &:active {
      transform: translateY(4px) scale(1.025);
      box-shadow: 0 0px 20px rgba(0, 0, 0, 0.2);
    }
  }
  .logout {
    position: fixed;
    top: 0;
    right: 0;
  }
}

.home-first {
  background: linear-gradient(-120deg, #60b0d7, #00f1b8);
}

.reaction-animation {
  animation: reaction-slideout-animation 1s cubic-bezier(0.165, 0.84, 0.44, 1)
    forwards;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}

@keyframes reaction-slideout-animation {
  0% {
    transform: translateY(-20px) rotateZ(0deg) scale(1);
    opacity: 1;
  }
  // 80% { transform: translateY(-200px) rotateZ(-30deg) scale(1.2) opacity: 0;.05 }
  100% {
    transform: translateY(-750px) rotateZ(-40deg) scale(2);
    opacity: 0;
  }
}

@keyframes reaction-shift-1 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-10px);
  }
}

.is-hidden {
  opacity: 0;
  pointer-events: none;
}

h2 {
  color: #fff;
}

.reaction-info {
  position: fixed;
  left: 0px;
  top: 4px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: start;
  h2 {
    color: #000;
    display: inline-block;
    font-size: 14px;
    padding: 4px;
    margin-top: 4px;
    margin-bottom: 4px;
    border-bottom: solid 2px;
  }
}

.balloon {
  color: #fff;
  -webkit-text-stroke: 1px #000;
  border: solid 3px #000;
  padding: 20px;
  position: relative;
  border-bottom-color: transparent;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.2s;
}

.balloon:before {
  content: "";
  position: absolute;
  bottom: -3px;
  left: -3px;
  right: -3px;
  width: calc(100% + 6px);
  height: 3px;
  background: linear-gradient(
    to right,
    #000 calc(50% - 11px),
    transparent calc(50% - 11px),
    transparent calc(50% + 11px),
    #000 calc(50% + 11px)
  );
}

.balloon:after {
  content: "";
  position: absolute;
  left: calc(50% - 20px);
  bottom: -8px;
  height: 16px;
  width: 16px;
  border-bottom: 3px solid #000;
  border-left: 3px solid #000;
  transform: rotate(-45deg);
  transform-origin: top right;
}
</style>
