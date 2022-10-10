import React, { createContext, useContext, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import { RootState } from '../redux/store'

type SocketContextPropsTypes = {
  children: React.ReactNode | React.ReactNode[]
}

type SocketContextValuesTypes = {
  socket: Socket
}

const SocketContext = createContext({} as SocketContextValuesTypes)

const ENDPOINT = 'http://localhost:3001'
const userData = localStorage.getItem('persist:user')
let token = ''
if (userData) {
  const { userToken } = JSON.parse(userData)
  token = userToken
}
const socket = io(ENDPOINT, {
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  auth: { token: JSON.parse(token) },
})



export const SocketProvider = ({ children }: SocketContextPropsTypes) => {
  const renderRef = useRef(1)
  const { userSettings: { theme } } = useSelector((state: RootState) => state.user)

  console.log('socketProvider rendered ', renderRef)

  useEffect(() => {
    renderRef.current++
  })

  useEffect(() => {
    if (theme !== 'light') {
      document.documentElement.className = theme
    } else {
      document.documentElement.className = ''
    }
  }, [theme])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)
