import './main.css'
import React from 'react'
import { render } from 'react-dom'
import { Launcher } from './components/Launcher'
import { MainView } from './components/MainView'
import { LauncherForm, LauncherFormData } from './components/LauncherForm'
import * as firebase from 'firebase'
import * as storage from './utils/storage'

type State = {
  mode: 'launcher' | 'mainview'
  firebase: any
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = {
      mode: 'launcher',
      firebase: null
    }
  }

  render() {
    return (
      <div>
        {
          this.state.mode === 'launcher' && (
            <Launcher handleSubmit={(formData: LauncherFormData) => {
              this.setState({
                firebase: firebase.initializeApp({...formData})
              })
              Object.entries(formData).forEach(([k,v]) => {
                storage.save(k, v)
              })
              this.setState({ mode: 'mainview' })
            }} />
          )
        }
        {
          this.state.mode === 'mainview' && (
            <MainView firebase={this.state.firebase} />
          )
        }
      </div>
    )
  }
}

render(
  (<App />),
  document.getElementById('root')!
)
