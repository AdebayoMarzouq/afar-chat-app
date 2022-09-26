import React, { Dispatch, SetStateAction } from 'react'
import { Avatar } from './Avatar'
import { RoomType } from '../../types/chat'
import { motion } from 'framer-motion'

type ChatListItemType<T> = RoomType & {
  currentUser: string
  selected: string | null
  openSelected: (uuid: string) => void
}

const transition = {
  type: 'tween',
  ease: 'easeIn',
  duration: 0.2
}

const variants = {
  initial: {
    opacity: 0,
    y: 80,
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
  currentUser,
  privateUserOne: {uuid: userOneId,username: userOne},
  privateUserTwo: {username: userTwo},
  selected,
  openSelected,
}: ChatListItemType<T>) => {
  let oppositeUser
  const selectedClass = 'bg-gray-100'

  if (!is_group) {
    oppositeUser = currentUser === userOneId ? userTwo : userOne
  }

  return (
    <motion.div
      className={`[&:last-of-type>div]:border-b-0 bg-white cursor-pointer pl-4 xl:pl-4 flex items-center gap-2 hover:bg-gray-100 ${
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
      <div className='h-20 flex items-center gap-2 flex-grow border-b overflow-hidden pr-4'>
        <div className='overflow-hidden w-full'>
          <div className='flex items-center gap-2'>
            <p className='truncate font-semibold capitalize'>
              {room_name || oppositeUser}
            </p>
            <span className='text-xs ml-auto'>12:24PM</span>
          </div>
          <div className='flex items-start gap-2'>
            <p className='h-8 break-words w-[calc(100%_-_48px)] text-xs text-light-text-primary'>
              {last_message}
            </p>
            <span className='ml-auto max-w-10 w-fit px-1 py-0.5 h-4 flex items-center justify-center shrink-0 rounded-xl text-light-main-primary border border-light-main-primary bg-white text-xs font-semibold'>
              999+
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
