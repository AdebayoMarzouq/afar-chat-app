import React from 'react'
import { Avatar } from './Avatar'
import { RoomType } from '../../types/chat'

export const ChatListItem = ({ id, room_name, is_group, last_message }: RoomType) => {
  let participant

  if (!is_group) {
    participant = 'The User Name'
  }

  return (
    <div className='[&:last-of-type>div]:border-b-0 cursor-pointer pl-2 flex items-center gap-2 hover:bg-gray-100 active:bg-gray-200 pr-1'>
      <div className='h-20 flex items-center justify-center shrink-0'>
        <Avatar size={12} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b shrink-0'>
        <div>
          <p className='font-semibold'>{room_name || participant}</p>
          <p className='text-xs text-light-text-secondary'>{last_message || 'How are you doing today?'}</p>
        </div>
        {/* <div className='ml-auto self-end grow-0 text-xs '>12:24PM</div> */}
      </div>
    </div>
  )
}
