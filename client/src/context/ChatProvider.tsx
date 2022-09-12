import React, { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '../hooks'
import { ChatListType } from '../types/chat'
import { UserType } from '../types/user'

type Children = React.ReactNode

type ChatContext = {
  showProfile: boolean
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>
  searchBar: boolean
  setSearchBar: React.Dispatch<React.SetStateAction<boolean>>
  showModalInfo: boolean
  setShowModalInfo: React.Dispatch<React.SetStateAction<boolean>>
  userToken: string | null
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>
  userInfo: UserType | null
  setUserInfo: React.Dispatch<React.SetStateAction<UserType | null>>
  userChats: ChatListType | []
  setUserChats: React.Dispatch<React.SetStateAction<ChatListType | []>>
  token: string
}

const ChatContext = createContext({} as ChatContext)

export const ChatProvider = ({ children }: { children: Children }) => {
  const [showProfile, setShowProfile] = useState(false)
  const [searchBar, setSearchBar] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [userToken, setUserToken] = useLocalStorage<string | null>('token', null)
  const [userInfo, setUserInfo] = useLocalStorage<UserType | null>('userInfo' ,null)
  const [userChats, setUserChats] = useState<ChatListType | []>([])
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzI2N2JiODAtMjNlOS00NmVjLWFlZWUtZWMyZjJjYTM3NjIyIiwiZW1haWwiOiJ0ZXN0dXNlcjJAdGVzdC50ZXN0IiwiaWF0IjoxNjYzMDA1OTU0LCJleHAiOjE2NjM2MTA3NTR9.ux6B0-Sr08_LBJLSIzU6qXH7QyoP4nksstknZCOgCGw'

  return (
    <ChatContext.Provider
      value={{
        showProfile,
        setShowProfile,
        searchBar,
        setSearchBar,
        showModalInfo,
        setShowModalInfo,
        userToken,
        setUserToken,
        userInfo,
        setUserInfo,
        userChats,
        setUserChats,
        token
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)
