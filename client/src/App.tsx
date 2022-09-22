import { useCallback, useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Home, Chat } from './pages'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import { MyToast } from './utilities/toastFunction'
import { SocketProvider } from './context/SocketContext'

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
  redirectPath = '/',
  children,
}: {
  redirectPath?: string
  children?: React.ReactElement
}) => {
  const { userToken, userInfo } = useSelector((state: RootState) => state.user)
  if (!userToken || !userInfo) {
    // send you are not logged in toast here
    MyToast({
      textContent: 'You need to login',
    })
    return <Navigate to={redirectPath} replace />
  }
  return children ? children : <Outlet />
}

export const PreventLoginRoute = ({
  redirectPath = '/chat',
  children,
}: {
  redirectPath?: string
  children: React.ReactElement
}) => {
  const { userToken, userInfo } = useSelector((state: RootState) => state.user)
  if (userToken && userInfo) {
    return <Navigate to={redirectPath} replace />
  }
  return children
}

function App() {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <PreventLoginRoute>
              <Home />
            </PreventLoginRoute>
          }
        />
        <Route path='/chat' element={<ProtectedRoute />}>
          <Route
            index
            element={
              <SocketProvider>
                <Chat />
              </SocketProvider>
            }
          />
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
