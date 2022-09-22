import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import { RootState, store } from '../redux/store'

type SocketContextPropsTypes = { children: React.ReactNode | React.ReactNode[] }
type SocketContextValuesTypes = {
  socket: Socket
}

const SocketContext = createContext({} as SocketContextValuesTypes)

const ENDPOINT = 'http://localhost:3001'

export const SocketProvider = ({ children }: SocketContextPropsTypes) => {
  const userToken = useSelector((state: RootState) => state.user.userToken)

  const socketInit = useCallback(
    () => {
      console.log('called')
      return io(ENDPOINT, { transports: ["websocket", "polling"], auth: { token: userToken } })
    },
    [userToken],
  )

  const socket = socketInit()
  

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)
