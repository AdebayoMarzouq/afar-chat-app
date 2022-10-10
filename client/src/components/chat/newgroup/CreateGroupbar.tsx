import { SubmitButton } from '../../common/SubmitButton';
// import { SearchUsersList } from './SearchUsersList'
import { useEffect, useRef, useState } from 'react'
import { UserType } from '../../../types/user'
import type { AppDispatch } from '../../../redux/store'
import { useDispatch } from 'react-redux'
import { closeCreateGroupbar } from '../../../redux/interactionSlice'
import { useSocketContext } from '../../../context/SocketContext'
import { motion } from 'framer-motion'
import { HeaderTypeone } from '../../common/HeaderTypeone'
import { useFetch } from '../../../hooks'
import { UserAddListBody } from '../../common/UserAddListBody';
import { UsersAddBadgeBody } from '../../common/UsersAddBadgeBody';
import { useCreateAdd } from '../../../hooks/useCreateAdd'
import { SearchForm } from '../../common/SearchForm'

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
  const {socket} = useSocketContext()
  const chatNameRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const [chatName, setChatName] = useState('')
  const {
    search,
    setSearch,
    badgeItems,
    setBadgeItems,
    form: usersList,
    handleUserSelect,
    removeUserFromForm,
  } = useCreateAdd()
  const {cancel: createGroupCancel, fetch: createGroup, data, loading:createGroupLoading, error:createGroupError} = useFetch<{message: string, room_id: string}>({method: 'POST'})
  const { cancel: searchCancel, data: searchData, fetch: searchUsers, error: searchError, loading: searchLoading } = useFetch<{
    status: number
    users: UserType[]
  }>({})

  const close = () => {
    dispatch(closeCreateGroupbar())
  }

  const handleSearch = async () => {
    if (!search) return //* display a toast to user
    await searchUsers('/api/users?search=' + search)
  }

  const submitForm = async () => {
    if (!chatName) return console.log('Group name not filled')
    if (usersList.length < 2)
      return console.log('Only two or more users can form a group')
    const form_data = {
      room_name: chatName,
      users: JSON.stringify(usersList),
    }
    await createGroup('/api/chat/group', form_data)
    if (data !== null) {
      socket.emit('created_new_group', data.room_id)
      dispatch(closeCreateGroupbar())
      setSearch('')
      setBadgeItems([])
      setChatName('')
    }
    else {
      //* pass toast here
    }
  }

  // useEffect(() => {
  //   return () => {
  //     searchCancel()
  //     createGroupCancel()
  //   }
  // }, [])

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
      <div className='py-4 dark:border-dark-separator px-4 shrink-0'>
        <label htmlFor='chat name' className='sr-only'>
          Chat Name
        </label>
        <input
          type='text'
          name='chat_name'
          ref={chatNameRef}
          id='chat_name'
          className='input-style1'
          placeholder='Chat Name'
          onChange={(e) => setChatName(e.target.value)}
        />
      </div>
      <SearchForm
        handleSearch={handleSearch}
        setSearch={setSearch}
        search={search}
      />
      <UsersAddBadgeBody
        badgeItems={badgeItems}
        removeUserFromForm={removeUserFromForm}
      />
      <UserAddListBody
        loading={searchLoading}
        data={searchData}
        handleUserSelect={handleUserSelect}
        error={searchError}
      />
      <SubmitButton submit={submitForm} loading={createGroupLoading} />
    </motion.div>
  )
}
  