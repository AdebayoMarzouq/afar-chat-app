import { useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Home, Chat } from './pages'
import { ToastContainer } from 'react-toastify'
import { useChatContext } from './context/ChatProvider'

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

export const ProtectedRoute = ({
  user,
  redirectPath = '/',
  children,
}: {
  user: true | null
  redirectPath?: string
  children?: React.ReactElement
}) => {
  if (!user) return <Navigate to={redirectPath} replace />
  return children ? children : <Outlet />
}

function App() {
  const {userToken, userInfo} = useChatContext()

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<ProtectedRoute user={userInfo && userToken ? true : null} />}>
          <Route index element={<Chat />} />
        </Route>
        <Route path='*' element={<div>Error!</div>} />
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
