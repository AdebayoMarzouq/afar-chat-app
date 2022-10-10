import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageListItem } from '../../../types/chat'
import { ChatBubbleReply } from './ChatBubbleReply'

const transition = {
  type: 'spring',
  bounce: 0,
}

let variants: {
  initial: { y: number }
  enter: {
    opacity: number
    y: number
    transition: { type: string; bounce: number }
  }
}

export const ChatBubbleWithoutArrow = ({
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
}: {
  isSender: boolean
  messageObj: MessageListItem
  }) => {
  
  useEffect(() => {
    variants = {
      initial: {
        y: 250,
      },
      enter: {
        opacity: 1,
        y: 0,
        transition,
      },
    }
  }, [])

  return (
    <motion.li
      className={`bubble ${
        isSender
          ? 'alt bg-light-bubbleOne-bg dark:bg-dark-bubbleOne-bg'
          : 'bg-light-bubbleTwo-bg dark:bg-dark-bubbleTwo-bg'
      } withoutArrow -mt-5`}
      initial='initial'
      animate='enter'
      variants={variants}
      layout
    >
      <div className='txt'>
        {repliedMessageId || (true && <ChatBubbleReply isSender={isSender} />)}
        <div className='body'>
          <p
            className={` message ${
              isSender
                ? 'text-light-bubbleOne-text dark:text-dark-bubbleOne-text'
                : 'text-light-bubbleTwo-text dark:text-dark-bubbleTwo-text'
            }`}
          >
            {message_text}
          </p>
          <span
            className={`timestamp ${
              isSender ? 'text-[#d1d5db]' : 'text-[#9ca3af]'
            }`}
          >
            10:20 pm
          </span>
        </div>
      </div>
    </motion.li>
  )
}
