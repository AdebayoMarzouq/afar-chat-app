import React from 'react'
import { Avatar } from './Avatar'

export const Badge = ({
  title,
  closeFunc,
  avatar
}: {
  title: string
  avatar: string
  closeFunc: () => void
}) => {
  return (
    <div className='inline-flex items-center py-1 px-2 mr-2 text-sm font-medium text-light-main-primary dark:text-dark-main-primary bg-light-main-secondary dark:bg-dark-fillOne rounded'>
      <Avatar src={avatar} size={6} />
      <span className='ml-2'>{title || 'hello user'}</span>
      <button
        type='button'
        className='inline-flex items-center p-0.5 ml-2 text-sm text-light-main-primary dark:text-dark-main-primary bg-transparent rounded-sm hover:bg-light-main-primary dark:hover:bg-dark-main-primary hover:text-white dark:hover:text-dark-text-primary'
        data-dismiss-target='#badge-dismiss-default'
        aria-label='Remove'
        onClick={closeFunc}
      >
        <svg
          aria-hidden='true'
          className='w-3.5 h-3.5'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          ></path>
        </svg>
        <span className='sr-only'>Remove user</span>
      </button>
    </div>
  )
}
