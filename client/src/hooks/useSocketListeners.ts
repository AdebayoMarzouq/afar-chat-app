import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSocketContext } from "../context/SocketContext"
import { appendChat, updateChats, appendMessage, fetchRoomData, appendParticipant, removeParticipantFromGroup, setSelected, removeGroup } from "../redux/chatSlice"
import { AppDispatch, RootState } from "../redux/store"
import { setStatus, Status } from "../redux/userSlice"
import { RoomType, MessageListItem } from "../types/chat"
import { UserType } from "../types/user"

export const useSocketListeners = () => {
  const renderRef = useRef(1)
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const { userInfo, userStatus } = useSelector((state: RootState) => state.user)
  const chatDataCollection = useSelector((state: RootState) => state.chat.chatDataCollection)
  const chatDataCollectionRef = useRef(chatDataCollection)

  console.log(socket)
  console.log('hook rendered ' + renderRef.current + ' times')
  
  useEffect(() => {
    renderRef.current++
  })

  useEffect(() => {
    chatDataCollectionRef.current = chatDataCollection
  }, [chatDataCollection])

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     console.log('connected')
  //     if (socket.connected) {
  //       dispatch(setStatus(Status.online))
  //     }



  //   })



  //   // socket.on('disconnect', (reason) => {
  //   //   dispatch(setStatus(Status.offline))
  //   //   if (reason === 'transport close') {
  //   //     //** User network is offline */
  //   //     console.log('socket disconnected transport close')
  //   //   }
  //   //   if (reason === 'ping timeout') {
  //   //     console.log('server ping timeout')
  //   //   } else {
  //   //     socket.connect()
  //   //     console.log('user disconnected, user is offline')
  //   //   }
  //   // })
  // }, [])
  
  useEffect(() => {
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
      console.log('user left group or has been removed from group...')
      dispatch(removeParticipantFromGroup({ room_id, user_id }))
    }

    const youHaveBeenRemovedFromGroupHandler = (
      room_id: string,
      user_id: string
    ) => {
      console.log('I have just been from group...')
      dispatch(setSelected(''))
      dispatch(removeGroup(room_id))
    }

    socket.on('connect', () => {
      console.log('<<connected>>')
      dispatch(setStatus(Status.online))
      socket.emit('joinRooms', {
        username: userInfo!.username,
        user_id: userInfo!.uuid,
      })
      socket.on('added_to_existing_group', addedToExistingGroupHandler)
      socket.on(
        'new_user_added_to_existing_room',
        newUserAddedToExistingRoomHandler
      )
      socket.on('added_to_new_group', addedNewGroupHandler)
      socket.on('user_left_group', userLeftGroupHandler)
      socket.on(
        'you_have_been_removed_from_group',
        youHaveBeenRemovedFromGroupHandler
      )
      socket.on('message_received', messageRecievedHandler)
      socket.on('message_send_error', messageSendErrorHandler)
    })

    socket.on('disconnect', () => {
      console.log('===disconnected!!!===')
      dispatch(setStatus(Status.offline))
    })

    return () => {
      console.log('cleans up all listeners')
      socket.off('added_to_new_group', addedNewGroupHandler)
      socket.off('message_received', messageRecievedHandler)
      socket.off('added_to_existing_group', addedToExistingGroupHandler)
      socket.off('user_left_group', userLeftGroupHandler)
      socket.off(
        'you_have_been_removed_from_group',
        youHaveBeenRemovedFromGroupHandler
      )
      socket.off('message_send_error', messageSendErrorHandler)
      socket.off(
        'new_user_added_to_existing_room',
        newUserAddedToExistingRoomHandler
      )
    }
  }, [])

  useEffect(() => {
    socket.io.on('error', (error) => {
      console.log(error)
      dispatch(setStatus(Status.failed))
    })

    socket.io.on('reconnect', (attempt) => {
      console.log(attempt)
      console.log('user reconnected, user is online')
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      dispatch(setStatus(Status.reconnecting))
    })

    socket.on('connect_error', () => {})

    // socket.io.on('reconnect_error', (error) => {
    //   console.log(error)
    //   socket.disconnect()
    //   dispatch(setStatus(Status.failed))
    // })

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(attempt)
      if (attempt >= 2) {
        socket.disconnect()
        console.log('socket disconnected successfully')
        dispatch(setStatus(Status.offline))
      } else {
        dispatch(setStatus(Status.reconnecting))
      }
    })
  }, [])
}