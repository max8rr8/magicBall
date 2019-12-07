import React, {useEffect, useState} from 'react'
import { render } from 'react-dom'
import fullImg from './images/fullscreen.svg'
import statsImg from './images/stats.svg'
import hologramImg from './images/hologram.svg'
import pictureImg from './images/picture.svg'
import arImg from './images/ar.svg'

const showImageEv = new Event('showimage')

function Toolbox({ fullscreen, stats, hologram, ar }) {
    return <div className="toolbox">
      <img src={fullImg} width="32" height="32" onClick={()=>fullscreen()}/>
      <img src={hologramImg} width="32" height="32" onClick={()=>hologram()} />
      <img src={arImg} width="32" height="32" onClick={()=>ar()} />
      <img src={statsImg} width="32" height="32" onClick={()=>stats()} />
      <img src={pictureImg} width="32" height="32" onClick={()=>document.dispatchEvent(showImageEv)} />
      
    </div>
}

export default function(fullscreen, stats, hologram, ar) {
    render(<Toolbox ar={ar} fullscreen={fullscreen} stats={stats} hologram={hologram}/>, document.getElementById('toolbox'))
}



// render()