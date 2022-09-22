import React from 'react'
import { Avatar } from './Avatar'
import { HeaderWrapper } from './HeaderWrapper'
import { useDispatch } from 'react-redux'
import {
  openProfile,
  openSearchbar,
  openModalInfo,
} from '../../redux/interactionSlice'


export function ChatListHeader() {
  const dispatch = useDispatch()

  return (
    <HeaderWrapper>
      <button onClick={() => dispatch(openProfile())}>
        <Avatar size={10} />
      </button>
      <div className='ml-auto flex items-center gap-2'>
        <button className='icon-btn' onClick={() => dispatch(openSearchbar())}>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            />
          </svg>
        </button>
        <button className='icon-btn' onClick={() => dispatch(openModalInfo())}>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
            />
          </svg>
        </button>
      </div>
    </HeaderWrapper>
  )
}
