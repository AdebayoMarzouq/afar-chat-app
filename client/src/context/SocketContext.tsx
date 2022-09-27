import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import { RootState } from '../redux/store'

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
      return io(ENDPOINT, { transports: ["websocket", "polling"], auth: { token: userToken } })
    },
    [userToken],
  )

  const socket = socketInit()

  useEffect(() => {
    socket.on('connect', () => {
      console.log(
        'Socket Client connected  @ ',
        new Date().getHours() - 12,
        ':',
        new Date().getMinutes()
      )
    })
    
    socket.on('disconnect', () => {
      console.log('Socket Client disconnected')
    })
    return () => {
    }
  }, [userToken])
  

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)
