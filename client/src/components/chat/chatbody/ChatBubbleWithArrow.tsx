import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageListItem } from '../../../types/chat'
import { ChatBubbleReply } from './ChatBubbleReply'

const transition = {
  type: 'spring',
  // damping: 20,
  bounce: 0.2,
}

const variants = {
  initial: {
    opacity: 0,
    y: 300,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition,
  },
}

export const ChatBubbleWithArrow = ({
  isSender,
  messageObj: {
    uuid: sender_id,
    username,
    Message: {
      uuid,
      message_text,
      deleted_at,
      sent_at,
      updated_at,
      repliedMessageId,
    },
  },
  openClickedUserChat,
}: {
  isSender: boolean
  messageObj: MessageListItem
  openClickedUserChat: (uuid: string) => void
}) => {
  return (
    <motion.div
      className={`bubble ${isSender && 'alt'}`}
      initial='initial'
      animate='enter'
      variants={variants}
      layout
    >
      <div className='txt'>
        <p
          className={`name ${isSender && 'alt'} cursor-pointer`}
          onClick={() => openClickedUserChat(sender_id)}
        >
          {username}
        </p>
        {/* {repliedMessageId || true && <ChatBubbleReply />} */}
        <div className='body'>
          <p className='message'>{message_text}</p>
          <span className='timestamp'>10:20 pm</span>
        </div>
      </div>
      <div className={`bubble-arrow ${isSender && 'alt'}`}></div>
    </motion.div>
  )
}
