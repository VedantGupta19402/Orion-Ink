import { memo } from 'react'
import Video from './Video'
import Text from './Text'

const Section1 = () => {
  return (
    <div className="relative min-h-screen">
      <Video />
      <Text />
    </div>
  )
}

export default memo(Section1)
