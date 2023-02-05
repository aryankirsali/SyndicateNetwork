import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import Chatgpt from '../components/Chatgpt'

const Home = () => {
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
        <Chatgpt />
      </div>
    </div>
  )
}

export default Home
