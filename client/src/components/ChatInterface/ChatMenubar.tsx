import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWindowDimensions } from '../../hooks'
import { closeGroupMenu } from '../../redux/interactionSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { Avatar } from './Avatar'
import { HeaderWrapper } from './HeaderWrapper'

export const ChatMenubar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {width} = useWindowDimensions()
  const groupMenu = useSelector((state: RootState) => state.interaction.groupMenu)

  const mdclass = `absolute z-10 inset-x-0 slide-in-menu ${groupMenu ? 'translate-x-0' : 'translate-x-full'}`
  const xlclass = 'xl:static xl:col-span-3 h-screen'

  return (
    <div
      className={`${width < 1280 ? mdclass : xlclass} overflow-y-auto bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary`}
    >
      <HeaderWrapper>
        <div className='px-2 h-16 shrink-0 flex items-center gap-6 text-xl font-semibold border-b'>
          <button
            className='icon-btn'
            onClick={() => dispatch(closeGroupMenu())}
          >
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
          Group Info
        </div>
      </HeaderWrapper>
      <div className='w-full h-full'>
        <div className='w-full flex flex-col gap-2 items-center justify-center py-8'>
          <Avatar size={32} />
          <div>Group . 7 participants</div>
        </div>
        <div className='w-full h-32'></div>
        <div className=''>
          <h3 className='text-gray-400 px-2'>7 participants</h3>
          <ul className=''>
            <li className='flex gap-2 capitalize py-4 px-2 items-center'>
              <div className='w-10 h-10 rounded-full bg-light-main-primary text-white inline-flex justify-center items-center'>
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
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                  />
                </svg>
              </div>
              add Participant
            </li>
            <li>
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
                  clipRule='evenodd'
                />
              </svg>{' '}
              add Participant
            </li>
            <li>
              <button></button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
