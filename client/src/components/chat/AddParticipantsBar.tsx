import { motion } from "framer-motion"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSocketContext } from "../../context/SocketContext"
import { fetchUserChats, setSelected, fetchRoomData } from "../../redux/chatSlice"
import { AppDispatch, RootState } from "../../redux/store"
import { UserType } from "../../types/user"
import { fetchData } from "../../utilities/fetchData"
import { Badge } from "../Badge"
import { Spinner } from "../miscellaneous/Spinner"
import { SearchListItem } from "./SearchListItem"
import { SearchUsersList } from "./SearchUsersList"

const variants = {
  initial: { x: '100%' },
  enter: {
    x: 0,
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.6,
    },
  },
  exit: {
    x: '100%',
    transition: {
      type: 'tween',
      ease: 'backOut',
      duration: 0.6,
    },
  },
}

export const AddParticipantsBar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const userToken = useSelector((state: RootState) => state.user.userToken)
  const { selected, chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserType[] | null>(null)
  const [fetch, setFetch] = useState({ loading: false, error: false })
  const [badgeItems, setBadgeItems] = useState<UserType[] | []>([])
  const [chatForm, setChatForm] = useState<{users: string[]}>({users: []})

  const handleSearch = async (e: React.FormEvent) => {
    if (!search) return // display a toast warning if empty
    setFetch({ loading: true, error: false })
    try {
      const response = await fetchData({
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
      setFetch((prev) => {
        return { ...prev, loading: false }
      })
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

  const openSelected = async (uuid: string) => {
    if (!uuid) return // toast here
    try {
      const response = await fetchData({
        url: `/api/chat`,
        token: userToken,
        method: 'POST',
        payload: { user_id: uuid },
      })
      if ((response.status = 201)) {
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
      <form
        className='flex items-center py-4 border-b px-4 shrink-0'
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
          className='p-2.5 ml-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-300 focus:ring-1 focus:outline-none transform active:scale-95'
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
      <div className='p-4 max-h-48 flex flex-shrink space-y-1 flex-wrap overflow-auto border-b'>
        {badgeItems.map((item) => (
          <Badge
            key={item.email}
            title={item.username}
            closeFunc={() => removeUserFromForm(item.email)}
          />
        ))}
      </div>
      {fetch.loading && (
        <div className='text-center py-4'>
          <Spinner />
        </div>
      )}
      {fetch.error ? (
        <div className='text-center'>An error occured while fetching users</div>
      ) : (
        users && (
          <>
            {users.length ? (
              users.map((user) => (
                <SearchListItem {...user} />
              ))
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
