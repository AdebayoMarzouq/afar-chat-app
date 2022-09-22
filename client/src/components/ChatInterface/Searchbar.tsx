import axios from 'axios'
import React, { useState } from 'react'
import { UserType } from '../../types/user'
import { axiosRequest } from '../../utilities/requestFunction'
import { SearchListItem } from './SearchListItem'
import type { AppDispatch, RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { closeSearchbar } from '../../redux/interactionSlice'
import { setSelected, fetchRoomData, fetchUserChats } from '../../redux/chatSlice'
import { useSocketContext } from '../../context/SocketContext'
import { AnimatePresence, motion } from 'framer-motion'

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
  const [users, setUsers] = useState<UserType[] | null>(null)
  const [fetch, setFetch] = useState({ loading: false, error: false })

  const handleSearch = async (e: React.FormEvent) => {
    if (!search) return // display a toast warning if empty
    setFetch({ loading: true, error: false })
    try {
      const response = await axiosRequest({
        url: `/api/users?search=${search}`,
        token: userToken,
      })
      setUsers(response.data.users)
    } catch (error) {
      console.log(error)
      setFetch((prev) => {
        return { ...prev, error: true }
      })
    } finally {
      setFetch(prev => { return { ...prev, loading: false } })
    }
  }

  const openSelected = async (uuid: string) => {
    if (!uuid) return // toast here
    try {
      const response = await axiosRequest({
        url: `/api/chat`,
        token: userToken,
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
      className={`absolute bg-white inset-0 h-screen flex flex-col`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={variants}
      layout
    >
      <div className='px-2 h-16 shrink-0 flex items-center gap-6 text-xl font-semibold border-b'>
        <button className='icon-btn' onClick={() => dispatch(closeSearchbar())}>
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
        Search Users
      </div>
      <form
        className='flex items-center my-4 px-4 shrink-0'
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch(e)
        }}
      >
        <label htmlFor='search' className='sr-only'>
          Search users
        </label>
        <div className='relative w-full'>
          <input
            type='text'
            id='search'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 outline-none block w-full p-2.5'
            placeholder='Search users by username or email'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <button
          type='submit'
          className='p-2.5 ml-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-400 hover:bg-gray-300 focus:ring-1 focus:outline-none focus:ring-blue-300 transform active:scale-95'
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
      <div className='pb-4 overflow-y-auto border-t flex-grow'>
        {fetch.loading && <div className='text-center'>Loading...</div>}
        {fetch.error && (
          <div className='text-center'>
            An error occured while fetching users
          </div>
        )}
        {users &&
          !fetch.loading &&
          users.map((user) => (
            <SearchListItem
              key={user.uuid}
              openSelected={openSelected}
              {...user}
            />
          ))}
      </div>
    </motion.div>
  )
}
