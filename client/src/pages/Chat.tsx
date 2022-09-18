import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChatList, ChatUI } from '../components'
import { useSocketContext } from '../context/SocketContext'
import {
  appendMessage,
  fetchRoomData,
  fetchUserChats,
  updateChats,
} from '../redux/chatSlice'
import { AppDispatch, RootState } from '../redux/store'
import { MessageListItem } from '../types/chat'

export const Chat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const { userInfo } = useSelector((state: RootState) => state.user)
  const { chatDataCollection } = useSelector((state: RootState) => state.chat)

  const chatDataCollectionRef = useRef(chatDataCollection)

  useEffect(() => {
    dispatch(fetchUserChats())
  }, [])

  useEffect(() => {
    chatDataCollectionRef.current = chatDataCollection
  })

  useEffect(() => {
    if (!userInfo) return
    socket.emit('joinRooms', {
      username: userInfo.username,
      user_id: userInfo.uuid,
    })

    const messageRecievedHandler = (room_id: string, messageObj: MessageListItem) => {
      dispatch(updateChats({ room_id, messageObj }))
      if (chatDataCollectionRef.current[room_id]) {
        console.log('trueee, it is present and just look into the slice')
        dispatch(appendMessage({ room_id, messageObj }))
      } else {
        dispatch(fetchRoomData(room_id))
      }
    }

    socket.on('message_received', messageRecievedHandler)

    return () => {
      socket.off('message_received', messageRecievedHandler)
    }
  }, [])

  return (
    <div className='w-full h-screen grid grid-cols-1 md:grid-cols-3 divide-x'>
      <ChatList />
      <ChatUI />
    </div>
  )
}
