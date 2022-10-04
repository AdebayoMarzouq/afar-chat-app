import React from 'react'

export const HeaderTypeone = ({title, fn}:{title:string, fn:() => void}) => {
  return (
    <div className='px-2 h-16 shrink-0 flex items-center gap-6 text-xl font-semibold bg-light-bg-secondary dark:bg-dark-bg-secondary border-b dark:border-dark-separator'>
      <button className='icon-btn' onClick={fn}>
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
            d='M10 19l-7-7m0 0l7-7m-7 7h18'
          />
        </svg>
      </button>
      {title}
    </div>
  )
}
