<template>
  <div id="wrapper">
    <main>
      <div>
        <div class="overlay">
          <canvas id="canvas" :width="screenWidth" :height="screenHeight" class="canvas" />
        </div>
        <div id="count" v-if="isVisibleCount" :class="{
          'active': isActiveCountUp
        }">{{totalCount}}</div>
        <!-- <webview class="webview" :src="url"></webview> -->
      </div>
    </main>
  </div>
</template>

<style scoped>
#count.active {
  animation: growup 0.2s ease-out forwards;
}

@keyframes growup {
  0% {
    transform: scale(1) translateY(0);
  }
  40% {
    transform: scale(1.4) translateY(-5px);
  }
  0% {
    transform: scale(1) translateY(0);
  }
}

#wrapper {
  height: calc(100vh - 2px);
  width: calc(100vw - 2px);
  position: relative;
}

#count {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: 40px;
  color: #fff;
  font-family: Futura;
  filter: drop-shadow(0 0 10px rgba(81, 154, 186, 1));
}

.webview {
  width: calc(100vw - 2px);
  height: calc(100vh - 2px);
  overflow: scroll;
}

.overlay {
  position: absolute;
  width: calc(100vw - 2px);
  height: calc(100vh - 2px);
  pointer-events: none;
}

.overlay > canvas {
  width: calc(100vw - 2px);
  height: calc(100vh - 2px);
}
</style>

<script>
import { TweenMax, Power2, TimelineLite } from 'gsap/TweenMax'
import Matter from 'matter-js'
import { constants } from 'fs'

import thumbsUpIcon from '../assets/thumbs-up.svg'

export default {
  name: 'TheMainView',
  props: {
    firebase: Object
  },
  data() {
    return {
      presentation: 'uit',
      threshold: 0,
      counter: 0,
      engine: {},
      body: {},
      bodies: {},
      worlds: {},
      world: {},
      composite: {},
      wordBodyList: [],
      winWidth: 0,
      winHeight: 0,
      removeArray: [],
      url: '',
      totalCount: 0,
      isVisibleCount: false,
      isActiveCountUp: false
    }
  },
  created() {
    this.firebase
      .firestore()
      .collection('shared')
      .doc('metadata')
      .onSnapshot(snapshot => {
        const metaData = { id: snapshot.id, ...snapshot.data() }
        this.isVisibleCount = metaData.isVisibleCount
        if (metaData.currentTalk !== this.presentation) {
          this.presentation = metaData.currentTalk
          this.selectPresentation(this.presentation)
        }
      })
  },
  computed: {
    screenWidth() {
      return window.innerWidth * 2
    },
    screenHeight() {
      return window.innerHeight * 2
    }
  },
  mounted() {
    setInterval(() => {
      this.isActiveCountUp = false
    }, 400)
    const Engine = Matter.Engine,
      Render = Matter.Render

    this.body = Matter.Body
    this.bodies = Matter.Bodies
    this.worlds = Matter.World
    this.composite = Matter.Composite
    ;(this.engine = Engine.create()), (this.world = this.engine.world)
    let canvas = document.getElementById('canvas')

    this.winWidth = window.innerWidth * 2
    this.winHeight = window.innerHeight * 2

    const render = Render.create({
      canvas: canvas,
      engine: this.engine,
      options: {
        width: this.winWidth,
        height: this.winHeight,
        background: 'FFF',
        wireframes: false,
        showAngleIndicator: false
      }
    })

    const ground = this.bodies.rectangle(
      this.winWidth * 2,
      this.winHeight * 2,
      this.winWidth * 2,
      this.winHeight * 2,
      {
        isStatic: true
      }
    )

    this.worlds.add(this.world, [ground, 0, this.winHeight * 2, 100])

    Engine.run(this.engine)
    Render.run(render)
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    selectPresentation(name) {
      this.firebase
        .firestore()
        .collection('votes')
        .doc(name)
        .collection('counters')
        .onSnapshot(snapshot => {
            let total_count = 0;
            snapshot.forEach(doc => {
                total_count += doc.data().count;
            });

          this.totalCount = total_count;
          snapshot.docChanges().forEach(change => {
            if (change.type === 'modified' && change.doc.data().count) {
              if (parseInt(change.doc.id) < 7) {
                this.bound()
              }
              requestAnimationFrame(() => {
                this.isActiveCountUp = false
                requestAnimationFrame(() => {
                  this.isActiveCountUp = true
                })
              })
            }
          })
        })
    },
    bound() {
      const boundPositionX = Math.random() * (this.winWidth - 0)

      const thumbsObj = this.bodies.rectangle(
        boundPositionX,
        this.winHeight,
        100,
        100,
        {
          restitution: this.threshold,
          mass: 1.4,
          render: {
            sprite: {
              texture: thumbsUpIcon,
              xScale: 5,
              yScale: 5
            }
          }
        }
      )

      const boundDirectionX = (Math.floor(Math.random() * 201) - 100) / 1000
      this.body.applyForce(
        thumbsObj,
        { x: thumbsObj.position.x, y: thumbsObj.position.y },
        { x: boundDirectionX, y: -0.09 }
      )
      this.worlds.add(this.engine.world, [thumbsObj])

      setInterval(() => {
        this.remove(thumbsObj)
      }, 5000)
      return this
    },
    remove(item) {
      this.removeArray.push(item)
      this.composite.remove(this.world, this.removeArray[0])
      this.removeArray.shift()
    }
  }
}
</script>
