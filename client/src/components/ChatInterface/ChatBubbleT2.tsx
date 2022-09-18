import React from 'react'
import { MessageListItem, MessageType } from '../../types/chat'

export const ChatBubbleT2 = ({
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
}: MessageListItem) => {
  return (
    <div className='bubble alt'>
      <div className='txt'>
        <p className='name alt'>
          {username}<span> ~ John</span>
        </p>
        <p className='message'>{message_text}</p>
        <span className='timestamp'>10:22 pm</span>
      </div>
      <div className='bubble-arrow alt'></div>
    </div>
  )
}
