// import { SearchUsersList } from './SearchUsersList'
import { useRef, useState } from 'react'
import { UserType } from '../../../types/user'
import { request } from '../../../utilities/request'
import type { AppDispatch } from '../../../redux/store'
import { useDispatch } from 'react-redux'
import { closeCreateGroupbar } from '../../../redux/interactionSlice'
import { useSocketContext } from '../../../context/SocketContext'
import { motion } from 'framer-motion'
import { HeaderTypeone } from '../../common/HeaderTypeone'
import { useFetch } from '../../../hooks'
import { UserAddListBody } from '../../common/UserAddListBody';
import { UsersAddBadgeBody } from '../../common/UsersAddBadgeBody';

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

export const CreateGroupbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const chatNameRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: false,
  })
  const [badgeItems, setBadgeItems] = useState<UserType[] | []>([])
  const [chatForm, setChatForm] = useState<{
    chat_name: string
    users: string[]
  }>({
    chat_name: '',
    users: [],
  })
  const { data, fetch, error, loading } = useFetch<{
    status: number
    users: UserType[]
  }>({})

  const close = () => {
    dispatch(closeCreateGroupbar())
  }

  const handleSearch = async () => {
    if (!search) return //* display a toast to user
    await fetch('/api/users?search=' + search)
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
    if (!chatForm.chat_name) return console.log('Group name not filled')
    if (chatForm.users.length < 2)
      return console.log('Only two or more users can form a group')
    const form_data = {
      room_name: chatForm.chat_name,
      users: JSON.stringify(chatForm.users),
    }
    setSubmitStatus((prev) => {
      return { ...prev, loading: true }
    })
    try {
      const response = await request({
        url: '/api/chat/group',
        method: 'POST',
        payload: form_data,
      })
      socket.emit('created_new_group', response.data.room_id)
      dispatch(closeCreateGroupbar())
      setSearch('')
      setBadgeItems([])
      setChatForm({ chat_name: '', users: [] })
    } catch (error) {
      console.log(error)
      setSubmitStatus((prev) => {
        return { ...prev, error: true }
      })
      //* pass toast here
    } finally {
      setSubmitStatus((prev) => {
        return { ...prev, loading: false }
      })
    }
  }

  return (
    <motion.div
      className={`absolute bg-light-bg-primary dark:bg-dark-bg-primary inset-0 flex flex-col`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={variants}
      layout
    >
      <HeaderTypeone title='Create new group' fn={close} />
      <form
        className='flex items-center py-4 border-b dark:border-dark-separator px-4 shrink-0'
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
      <UsersAddBadgeBody
        badgeItems={badgeItems}
        removeUserFromForm={removeUserFromForm}
      />
      <UserAddListBody
        loading={loading}
        data={data}
        handleUserSelect={handleUserSelect}
        error={error}
      />
      <div className='bg-inherit flex justify-center items-center h-20 shrink-0 border-t dark:border-dark-separator'>
        <button
          type='button'
          className='text-white bg-light-main-primary dark:bg-dark-main-primary transform hover:scale-105 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center'
          onClick={() => {
            submitForm()
          }}
        >
          {submitStatus.loading ? (
            <>
              <svg
                role='status'
                className='inline mr-3 w-4 h-4 text-white animate-spin'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='#E5E7EB'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentColor'
                />
              </svg>
              Creating...
            </>
          ) : (
            <>Create</>
          )}
        </button>
      </div>
    </motion.div>
  )
}
