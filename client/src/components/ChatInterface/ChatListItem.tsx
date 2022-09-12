import React, { Dispatch, SetStateAction } from 'react'
import { Avatar } from './Avatar'
import { RoomType } from '../../types/chat'

type ChatListItemType<T> = RoomType & {
  selected: string | null
  setSelected: Dispatch<SetStateAction<string | null>>
  startChat: ()=>void
}

export const ChatListItem = <T extends unknown>({
  uuid,
  room_name,
  is_group,
  last_message,
  selected,
  setSelected,
  startChat,
}: ChatListItemType<T>) => {
  let participant
  const selectedClass = 'bg-gray-100'

  if (!is_group) {
    participant = 'The User Name'
  }

  return (
    <div
      className={`[&:last-of-type>div]:border-b-0 cursor-pointer pl-2 flex items-center gap-2 hover:bg-gray-100 pr-1 ${selected === uuid && selectedClass}`}
      onClick={() => {
        setSelected(uuid)
      }}
    >
      <div className='h-20 flex items-center justify-center shrink-0'>
        <Avatar size={12} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b shrink-0'>
        <div>
          <p className='font-semibold'>{room_name || participant}</p>
          <p className='text-xs text-light-text-secondary'>
            {last_message || 'How are you doing today?'}
          </p>
        </div>
        {/* <div className='ml-auto self-end grow-0 text-xs '>12:24PM</div> */}
      </div>
    </div>
  )
}
