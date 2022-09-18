import React, { Dispatch, SetStateAction } from 'react'
import { Avatar } from './Avatar'
import { RoomType } from '../../types/chat'
import { motion } from 'framer-motion'

type ChatListItemType<T> = RoomType & {
  selected: string | null
  openSelected: (uuid: string) => void
}

const transition = {
  type: 'spring',
  stiffness: 350,
  mass: 0.2,
  damping: 20,
  duration: 0.4
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

export const ChatListItem = <T extends unknown>({
  uuid,
  room_name,
  is_group,
  last_message,
  selected,
  openSelected,
}: ChatListItemType<T>) => {
  let participant
  const selectedClass = 'bg-gray-100'

  if (!is_group) {
    participant = 'The User Name'
  }

  return (
    <motion.div
      className={`[&:last-of-type>div]:border-b-0 cursor-pointer pl-2 flex items-center gap-2 hover:bg-gray-100 pr-1 ${
        selected === uuid && selectedClass
      }`}
      onClick={() => {
        openSelected(uuid)
      }}
      initial='initial'
      animate='enter'
      variants={variants}
      layout
    >
      <div className='h-20 flex items-center justify-center shrink-0'>
        <Avatar size={12} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b overflow-hidden'>
        <div className='overflow-hidden w-full'>
          <div className='flex items-center gap-2'>
            <p className='truncate font-semibold'>{room_name || participant}</p>
            <span className='text-xs ml-auto'>12:24PM</span>
          </div>
          <div className='flex items-start gap-2'>
            <p className='h-8 break-words overflow-ellipsis text-xs text-light-text-primary'>
              {last_message}
            </p>
            <span className='ml-auto w-10 h-4 flex items-center justify-center shrink-0 rounded-xl bg-light-main-primary text-white text-xs'>
              999+
            </span>
          </div>
        </div>
        {/* <div className='h-20 ml-auto shrink-0'></div> */}
      </div>
    </motion.div>
  )
}
