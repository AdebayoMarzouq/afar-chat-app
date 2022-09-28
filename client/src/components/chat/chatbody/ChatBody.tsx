import { AnimatePresence } from 'framer-motion'
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
  // }, [new_message_entry])
  
  return (
    <>
      <AnimatePresence>
        <div className='scroll-smooth speech-wrapper py-4 px-6 md:px-8 flex-grow bg-gray-200 overflow-y-auto'>
          {!selected ? (
            <div className='text-center pb-4 pt-20'>
              Click a message to chat
            </div>
          ) : (
            <>
              {chatDataLoading && (
                <div className='text-center py-4'>
                  <Spinner />
                </div>
              )}
              {chatDataError && (
                <div className='text-center'>
                  An error occured while fetching messages
                </div>
              )}
              {chatDataCollection &&
                chatDataCollection[selected] &&
                [...chatDataCollection[selected].messages].map((message) => {
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
                      />
                    )
                  }
                })}
            </>
          )}
          <div ref={bottomRef}></div>
        </div>
      </AnimatePresence>
    </>
  )
}
