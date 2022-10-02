import React from 'react'
import { Avatar } from './Avatar'

type ItemType = {openSelected?:(uuid: string) => void, uuid: string, username: string, email: string, profile_image:string, disabled: boolean}

export const SearchListItem = ({openSelected, uuid, username, email, profile_image, disabled}: ItemType) => {
  return (
    <div
      className={`${disabled && 'cursor-not-allowed'} [&:last-of-type>div]:border-b-0 cursor-pointer pl-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-dark-bg-secondary active:bg-gray-200 active:bg-dark-bg-secondary`}
      onClick={() => {
        if (openSelected) {
          openSelected(uuid)
        }
      }}
    >
      <div className='h-20 flex items-center justify-center'>
        <Avatar size={12} src={profile_image} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b dark:border-dark-separator'>
        <div className='text-left'>
          <p className='font-semibold'>{username}</p>
          <p className='text-xs font-semibold'>
            <span className='font-normal dark:text-dark-text-secondary'>
              Email :{' '}
            </span>
            {email}
          </p>
        </div>
        {disabled && (
          <div className='bg-light-main-primary dark:bg-dark-main-primary text-light-text-primary dark:text-dark-bg-primary px-1 py-0.5 rounded-xl ml-auto mr-4 text-xs'>Participant</div>
        )}
      </div>
    </div>
  )
}
