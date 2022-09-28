import React, { Dispatch, memo, SetStateAction } from 'react'
import { Avatar } from '../../common/Avatar'
import { RoomType } from '../../../types/chat'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { setSelected, fetchRoomData } from '../../../redux/chatSlice'
import { closeGroupMenu, openMainToggle } from '../../../redux/interactionSlice'
import { AppDispatch, RootState } from '../../../redux/store'

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

export const ChatListItem = ({
  uuid,
  room_name,
  is_group,
  last_message,
  privateUserOne,
  privateUserTwo,
}: RoomType) => {
  const dispatch = useDispatch<AppDispatch>()
  const { userInfo } = useSelector((state: RootState) => state.user)
  const { mainToggle } = useSelector((state: RootState) => state.interaction)
  const { selected, chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )
  let oppositeUser
  const selectedClass = 'bg-gray-100'

  // *Fix chat return to take care of participant name in the list

  const openSelected = (uuid: string) => {
    if (uuid !== selected || mainToggle === false) {
      dispatch(closeGroupMenu())
      dispatch(setSelected(uuid))
      dispatch(openMainToggle())
    }
    if (!chatDataCollection[uuid]) {
      dispatch(fetchRoomData())
      dispatch(openMainToggle())
    }
  }

  if (!is_group) {
    oppositeUser = userInfo!.uuid === privateUserOne.uuid ? privateUserTwo : privateUserOne
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
        <Avatar size={12} src={oppositeUser?.profile_image} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b overflow-hidden pr-4'>
        <div className='overflow-hidden w-full'>
          <div className='flex items-center gap-2'>
            <p className='truncate font-semibold capitalize'>
              {room_name || oppositeUser?.username}
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
