import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InfoColumn, LeftColumn, RightColumn } from '../../components'
import { useSocketContext } from '../../context/SocketContext'
import { useWindowDimensions } from '../../hooks'
import {
  appendChat,
  appendMessage,
  appendParticipant,
  fetchRoomData,
  fetchUserChats,
  removeParticipantFromGroup,
  updateChats
} from '../../redux/chatSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { MessageListItem, RoomType } from '../../types/chat'
import { UserType } from '../../types/user'

export const Chat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { width } = useWindowDimensions()
  const { socket } = useSocketContext()
  const { userInfo } = useSelector((state: RootState) => state.user)
  const { chatDataCollection } = useSelector((state: RootState) => state.chat)
  const { mainToggle} = useSelector((state: RootState) => state.interaction)
  const chatDataCollectionRef = useRef(chatDataCollection)

  useEffect(() => {
    chatDataCollectionRef.current = chatDataCollection
  })

  useEffect(() => {
    
    if (!userInfo || !socket) return
    //* Fetches user Chats for first time after which the socket takes over
    dispatch(fetchUserChats())


    socket.emit('joinRooms', {
      username: userInfo.username,
      user_id: userInfo.uuid,
    })

    const addedNewGroupHandler = (room: RoomType) => {
      dispatch(appendChat(room))
    }

    const messageRecievedHandler = (
      room_id: string,
      messageObj: MessageListItem
    ) => {
      dispatch(updateChats({ room_id, messageObj }))
      if (chatDataCollectionRef.current[room_id]) {
        dispatch(appendMessage({ room_id, messageObj }))
      } else {
        dispatch(fetchRoomData(room_id))
      }
    }

    const newUserAddedToExistingRoomHandler = (
      room_id: string,
      users: UserType[]
    ) => {
      console.log(users)
      dispatch(appendParticipant({ room_id, users }))
    }

    const addedToExistingGroupHandler = (room: RoomType) => {
      dispatch(appendChat(room))
    }

    const messageSendErrorHandler = (message: string) => {
      console.log(message)
    }

    const userLeftGroupHandler = (room_id: string, user_id: string) => {
      console.log('user left group...')
      dispatch(removeParticipantFromGroup({room_id, user_id}))
    }

    socket.on('added_to_existing_group', addedToExistingGroupHandler)

    socket.on(
      'new_user_added_to_existing_room',
      newUserAddedToExistingRoomHandler
    )

    socket.on('added_to_new_group', addedNewGroupHandler)
    socket.on('user_left_group', userLeftGroupHandler)
    
    socket.on('message_received', messageRecievedHandler)
    socket.on('message_send_error', messageSendErrorHandler)
    
    return () => {
      socket.off('added_to_new_group', addedNewGroupHandler)
      socket.off('message_received', messageRecievedHandler)
      socket.off('added_to_existing_group', addedToExistingGroupHandler)
      socket.off('user_left_group', userLeftGroupHandler)
      socket.off('message_send_error', messageSendErrorHandler)
      socket.off(
        'new_user_added_to_existing_room',
        newUserAddedToExistingRoomHandler
      )
    }
  }, [])
  
  if (width < 1280) {
    return (
      <div className='grid w-screen h-screen grid-cols-1 divide-x md:grid-cols-5 xl:grid-cols-12 dark:divide-dark-separator'>
        <LeftColumn />
        <RightColumn />
      </div>
    )
  }

  return (
    <div className='grid w-screen h-screen grid-cols-1 divide-x md:grid-cols-5 xl:grid-cols-12 dark:divide-dark-separator'>
      <LeftColumn />
      <RightColumn />
      <InfoColumn />
    </div>
  )
}
