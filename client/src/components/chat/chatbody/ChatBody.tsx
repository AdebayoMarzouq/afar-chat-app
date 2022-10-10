import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocketContext } from '../../../context/SocketContext'
import { fetchRoomData, fetchUserChats, setSelected } from '../../../redux/chatSlice'
import { openMainToggle } from '../../../redux/interactionSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { request } from '../../../utilities/request'
import { Spinner } from '../../miscellaneous/Spinner'
import { ChatBubbleWithArrow } from './ChatBubbleWithArrow'
import { ChatBubbleWithoutArrow } from './ChatBubbleWithoutArrow'
import { MessageInput } from './MessageInput'

const FullPageWrapper = ({ children }: { children: React.ReactNode | React.ReactNode[]}) => {
  return (
    <div className='flex-grow px-6 py-4 overflow-y-auto bg-gray-200 scroll-smooth speech-wrapper md:px-8 dark:bg-dark-bg-primary'>
      {children}
    </div>
  )
}

export function ChatBody() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const {
    selected,
    new_message_entry,
    chats,
    chatDataCollection,
    chatDataError,
    chatDataLoading,
  } = useSelector((state: RootState) => state.chat)
  let previousSender = ''
  
  const openSelected = async (uuid: string) => {
    if (!uuid) return // toast here
    try {
      const response = await request({
        url: `/api/chat`,
        method: 'POST',
        payload: { user_id: uuid },
      })
      if ((response.status = 201)) {
        const room_id = response.data.room_id
        socket.emit('joinRoom', room_id)
        dispatch(fetchUserChats())
        if (room_id !== selected) {
          dispatch(setSelected(room_id))
        }
        if (!chatDataCollection[room_id]) {
          dispatch(fetchRoomData())
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openClickedUserChat = async (uuid: string) => {
    if (userInfo!.uuid === uuid) return
    const room = chats.find(room => room.privateUserOne.uuid === uuid || room.privateUserTwo.uuid === uuid)
    if (room) {
      if (room.uuid !== selected) {
        dispatch(setSelected(room.uuid))
      }
      if (!chatDataCollection[room.uuid]) {
        dispatch(fetchRoomData())
      }
    } else {
      await openSelected(uuid)
    }
  }

  // useEffect(() => {
  //   if (!bottomRef || !bottomRef.current) return
  //   bottomRef.current.scrollIntoView()
  //   console.log('ran scollintoview')
  // }, [])

  if (!selected) {
    return (
      <FullPageWrapper>
        <div className='pt-20 pb-4 text-center dark:text-dark-text-secondary'>
          Click a message to chat
        </div>
      </FullPageWrapper>
    )
  }

  if (chatDataLoading) {
    return (
      <FullPageWrapper>
        <div className='py-4 text-center'>
          <Spinner />
        </div>
      </FullPageWrapper>
    )
  }

  if (chatDataError) {
    return (
      <FullPageWrapper>
        <div className='text-center'>
          An error occured while fetching messages
        </div>
      </FullPageWrapper>
    )
  }

  const room = chatDataCollection[selected].room
  const messages = chatDataCollection[selected].messages
  
  return (
    <FullPageWrapper>
      {messages.length ? (
        <LayoutGroup id='messages-id'>
          <motion.ul layout className='border border-green-500'>
            {messages.map((message) => {
              const {
                uuid: userId,
                Message: { uuid: messageId },
              } = message
              if (previousSender === userId) {
                previousSender = userId
                return (
                  <ChatBubbleWithoutArrow
                    key={messageId}
                    isSender={userId === userInfo!.uuid}
                    messageObj={message}
                  />
                )
              } else {
                previousSender = userId
                return (
                  <ChatBubbleWithArrow
                    key={messageId}
                    isSender={userId === userInfo!.uuid}
                    messageObj={message}
                    openClickedUserChat={openClickedUserChat}
                    isGroup={room.is_group}
                  />
                )
              }
            })}
            <div key='bottomRef' ref={bottomRef}></div>
          </motion.ul>
        </LayoutGroup>
      ) : (
        <div className='text-center'>
          There are no messages in this room yet
        </div>
      )}
    </FullPageWrapper>
  )
}
