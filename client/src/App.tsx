import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages'
import { ToastContainer } from 'react-toastify'


const contextClass = {
  success: 'bg-blue-600',
  error: 'bg-red-600',
  info: 'bg-gray-600',
  warning: 'bg-orange-400',
  default: 'bg-[#ffffff]',
  dark: 'bg-white-600 font-gray-300',
} as { [key: string]: string }

const contextIcons = {
  success: <div></div>,
  error: <div></div>,
  info: <div></div>,
  warning: <div></div>,
  default: <div></div>,
  dark: <div></div>,
} as { [key: string]: React.ReactElement }

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/chat'
          element={
            <h1 className='text-2xl text-rose-400 font-light'>
              Hello, this is the chat page
            </h1>
          }
        />
      </Routes>
      <ToastContainer
        // className='bg-sky-300'
        toastClassName='rounded-md shadow-lg'
        hideProgressBar={true}
        closeButton={false}
        icon={false}
        // icon={({theme, type}) => contextIcons[type]}
      />
    </>
  )
}

export default App
