import { ChatBody } from './ChatBody'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocketContext } from '../../context/SocketContext'
import { RootState } from '../../redux/store'
import { ChatBubbleT1 } from './ChatBubbleT1'
import { ChatUIHeader } from './ChatUIHeader'
import { MessageInput } from './MessageInput'
import { AnimatePresence } from 'framer-motion'

export const ChatUI = () => {
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

  return (
    <div className='relative h-screen flex flex-col w-full bg-white col-span-2'>
      <ChatUIHeader />
      <ChatBody />
    </div>
  )
}
