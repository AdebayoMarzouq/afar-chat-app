import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSocketContext } from '../../../context/SocketContext'
import { useFetch } from '../../../hooks'
import { AppDispatch } from '../../../redux/store'
import { UserType } from '../../../types/user'
import { request } from '../../../utilities/request'
import { Badge } from '../../common/Badge'
import { SearchListItem } from '../../common/SearchListItem'
import { Spinner } from '../../miscellaneous/Spinner'

const variants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      type: 'tween',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      type: 'tween',
      duration: 0.2,
    },
  },
}

export const CreateGroupModal = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const chatNameRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [submitStatus, setSubmitStatus] = useState({loading: false, error: false})
  const [badgeItems, setBadgeItems] = useState<UserType[] | []>([])
  const [chatForm, setChatForm] = useState<{
    chat_name: string
    users: string[]
  }>({
    chat_name: '',
    users: [],
  })
  const { data, fetch, error, loading } = useFetch<{ status: number, users: UserType[] }>({})

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
    if (chatForm.users.length < 2) return console.log('Only two or more users can form a group')
    const form_data = {
      room_name: chatForm.chat_name,
      users: JSON.stringify(chatForm.users),
    }
    setSubmitStatus(prev => {return {...prev, loading: true}})
    try {
      const response = await request({
        url: '/api/chat/group',
        method: 'POST',
        payload: form_data,
      })
      socket.emit('created_new_group', response.data.room_id)
      // dispatch(closeModalInfo())
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

  useEffect(() => {
    if (!chatNameRef.current) return
    chatNameRef.current.focus()
  }, [])

  return (
    <>
      {/* <!-- Main modal --> */}
      <motion.div
        tabIndex={-1}
        aria-hidden='true'
        className={`overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full h-full bg-black dark:bg-white flex justify-center items-center bg-opacity-30 dark:bg-opacity-20`}
        initial='initial'
        animate='enter'
        exit='exit'
        variants={variants}
        layout
      >
        <div className='relative p-4 w-full max-w-xl h-full md:h-auto flex justify-center items-center'>
          {/* <!-- Modal content --> */}
          <div className='relative bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg shadow w-full'>
            {/* <!-- Modal header --> */}
            <div className='flex justify-between items-start py-4 px-6 rounded-t border-b dark:border-dark-separator'>
              <h3 className='text-xl font-semibold text-light-text-primary dark:text-dark-text-primary'>
                Create Group
              </h3>
              <button
                type='button'
                className='icon-btn dark:text-dark-text-secondary'
                // onClick={() => dispatch(closeModalInfo())}
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
                    ref={chatNameRef}
                    id='chat_name'
                    className='input-style1'
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
                      className='input-style1'
                      placeholder='Search users by username or email'
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      type='button'
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
                  </div>
                </div>
                <div className='flex-1 space-y-1 flex-wrap max-h-60 overflow-y-auto'>
                  {badgeItems.map((item) => (
                    <Badge
                      key={item.email}
                      title={item.username}
                      closeFunc={() => removeUserFromForm(item.email)}
                    />
                  ))}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2  max-h-60 overflow-y-auto'>
                  {loading && (
                    <div className='text-center py-4'>
                      <Spinner />
                    </div>
                  )}
                  {data &&
                    (data.users.length ? (
                      data.users.map((user) => (
                        <button
                          type='button'
                          key={user.uuid}
                          onClick={() => handleUserSelect(user)}
                        >
                          <SearchListItem {...user} />
                        </button>
                      ))
                    ) : (
                      <div className='text-center'>
                        No user with this search term
                      </div>
                    ))}
                  {!data && error && (
                    <div className='text-center'>
                      An error occured while searching
                    </div>
                  )}
                </div>
              </form>
            </div>
            {/* <!-- Modal footer --> */}
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-dark-separator'>
              <button
                type='button'
                className='text-white bg-light-main-primary dark:bg-dark-main-primary transform hover:scale-105 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-auto'
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
          </div>
        </div>
      </motion.div>
    </>
  )
}
