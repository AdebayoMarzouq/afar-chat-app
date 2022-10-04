import React, { Dispatch, memo, SetStateAction, useEffect } from 'react'
import { Avatar } from '../../common/Avatar'
import { RoomType } from '../../../types/chat'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { setSelected, fetchRoomData } from '../../../redux/chatSlice'
import { closeGroupMenu, openMainToggle } from '../../../redux/interactionSlice'
import { AppDispatch, RootState } from '../../../redux/store'

const transition = {
  type: 'spring',
  mass: 0.8,
  damping: 30,
  stiffness: 300
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
  const selectedClass = 'bg-gray-100 dark:bg-dark-bg-secondary'

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
    <motion.li
      className={`[&:last-of-type>div]:border-b-0 cursor-pointer pl-4 xl:pl-4 flex items-center gap-2 bg-light-bg-primary dark:bg-dark-bg-primary hover:bg-gray-100 dark:hover:bg-dark-bg-secondary ${
        selected === uuid && selectedClass
      }`}
      onClick={() => {
        openSelected(uuid)
      }}
      transition={transition}
      layout
    >
      <div className='flex items-center justify-center h-20 shrink-0'>
        <Avatar size={12} src={oppositeUser?.profile_image} />
      </div>
      <div className='flex items-center flex-grow h-20 gap-2 pr-4 overflow-hidden border-b dark:border-dark-separator'>
        <div className='w-full overflow-hidden'>
          <div className='flex items-center gap-2'>
            <p className='font-semibold capitalize truncate'>
              {room_name || oppositeUser?.username}
            </p>
            <span className='ml-auto text-xs dark:text-dark-main-primary'>12:24PM</span>
          </div>
          <div className='flex items-start gap-2'>
            <p className='h-8 break-words w-[calc(100%_-_48px)] text-xs text-light-text-primary dark:text-dark-text-secondary font-[Ubuntu] font-medium'>
              {last_message}
            </p>
            <span className='ml-auto max-w-10 w-fit px-1 py-0.5 h-4 flex items-center justify-center shrink-0 rounded-xl dark:bg-dark-main-primary text-light-main-primary dark:text-dark-bg-primary border border-light-main-primary dark:border-none text-xs font-semibold'>
              999+
            </span>
          </div>
        </div>
      </div>
    </motion.li>
  )
}
