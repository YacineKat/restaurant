import React from 'react'
import {assets} from '../../assets/assets'
import './AppDownload.css'
const AppDownload = () => {
  return (
    <div className="App-Download" id="App-Download">
      <p>For Better Experience Download <br/> Tomato App</p>
      <div className="App-Download-platforms">
        <img src={assets.play_store} alt="" />
        <img src={assets.app_store} alt="" />
      </div>
    </div>
  )
}

export default AppDownload
