import React from 'react'
import Video from './Video'
import Text from './Text'
import Loop from './CurvedLoop'
import CurvedLoop from './CurvedLoop'
import WebGLScene from './WebGLScene'

const Section1 = () => {
  return (
    <div className='min-h-screen relative '>
      <WebGLScene/>
      < Video  />
      < Text />
    </div>
  )
}

export default Section1
