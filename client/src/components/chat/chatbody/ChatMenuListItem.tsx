import React from 'react'
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
  const isCreator = creator === uuid
  return (
    <li
      className='[&:last-of-type>div]:border-b-0 cursor-pointer pl-2 md:pl-4 flex items-center gap-2 hover:bg-gray-100 active:bg-gray-200'
      onClick={() => {
        if (openSelected) {
          openSelected(uuid)
        }
      }}
    >
      <div className='h-20 flex items-center justify-center'>
        <Avatar size={12} src={profile_image} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b pr-4 md:pr-4'>
        <div className='text-left'>
          <p className='font-semibold'>{username}</p>
          <p className='text-xs font-semibold'>
            <span className='font-normal'>Email : </span>
            {email}
          </p>
        </div>
        {isCreator && (
          <div className='ml-auto shrink-0 text-sm font-bold text-light-main-primary'>
            <svg
              className='w-6 h-6'
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
      </div>
    </li>
  )
}
