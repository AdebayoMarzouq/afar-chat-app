import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { useSocketContext } from "../../../context/SocketContext"
import { RootState } from "../../../redux/store"
import { UserType } from "../../../types/user"
import { useFetch } from "../../../hooks"
import { UserAddListBody } from "../../common/UserAddListBody"
import { UsersAddBadgeBody } from "../../common/UsersAddBadgeBody"
import { useCreateAdd } from "../../../hooks/useCreateAdd"
import { SearchForm } from "../../common/SearchForm"
import { SubmitButton } from "../../common/SubmitButton"
import { useEffect } from "react"

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
  const { socket } = useSocketContext()
  const { selected } = useSelector(
    (state: RootState) => state.chat
  )
  const {
    search,
    setSearch,
    badgeItems,
    setBadgeItems,
    form: usersList,
    setForm,
    handleUserSelect,
    removeUserFromForm,
  } = useCreateAdd()
  const {
    cancel: addParticipantsCancel,
    fetch: addParticipants,
    data,
    error: addParticipantsError,
    loading: addParticipantsLoading,
  } = useFetch<{ message: string; room_id: string }>({ method: 'POST' })
  const {
    cancel: searchCancel,
    data: searchData,
    fetch: searchUsers,
    error: searchError,
    loading: searchLoading,
  } = useFetch<{
    status: number
    users: UserType[]
  }>({})

  const handleSearch = async () => {
    if (!search) return //* display a toast to user
    await searchUsers('/api/users?search=' + search)
  }

  const submit = async () => {
    if (!usersList.length) return console.log('No user selected')
    const form_data = {
      room_id: selected,
      groupUsers: JSON.stringify(usersList),
    }
    await addParticipants('/api/chat/add', form_data)
    if (data !== null) {
      // *Success toast
      socket.emit('added_to_existing_group', data.room_id, usersList)
      setSearch('')
      setBadgeItems([])
      setForm([])
      close()
    } else {
      //* pass toast here
    }
  }

  useEffect(() => {
    return () => {
      searchCancel()
      addParticipantsCancel()
    }
  }, [])

  return (
    <motion.div
      className={`absolute bg-light-bg-primary dark:bg-dark-bg-primary inset-0 flex flex-col`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={variants}
      layout
    >
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
        type='existing-group'
        loading={searchLoading}
        data={searchData}
        handleUserSelect={handleUserSelect}
        error={searchError}
      />
      <SubmitButton
        submit={submit}
        loading={addParticipantsLoading}
      />
    </motion.div>
  )
}
