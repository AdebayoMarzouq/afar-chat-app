import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserChats } from '../redux/chatSlice'
import { closeModalInfo} from '../redux/interactionSlice'
import { AppDispatch, RootState } from '../redux/store'
import { UserType } from '../types/user'
import { axiosRequest } from '../utilities/requestFunction'
import { SearchListItem } from './ChatInterface/SearchListItem'

// {
//   children,
// }: {
//   children: React.ReactNode | React.ReactNode[]
// }

export const ModalInfo = () => {
  const dispatch = useDispatch<AppDispatch>()
  const modalInfo = useSelector((state: RootState) => state.interaction.modalInfo)
  const {userToken, userInfo
} = useSelector((state: RootState) => state.user)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserType[] | null>(null)
  const [badgeItems, setBadgeItems] = useState<UserType[] | []>([])
  const [chatForm, setChatForm] = useState<{
    chat_name: string
    users: string[]
  }>({
    chat_name: 'chat',
    users: [],
  })
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    if (!search) return // display a toast warning if empty

    setLoading(true)
    try {
      const response = await axiosRequest({url: '/api/users?search=' + search, method: 'GET', token: userToken})
      const data = await response.data
      setUsers(data.users)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleUserSelect = (user: UserType) => {
    const check = chatForm.users.includes(user.email)
    if (check) return console.log('user added already')
    setChatForm((prev) => {
      return { ...prev, users: [...prev.users, user.email] }
    })
    setBadgeItems((prev) => {
      return [...prev, user]
    })
  }

  const removeUserFromForm = (user_email: string) => {
    setChatForm((prev) => {
      return {
        ...prev,
        users: prev.users.filter((item) => {
          if (item !== user_email) {
            return item
          }
        }),
      }
    })

    setBadgeItems((prev) =>
      prev.filter((item) => {
        if (item.email !== user_email) {
          return item
        }
      })
    )
  }

  const submitForm = async () => {
    if (!chatForm.chat_name || chatForm.users.length < 2)
      return console.log('fill in appropriate details')
    const form_data = {
      room_name: chatForm.chat_name,
      users: JSON.stringify(chatForm.users),
    }
    // return console.log(form_data)
    setLoading(true)
    try {
      const response = await axiosRequest({
        url: '/api/chat/group',
        method: 'POST',
        token: userToken,
        payload: form_data
      })
      console.log(response.data)
      dispatch(fetchUserChats())
      setLoading(false)
      setSearch('')
      setUsers([])
      setBadgeItems([])
      setChatForm({ chat_name: '', users: [] })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <>
      {/* <!-- Main modal --> */}
      <div
        tabIndex={-1}
        aria-hidden='true'
        className={`${
          modalInfo ? 'visible' : 'invisible'
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 md:h-full flex justify-center items-center bg-black bg-opacity-30`}
      >
        <div className='relative p-4 w-full max-w-xl h-full md:h-auto'>
          {/* <!-- Modal content --> */}
          <div className='relative bg-white rounded-lg shadow'>
            {/* <!-- Modal header --> */}
            <div className='flex justify-between items-start py-4 px-6 rounded-t border-b'>
              <h3 className='text-xl font-semibold text-gray-900'>
                Create Group
              </h3>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center'
                onClick={() => dispatch(closeModalInfo())}
              >
                <svg
                  aria-hidden='true'
                  className='w-5 h-5'
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
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className='px-6 py-4 space-y-4'>
              <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input
                    type='text'
                    name='chat_name'
                    id='chat_name'
                    className='bg-gray-50 border border-gray-300 text-light-text-primary text-sm rounded-lg focus:ring-light-main-primary focus:border-light-main-primary outline-none block w-full p-2.5'
                    placeholder='Chat Name'
                    onChange={(e) =>
                      setChatForm((prev) => {
                        return { ...prev, chat_name: e.target.value }
                      })
                    }
                  />
                </div>
                <div>
                  <div className='relative w-full flex gap-2'>
                    <input
                      type='text'
                      id='search'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 outline-none block w-full p-2.5'
                      placeholder='Search users by username or email'
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      type='button'
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
                  </div>
                </div>
                <div className='flex-1 gap-1 space-y-1 flex-wrap max-h-60 overflow-y-auto'>
                  {badgeItems.map((item) => (
                    <Badge
                      key={item.email}
                      title={item.username}
                      closeFunc={() => removeUserFromForm(item.email)}
                    />
                  ))}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2  max-h-60 overflow-y-auto'>
                  {loading && <div className='text-center'>Loading...</div>}
                  {users &&
                    !loading &&
                    users.map((user) => (
                      <button
                        type='button'
                        key={user.uuid}
                        onClick={() => handleUserSelect(user)}
                      >
                        <SearchListItem {...user} />
                      </button>
                    ))}
                </div>
              </form>
            </div>
            {/* <!-- Modal footer --> */}
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200'>
              <button
                type='button'
                className='text-white bg-light-main-primary hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto'
                onClick={() => {
                  submitForm()
                  dispatch(closeModalInfo())
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Badge = ({
  title,
  closeFunc,
}: {
  title: string
  closeFunc: () => void
}) => {
  return (
    <span className='inline-flex items-center py-1 px-2 mr-2 text-sm font-medium text-light-main-primary bg-light-main-secondary rounded'>
      {title}
      <button
        type='button'
        className='inline-flex items-center p-0.5 ml-2 text-sm text-light-main-primary bg-transparent rounded-sm hover:bg-light-main-primary hover:text-white'
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
        <span className='sr-only'>Remove badge</span>
      </button>
    </span>
  )
}
