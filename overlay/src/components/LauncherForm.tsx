import React, { useState } from 'react'
import * as storage from '../utils/storage'

export type LauncherFormData = {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
}

export const LauncherForm: React.FC<{
  handleSubmit: (formData: LauncherFormData) => void
}> = ({ handleSubmit }) => {
  const [apiKey, setApiKey] = useState(storage.load('apiKey') || '')
  const [authDomain, setAuthDomain] = useState(storage.load('authDomain') || '')
  const [databaseURL, setDatabaseURL] = useState(storage.load('databaseURL') || '')
  const [projectId, setProjectId] = useState(storage.load('projectId') || '')

  return (
    <form
      className="LauncherForm"
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit({
          apiKey,
          authDomain,
          databaseURL,
          projectId
        })
      }}
    >
      <p>
        <label>
          <span>APIKEY</span>
          <br />
          <input
            type="text"
            defaultValue={apiKey}
            onInput={event => {
              setApiKey(event.currentTarget.value)
            }}
          />
        </label>
      </p>
      <p>
        <label>
          <span>Auth Domain</span>
          <br />
          <input
            type="text"
            defaultValue={authDomain}
            onInput={event => {
              setAuthDomain(event.currentTarget.value)
            }}
          />
        </label>
      </p>
      <p>
        <label>
          <span>Database URL</span>
          <br />
          <input
            type="text"
            defaultValue={databaseURL}
            onInput={event => {
              setDatabaseURL(event.currentTarget.value)
            }}
          />
        </label>
      </p>
      <p>
        <label>
          <span>Project ID</span>
          <br />
          <input
            type="text"
            defaultValue={projectId}
            onInput={event => {
              setProjectId(event.currentTarget.value)
            }}
          />
        </label>
      </p>
      <p>
        <button type="submit">Launch</button>
      </p>
    </form>
  )
}
