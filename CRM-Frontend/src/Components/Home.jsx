import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();

    const handlenavigation = () =>{
        navigate('/appointment')
    }
  return (
    <div>Home

        <button onClick={handlenavigation}>Book Appointmnet</button>
    </div>
  )
}

export default Home