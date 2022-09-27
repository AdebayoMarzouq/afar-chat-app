import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { ChatList, ChatMenubar, ChatUI } from '../../components'
import { SocketProvider, useSocketContext } from '../../context/SocketContext'
import { useWindowDimensions } from '../../hooks'
import {
  appendChat,
  appendMessage,
  appendParticipant,
  fetchRoomData,
  fetchUserChats,
  updateChats,
} from '../../redux/chatSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { ChatListType, MessageListItem, RoomType } from '../../types/chat'
import { UserType } from '../../types/user'

export const Chat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { width } = useWindowDimensions()
  const { socket } = useSocketContext()
  const { userInfo } = useSelector((state: RootState) => state.user)
  const { selected, chatDataCollection } = useSelector((state: RootState) => state.chat)
  const {groupMenu, mainToggle} = useSelector((state: RootState) => state.interaction)
  const chatDataCollectionRef = useRef(chatDataCollection)

  useEffect(() => {
    dispatch(fetchUserChats())
  }, [])

  useEffect(() => {
    chatDataCollectionRef.current = chatDataCollection
  })

  useEffect(() => {
    if (!userInfo || !socket) return

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

    socket.on('added_to_existing_group', addedToExistingGroupHandler)

    socket.on(
      'new_user_added_to_existing_room',
      newUserAddedToExistingRoomHandler
    )

    socket.on('added_to_new_group', addedNewGroupHandler)
    
    socket.on('message_received', messageRecievedHandler)

    return () => {
      socket.off('added_to_new_group', addedNewGroupHandler)
      socket.off('message_received', messageRecievedHandler)
      socket.off('added_to_existing_group', addedToExistingGroupHandler)
      socket.off(
        'new_user_added_to_existing_room',
        newUserAddedToExistingRoomHandler
      )
    }
  }, [])

  return (
    <div className='w-screen h-screen grid grid-cols-1 md:grid-cols-5 xl:grid-cols-12 divide-x'>
      {width >= 768 && (
        <>
          <ChatList />
          <ChatUI />
          {width >= 1280 && <ChatMenubar />}
        </>
      )}
      {width < 768 && <>{mainToggle ? <ChatUI /> : <ChatList />}</>}
    </div>
  )
}
