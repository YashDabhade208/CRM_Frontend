import React, { useState } from 'react'
import Child from './Child'

const Parent = () => {

    const [name,setName]=useState("orkmom")

  return (
    <div>
        <Child name/>
    </div>
  )
}

export default Parent