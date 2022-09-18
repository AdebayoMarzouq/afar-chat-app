import axios from 'axios'
import React, { useState } from 'react'
import { UserType } from '../../types/user'
import { axiosRequest } from '../../utilities/requestFunction'
import { SearchListItem } from './SearchListItem'
import type { AppDispatch, RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { closeSearchbar } from '../../redux/interactionSlice'
import { setSelected, fetchRoomData } from '../../redux/chatSlice'

export const Searchbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchBar = useSelector(
    (state: RootState) => state.interaction.searchBar
  )
  const userToken = useSelector((state: RootState) => state.user.userToken)
  const { selected, chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserType[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    if (!search) return // display a toast warning if empty
    setLoading(true)
    const {
      loading,
      _error: error,
      data,
    } = await axiosRequest({
      url: `/api/users?search=${search}`,
      token: userToken,
    })
    if (error) console.log(error)
    setUsers(data.users)
    setLoading(loading)
  }

  const openSelected = (uuid: string) => {
    if (uuid !== selected) {
      dispatch(setSelected(uuid))
    }
    if (!chatDataCollection[uuid]) {
      dispatch(fetchRoomData())
    }
  }

  // const submitForm = async () => {
  //   if (!chatForm.chat_name || chatForm.users.length < 2)
  //     return console.log('fill in appropriate details')
  //   const form_data = {
  //     room_name: chatForm.chat_name,
  //     users: JSON.stringify(chatForm.users),
  //   }
  //   // return console.log(form_data)
  //   setLoading(true)
  //   try {
  //     // const response = await axios.post('/api/chat/group', {
  //     //   data: form_data,
  //     //   headers: { Authorization: `Bearer ${token}` },
  //     // })
  //     const { data, _error } = await axiosRequest({
  //       url: '/api/chat/group',
  //       method: 'POST',
  //       token: userToken,
  //       payload: form_data,
  //     })
  //     // console.log(response)
  //     if (_error) console.log(_error)
  //     setUsers(data.users)
  //   } catch (error) {
  //     setLoading(false)
  //   }
  // }

  return (
    <div
      className={`slide-in ${
        searchBar ? 'translate-x-0' : '-translate-x-full'
      } absolute bg-white inset-0 h-screen flex flex-col`}
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
        className='flex items-center my-4 px-2 shrink-0'
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
        {loading && <div className='text-center'>Loading...</div>}
        {users &&
          !loading &&
          users.map((user) => <SearchListItem key={user.uuid} {...user} />)}
      </div>
    </div>
  )
}
