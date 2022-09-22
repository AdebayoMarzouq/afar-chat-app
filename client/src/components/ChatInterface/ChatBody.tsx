import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocketContext } from '../../context/SocketContext'
import { RootState } from '../../redux/store'
import { ChatBubbleT1 } from './ChatBubbleT1'
import { ChatBubbleT2 } from './ChatBubbleT2'
import { MessageInput } from './MessageInput'

export function ChatBody() {
  const bottomRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
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
            <div className='text-center'>Click a message to chat</div>
          ) : (
            <>
              {chatDataLoading && <div className='text-center'>Loading...</div>}
              {chatDataError && (
                <div className='text-center'>
                  An error occured while fetching messages
                </div>
              )}
              {chatDataCollection &&
                chatDataCollection[selected] &&
                [...chatDataCollection[selected].messages]
                  .map((message) => {
                    const {
                      uuid: userId,
                      Message: { uuid: messageId },
                    } = message
                    if (previousSender === userId) {
                      previousSender = userId
                      return (
                        <ChatBubbleT2
                          key={messageId}
                          isSender={userId === userInfo!.uuid}
                          messageObj={message}
                        />
                      )
                    } else {
                      previousSender = userId
                      return (
                        <ChatBubbleT1
                          key={messageId}
                          isSender={userId === userInfo!.uuid}
                          messageObj={message}
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
