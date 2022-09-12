import React, { useState } from 'react'
import { useChatContext } from '../../context/ChatProvider'
import { useAxios } from '../../hooks'
import { ChatListType, RoomType } from '../../types/chat'
import { axiosRequest } from '../../utilities/requestFunction'
import { ModalInfo } from '../ModalInfo'
import { ChatListHeader } from './ChatListHeader'
import { ChatListItem } from './ChatListItem'
import { Profilebar } from './Profilebar'
import { Searchbar } from './Searchbar'

export const ChatList = () => {
  const { userToken, userChats, setUserChats } = useChatContext()
  const [selected, setSelected] = useState<string | null>(null)

  if (!userToken) return
  const { data, loading, error } = useAxios<ChatListType>({
    url: '/api/chat',
    token: userToken,
  })

  const startChat = async () => {}

  return (
    <div className='relative h-screen flex flex-col w-full bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary'>
      <ChatListHeader />
      <div className='pb-4 overflow-y-auto flex-grow'>
        {loading && <div className='text-center'>Loading...</div>}
        {error && (
          <div>Something went wrong, try again {JSON.stringify(error)}</div>
        )}
        {data &&
          !error &&
          (data as ChatListType).rooms.map((chatItem) => {
            // const info = chatItem.rooms
            return (
              <ChatListItem
                key={chatItem.uuid}
                selected={selected}
                setSelected={setSelected}
                startChat={startChat}
                {...chatItem}
              />
            )
          })}
      </div>
      <Profilebar />
      <Searchbar />
      <ModalInfo />
    </div>
  )
}
