import React, { createContext, useContext } from 'react'
import { io, Socket } from 'socket.io-client'

type SocketContextPropsTypes = { children: React.ReactNode | React.ReactNode[] }
type SocketContextValuesTypes = {
  socket: Socket
}

const SocketContext = createContext({} as SocketContextValuesTypes)

const ENDPOINT = 'http://localhost:3001'
const socket = io(ENDPOINT)

export const SocketProvider = ({ children }: SocketContextPropsTypes) => {

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)
