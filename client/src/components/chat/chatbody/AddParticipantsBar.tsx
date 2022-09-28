import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSocketContext } from "../../../context/SocketContext"
import { fetchUserChats, setSelected, fetchRoomData, appendParticipant, appendChat } from "../../../redux/chatSlice"
import { AppDispatch, RootState } from "../../../redux/store"
import { UserType } from "../../../types/user"
import { request } from "../../../utilities/request"
import { Badge } from "../../common/Badge"
import { Spinner } from "../../miscellaneous/Spinner"
import { SearchListItem } from "../../common/SearchListItem"
import { useFetch } from "../../../hooks"
import { RoomType } from "../../../types/chat"

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

export const AddParticipantsBar = ({close}:{close: ()=>void}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const userToken = useSelector((state: RootState) => state.user.userToken)
  const { selected, chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )
  const [search, setSearch] = useState('')
  const [badgeItems, setBadgeItems] = useState<UserType[] | []>([])
  const [chatForm, setChatForm] = useState<{ users: string[] }>({ users: [] })
  const { data, fetch, error, loading } = useFetch<{ status: number, users: UserType[] }>({})
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    error: false,
  })


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
    if (!chatForm.users.length)
      return console.log('Only two or more users can form a group')
    const form_data = {
      room_id: selected,
      groupUsers: JSON.stringify(chatForm.users),
    }
    setSubmitStatus((prev) => {
      return { ...prev, loading: true }
    })
    try {
      const response = await request({
        url: '/api/chat/add',
        method: 'POST',
        payload: form_data,
      })
      if (response.status === 200) { 
        // *Success toast
      }
      socket.emit('added_to_existing_group', response.data.room_id, chatForm.users)
      setSearch('')
      setBadgeItems([])
      setChatForm({ users: [] })
      close()
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
        {chatForm.users.length > 0 && (
          <button
            type='submit'
            className='icon-btn-alt ml-2'
            onClick={submitForm}
          >
            <svg
              className='w-5 h-5 rotate-90'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
              />
            </svg>
            <span className='sr-only'>Submit</span>
          </button>
        )}
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
      <div className='flex flex-grow flex-col overflow-y-auto'>
        {loading && (
          <div className='text-center py-4'>
            <Spinner />
          </div>
        )}
        {data &&
          (data.users.length ? (
            data.users.map((user) => (
              <button
                className='[&>div>div:last-child]:border-b'
                type='button'
                key={user.uuid}
                onClick={() => handleUserSelect(user)}
              >
                <SearchListItem {...user} />
              </button>
            ))
          ) : (
            <div className='text-center'>No user with this search term</div>
          ))}
        {!data && error && (
          <div className='text-center'>An error occured while searching</div>
        )}
      </div>
    </motion.div>
  )
}
