import { SearchUsersList } from './SearchUsersList';
import { useState } from 'react'
import { UserType } from '../../../types/user'
import { request } from '../../../utilities/request'
import type { AppDispatch, RootState } from '../../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { closeSearchbar } from '../../../redux/interactionSlice'
import { setSelected, fetchRoomData, fetchUserChats } from '../../../redux/chatSlice'
import { useSocketContext } from '../../../context/SocketContext'
import { motion } from 'framer-motion'
import { Spinner } from '../../miscellaneous/Spinner'
import { HeaderTypeone } from '../../common/HeaderTypeone';
import { useFetch } from '../../../hooks';

const variants = {
  initial: { opacity: 0, x: '-100%' },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.6,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      type: 'spring',
      duration: 0.5,
      bounce: 0,
    },
  },
}

export const Searchbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const userToken = useSelector((state: RootState) => state.user.userToken)
  const { selected, chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )
  const [search, setSearch] = useState('')
  const { data, fetch, error, loading } = useFetch<{
    status: number
    users: UserType[]
  }>({})

  const close = () => {
    dispatch(closeSearchbar())
  }

  const handleSearch = async () => {
    if (!search) return //* display a toast to user
    await fetch('/api/users?search=' + search)
  }

  const openSelected = async (uuid: string) => {
    if (!uuid) return // toast here
    try {
      const response = await request({
        url: `/api/chat`,
        method: 'POST',
        payload: { user_id: uuid }
      })
      if (response.status = 201) {
        const room_id = response.data.room_id
        socket.emit('joinRoom', room_id)
        dispatch(fetchUserChats())
        if (room_id !== selected) {
          dispatch(setSelected(room_id))
        }
        if (!chatDataCollection[room_id]) {
          dispatch(fetchRoomData())
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <motion.div
      className={`absolute bg-white inset-0 flex flex-col`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={variants}
      layout
    >
      <HeaderTypeone title='Search users' fn={close} />
      <form
        className='flex items-center py-4 border-b px-4 shrink-0'
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        <label htmlFor='search' className='sr-only'>
          Search users
        </label>
        <div className='relative w-full'>
          <input
            type='text'
            id='search'
            className='input-style1'
            placeholder='Search users by username or email'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <button
          type='submit'
          className='icon-btn-alt ml-2'
          onClick={handleSearch}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
          <span className='sr-only'>Search</span>
        </button>
      </form>
      {loading && (
        <div className='text-center py-4'>
          <Spinner />
        </div>
      )}
      {error ? (
        <div className='text-center'>An error occured while fetching users</div>
      ) : (
        data && (
          <>
            {data.users.length ? (
              <SearchUsersList users={data.users} openSelected={openSelected} />
            ) : (
              <div className='text-center py-4 px-4'>
                No user with name or email {search}
              </div>
            )}
          </>
        )
      )}
    </motion.div>
  )
}
