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
}

const ChatContext = createContext({} as ChatContext)

export const ChatProvider = ({ children }: { children: Children }) => {
  const [showProfile, setShowProfile] = useState(false)
  const [searchBar, setSearchBar] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [userToken, setUserToken] = useLocalStorage<string | null>('token', null)
  const [userInfo, setUserInfo] = useLocalStorage<UserType | null>('userInfo' ,null)
  const [userChats, setUserChats] = useState<ChatListType | []>([])

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
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)
