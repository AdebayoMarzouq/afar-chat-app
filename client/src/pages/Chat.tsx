import React from 'react'
import { Sidebar, ChatUI, ChatList } from '../components'

export const Chat = () => {
  return (
    <>
      <div className='w-full h-screen grid grid-cols-1 md:grid-cols-3 divide-x'>
        {/* <Sidebar /> */}
        <ChatList />
        <ChatUI />
      </div>
    </>
  )
}
