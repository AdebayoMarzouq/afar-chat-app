import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocketContext } from '../../../context/SocketContext'
import { setSelected, removeGroup } from '../../../redux/chatSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { request } from '../../../utilities/request'
import { Avatar } from '../../common/Avatar'

type ItemType = {
  creator: string,
  openSelected?: (uuid: string) => void
  uuid: string
  username: string
  email: string
  profile_image: string
}

export const ChatMenuListItem = ({
  creator,
  openSelected,
  uuid,
  username,
  email,
  profile_image,
}: ItemType) => {
  const {socket} = useSocketContext()
  const dispatch = useDispatch<AppDispatch>()
  const { selected } = useSelector((state: RootState) => state.chat)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: false,
  })
  const isCreator = creator === uuid

  const removeUser = async (user_id: string) => {
    if (userInfo?.uuid !== creator) {
      return
    }
    const form_data = {
      room_id: selected,
      user_id,
    }
    setSubmitStatus((prev) => {
      return { ...prev, loading: true }
    })
    try {
      const response = await request({
        url: '/api/chat/remove',
        method: 'DELETE',
        payload: form_data,
      })
      if (response.status === 200) {
        // *Success toast
        socket.emit('user_removed', form_data.room_id, user_id)
      } else if (response.status === 401) {
        // *Add to general display or alert error
      }
    } catch (error) {
      console.log(error)
      setSubmitStatus((prev) => {
        return { ...prev, error: true }
      })
      //* pass toast here
    } finally {
      setSubmitStatus((prev) => {
        return { ...prev, loading: false }
      })
    }
  }

  return (
    <li
      className='[&:last-of-type>div]:border-b-0 dark:border-dark-separator pl-2 md:pl-4 flex items-center gap-2 dark:active:bg-dark-bg-secondary'
      onClick={() => {
        if (openSelected) {
          openSelected(uuid)
        }
      }}
    >
      <div className='h-20 flex items-center justify-center'>
        <Avatar size={12} src={profile_image} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b border-inherit pr-4 md:pr-4'>
        <div className='text-left'>
          <p className='font-semibold'>{username}</p>
          <p className='text-xs font-semibold'>
            <span className='font-normal dark:text-dark-text-secondary'>
              Email :{' '}
            </span>
            {email}
          </p>
        </div>
        {isCreator && (
          <div className='ml-auto shrink-0 text-sm font-bold text-light-main-primary dark:text-dark-main-primary'>
            <svg
              className='w-8 h-8'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
        {creator === userInfo!.uuid && !isCreator && (
          <button className='icon-btn ml-auto shrink-0 text-sm font-bold'
          onClick={() => removeUser(uuid)}>
            remove
          </button>
        )}
      </div>
    </li>
  )
}
