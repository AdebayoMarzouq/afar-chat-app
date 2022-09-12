import React from 'react'
import { useChatContext } from '../../context/ChatProvider'
import { Avatar } from './Avatar'
import { HeaderWrapper } from './HeaderWrapper'

export function ChatListHeader() {
  const {
    showProfile,
    setShowProfile,
    setSearchBar,
    showModalInfo,
    setShowModalInfo,
  } = useChatContext()

  return (
    <HeaderWrapper>
      <button onClick={() => setShowProfile(true)}>
        <Avatar size={10} />
      </button>
      <div className='ml-auto flex items-center gap-2'>
        <button className='icon-btn' onClick={() => setSearchBar(true)}>
          <svg
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg>
        </button>
        <button className='icon-btn' onClick={() => setShowModalInfo(true)}>
          <svg
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z' />
            <path d='M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z' />
          </svg>
        </button>
      </div>
    </HeaderWrapper>
  )
}
