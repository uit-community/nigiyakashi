import './MainView.css'
import React from 'react'
import thumbsUpIcon from '../assets/thumbs-up.svg'

const Matter = require('matter-js')

const matter = {
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
  removeArray: []
} as any

type State = {
  totalCount: number
  metadata: {
    currentTalk: string
    isVisibleCount: boolean
    threshold: number
  }
  ui: {
    screenWidth: number
    screenHeight: number
    isActiveCountUp: boolean
  }
}

export class MainView extends React.Component<{ firebase: firebase.app.App }, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      totalCount: 0,
      metadata: {
        currentTalk: '',
        isVisibleCount: false,
        threshold: 0
      },
      ui: {
        screenWidth: window.innerWidth * 2,
        screenHeight: window.innerHeight * 2,
        isActiveCountUp: false
      }
    }
  }

  selectPresentation(currentTalk: string) {
    this.props.firebase
      .firestore()
      .collection('votes')
      .doc(name)
      .collection('counters')
      .onSnapshot((snapshot: any) => {
        let totalCount = 0
        snapshot.forEach((doc: any) => {
          totalCount += doc.data().count
        })
        this.setState({
          totalCount
        })
        snapshot.docChanges().forEach((change: any) => {
          if (change.type === 'modified' && change.doc.data().count) {
            if (parseInt(change.doc.id) < this.state.metadata.threshold) {
              this.bound()
            }
            requestAnimationFrame(() => {
              this.setState({
                ui: {
                  ...this.state.ui,
                  isActiveCountUp: false
                }
              })
              requestAnimationFrame(() => {
                this.setState({
                  ui: {
                    ...this.state.ui,
                    isActiveCountUp: true
                  }
                })
              })
            })
          }
        })
      })
  }

  bound() {
    const boundPositionX = Math.random() * (matter.winWidth - 0)

    const thumbsObj = matter.bodies.rectangle(
      boundPositionX,
      matter.winHeight,
      80,
      80,
      {
        restitution: matter.threshold,
        mass: 1.4,
        render: {
          sprite: {
            texture: thumbsUpIcon,
            xScale: 4,
            yScale: 4
          }
        }
      }
    )

    const boundDirectionX = (Math.floor(Math.random() * 201) - 100) / 1000
    matter.body.applyForce(
      thumbsObj,
      { x: thumbsObj.position.x, y: thumbsObj.position.y },
      { x: boundDirectionX, y: -0.09 }
    )
    matter.worlds.add(matter.engine.world, [thumbsObj])

    setInterval(() => {
      this.remove(thumbsObj)
    }, 5000)
    return this
  }

  remove(item: any) {
    matter.removeArray.push(item)
    matter.composite.remove(matter.world, matter.removeArray[0])
    matter.removeArray.shift()
  }

  componentDidMount() {
    this.props.firebase
      .firestore()
      .collection('shared')
      .doc('metadata')
      .onSnapshot((snapshot)=> {
        const metaData = { ...snapshot.data() } as any
        this.setState({
          metadata: {
            currentTalk: this.state.metadata.currentTalk,
            isVisibleCount: metaData.isVisibleCount,
            threshold: metaData.threshold
          }
        })
        if (metaData.currentTalk !== this.state.metadata.currentTalk) {
          this.setState({
            metadata: {
              currentTalk: metaData.currentTalk,
              isVisibleCount: metaData.isVisibleCount,
              threshold: metaData.threshold
            }
          })
          this.selectPresentation(this.state.metadata.currentTalk)
        }
      })

    setInterval(() => {
      this.setState({
        ui: {
          ...this.state.ui,
          isActiveCountUp: false
        }
      })
    }, 400)
    const Engine = Matter.Engine,
      Render = Matter.Render

    matter.body = Matter.Body
    matter.bodies = Matter.Bodies
    matter.worlds = Matter.World
    matter.composite = Matter.Composite
    ;(matter.engine = Engine.create()), (matter.world = matter.engine.world)
    let canvas = document.getElementById('canvas')

    matter.winWidth = window.innerWidth * 2
    matter.winHeight = window.innerHeight * 2

    const render = Render.create({
      canvas: canvas,
      engine: matter.engine,
      options: {
        width: matter.winWidth,
        height: matter.winHeight,
        background: 'FFF',
        wireframes: false,
        showAngleIndicator: false
      }
    })

    const ground = matter.bodies.rectangle(
      matter.winWidth * 2,
      matter.winHeight * 2,
      matter.winWidth * 2,
      matter.winHeight * 2,
      {
        isStatic: true
      }
    )

    matter.worlds.add(matter.world, [ground, 0, matter.winHeight * 2, 100])

    Engine.run(matter.engine)
    Render.run(render)
  }

  render() {
    return (
      <div id="wrapper">
        <main>
          <div>
            <div className="overlay">
              <canvas
                id="canvas"
                width={this.state.ui.screenWidth}
                height={this.state.ui.screenHeight}
                className="canvas"
              />
            </div>
            <div
              id="count"
              v-if="isVisibleCount"
              className={this.state.ui.isActiveCountUp ? 'active' : ''}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
                id="counter"
              >
                <img
                  src="../assets/thumbs-up.svg"
                  width="30"
                  style={{
                    marginRight: '10px'
                  }}
                  alt=""
                />
                <span>{this.state.totalCount}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}
