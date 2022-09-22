import { ChatBody } from './ChatBody'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocketContext } from '../../context/SocketContext'
import { RootState } from '../../redux/store'
import { ChatBubbleT1 } from './ChatBubbleT1'
import { ChatUIHeader } from './ChatUIHeader'
import { MessageInput } from './MessageInput'
import { AnimatePresence } from 'framer-motion'
import { ChatMenubar } from './ChatMenubar'
import { useWindowDimensions } from '../../hooks'

export const ChatUI = () => {
  const dispatch = useDispatch()
  const {width} = useWindowDimensions()
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

  return (
    <div className='relative col-span-3 xl:col-span-6 h-full flex flex-col w-full bg-white'>
      <>
      <ChatUIHeader />
      <ChatBody />
      {selected && <MessageInput />}
      </>
      {/* {width < 1280 && <ChatMenubar />} */}
    </div>
  )
}
