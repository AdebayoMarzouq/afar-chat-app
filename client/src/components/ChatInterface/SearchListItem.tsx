import React from 'react'
import { Avatar } from './Avatar'

type UserType = {id: string, username: string, email: string, profile_image:string}

export const SearchListItem = ({id, username, email, profile_image}: UserType) => {
  return (
    <div className='[&:last-of-type>div]:border-b-0 cursor-pointer pl-2 flex items-center gap-2 hover:bg-gray-100 active:bg-gray-200'>
      <div className='h-20 flex items-center justify-center'>
        <Avatar size={12} src={profile_image} />
      </div>
      <div className='h-20 flex items-center gap-2 flex-grow border-b'>
        <div className='text-left'>
          <p className='font-semibold'>{username}</p>
          <p className='text-xs font-semibold'>
            <span className='font-normal'>Email : </span>{email}
          </p>
        </div>
        <div className='ml-auto shrink-0'></div>
      </div>
    </div>
  )
}
