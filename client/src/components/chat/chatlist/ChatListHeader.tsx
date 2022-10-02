import { useState } from 'react'
import { Avatar } from '../../common/Avatar'
import { HeaderWrapper } from '../../common/HeaderWrapper'
import { useDispatch, useSelector } from 'react-redux'
import {
  openProfile,
  openSearchbar,
  openCreateGroupbar,
} from '../../../redux/interactionSlice'
import { RootState } from '../../../redux/store'
import { resetState } from '../../../redux/action'
import { useNavigate } from 'react-router-dom'


export function ChatListHeader() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [dropdown, setDropdown] = useState<boolean>()
  const {userInfo} = useSelector((state: RootState) => state.user)

  const logout = () => {
    dispatch(resetState())
    navigate('/')
  }

  return (
    <HeaderWrapper>
      <button onClick={() => dispatch(openProfile())}>
        <Avatar size={10} src={userInfo!.profile_image} />
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
        <div className='relative'>
          <button
            className={`icon-btn ${dropdown && 'dark:bg-dark-fillOne'}`}
            onClick={() => setDropdown((x) => !x)}
          >
            {!dropdown ? (
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
                  d='M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
                />
              </svg>
            ) : (
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            )}
          </button>
          <ul
            className={`${
              dropdown ? 'visible' : 'invisible'
            } transition-[visibility] absolute top-full right-0 min-w-fit whitespace-nowrap w-32 max-h-60 mt-1 bg-light-bg-primary dark:bg-dark-fillOne py-1 rounded-md border dark:border-dark-separator text-sm dark:text-dark-text-primary shadow-lg`}
          >
            <li className='px-4 py-2 dark:hover:bg-dark-bg-secondary'>
              <button
                onClick={() => {
                  setDropdown(false)
                  dispatch(openCreateGroupbar())
                }}
              >
                New group
              </button>
            </li>
            <li className='px-4 py-2 dark:hover:bg-dark-bg-secondary'>
              <button>Settings</button>
            </li>
            <li className='px-4 py-2 dark:hover:bg-dark-bg-secondary'>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </HeaderWrapper>
  )
}
