import './Launcher.css'
import React from 'react'
import { LauncherFormData, LauncherForm } from './LauncherForm'

export const Launcher: React.FC<{
  handleSubmit: (formData: LauncherFormData) => void
}> = ({ handleSubmit }) => {
  return (
    <div className="Launcher">
      <h2 className="type">
        <span>Nigiyakashi</span>
        <small>v0.3.0</small>
      </h2>
      <LauncherForm handleSubmit={handleSubmit} />
    </div>
  )
}
