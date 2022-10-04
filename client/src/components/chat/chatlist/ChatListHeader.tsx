import { ChatListHeaderDropDownMenu } from './ChatListHeaderDropDownMenu';
import { useState } from 'react'
import { Avatar } from '../../common/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import {
  openProfile,
  openSearchbar,
} from '../../../redux/interactionSlice'
import { setTheme, Theme } from '../../../redux/userSlice'
import { RootState } from '../../../redux/store'
import { useNavigate } from 'react-router-dom'
import Header from '../../common/Header';


export function ChatListHeader() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [dropdown, setDropdown] = useState<boolean>(false)
  const { userInfo } = useSelector((state: RootState) => state.user)

  return (
    <Header>
      <button onClick={() => dispatch(openProfile())}>
        <Avatar size={10} src={userInfo!.profile_image} />
      </button>
      <div className='flex items-center gap-2 ml-auto'>
        <button
          className='icon-btn'
          onClick={() => {
            dispatch(setTheme(Theme.dark))
          }}
        >
          dark
        </button>
        <button
          className='icon-btn'
          onClick={() => {
            dispatch(setTheme(Theme.light))
          }}
        >
          light
        </button>
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
          <ChatListHeaderDropDownMenu
            dropdown={dropdown}
            setDropdown={setDropdown}
          />
        </div>
      </div>
    </Header>
  )
}
