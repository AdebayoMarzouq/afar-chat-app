import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ChatData, MessageListItem, RoomType } from '../types/chat'
import axios from 'axios'
import { RootState } from './store'
import { UserType } from '../types/user'
import { resetState } from './action'

export const chatCreate = createAsyncThunk<
  ChatData,
  undefined,
  { state: RootState }
>('chat/fetchRoomData', async (_, thunkAPI) => {
  const state = thunkAPI.getState()
  const selected = state.chat.selected
  const userToken = state.user.userToken
  try {
    const response = await axios.get(`/api/chat/${selected}`, {
      headers: { Authorization: 'Bearer ' + userToken },
    })
    return response.data
  } catch (error) {
    console.log(error)
    // throw toast here
  }
})

export const fetchUserChats = createAsyncThunk<
  { count: number; rooms: RoomType[] },
  undefined,
  { state: RootState }
>('chat/fetchUserChats', async (_, thunkAPI) => {
  const state = thunkAPI.getState()
  const userToken = state.user.userToken
  try {
    const response = await axios.get('/api/chat', {
      headers: { Authorization: 'Bearer ' + userToken },
    })
    return response.data
  } catch (error) {
    console.log(error)
    // throw toast here
  }
})

export const fetchRoomData = createAsyncThunk<
  ChatData,
  string | undefined,
  { state: RootState }
>('chat/fetchRoomData', async (room_id, thunkAPI) => {
  const state = thunkAPI.getState()
  const selected = state.chat.selected
  const userToken = state.user.userToken
  try {
    const response = await axios.get(
      `/api/chat/${room_id ? room_id : selected}`,
      {
        headers: { Authorization: 'Bearer ' + userToken },
      }
    )
    return response.data
  } catch (error) {
    console.log(error)
    // throw toast here
  }
})

type ChatDataHashType = {
  [key: string]: ChatData
}

export interface ChatListState {
  selected: string
  new_message_entry: boolean
  chats: RoomType[]
  chatsLoading: boolean
  chatsError: string | undefined | null
  chatDataCollection: ChatDataHashType
  chatDataLoading: boolean
  chatDataError: string | undefined | null
}

const initialState: ChatListState = {
  selected: '',
  new_message_entry: false,
  chats: [],
  chatsLoading: false,
  chatsError: null,
  chatDataCollection: {},
  chatDataLoading: false,
  chatDataError: null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<string>) => {
      state.selected = action.payload
    },
    setChats: (state, action: PayloadAction<RoomType[]>) => {
      state.chats = action.payload
    },
    updateChats: (
      state,
      action: PayloadAction<{ room_id: string; messageObj: MessageListItem }>
    ) => {
      const { room_id, messageObj } = action.payload
      const chat: RoomType | undefined = state.chats.find(
        (item) => item.uuid === room_id
      )
      if (chat) {
        chat.last_message = messageObj.Message.message_text
        chat.updated_at = messageObj.Message.updated_at
      }
    },
    appendChat: (state, action: PayloadAction<RoomType>) => {
      state.chats.unshift(action.payload)
    },
    appendMessage: (
      state,
      action: PayloadAction<{ room_id: string; messageObj: MessageListItem }>
    ) => {
      const { room_id, messageObj } = action.payload
      return {
        ...state,
        new_message_entry: !state.new_message_entry,
        chatDataCollection: {
          ...state.chatDataCollection,
          [room_id]: {
            ...state.chatDataCollection[room_id],
            messages: [
              ...state.chatDataCollection[room_id].messages,
              messageObj,
            ],
          },
        },
      }
    },
    appendParticipant: (
      state,
      action: PayloadAction<{ room_id: string; users: UserType[] }>
    ) => {
      const { room_id, users } = action.payload
      const usersToAdd = users.filter((user) => {
        const isInGroup = state.chatDataCollection[room_id].participants.find(
          (participant) => participant.uuid === user.uuid
        )
        if (!isInGroup) return user
      })
      return {
        ...state,
        chatDataCollection: {
          ...state.chatDataCollection,
          [room_id]: {
            ...state.chatDataCollection[room_id],
            participants: [
              ...state.chatDataCollection[room_id].participants,
              ...usersToAdd,
            ],
          },
        },
      }
    },
    removeParticipantFromGroup: (
      state,
      action: PayloadAction<{ room_id: string; user_id: string }>
    ) => {
      const {room_id, user_id} = action.payload;
      return {
        ...state,
        chatDataCollection: {
          ...state.chatDataCollection,
          [room_id]: {
            ...state.chatDataCollection[room_id],
            participants: state.chatDataCollection[room_id].participants.filter(
              (item) => item.uuid !== user_id
            ),
          },
        },
      }
    },
    removeGroup: (
      state,
      action: PayloadAction<string>
    ) => {
      const room_id = action.payload
      const copy = { ...state.chatDataCollection }
      delete copy[room_id]
      return {
        ...state,
        chats: state.chats.filter(chat => chat.uuid !== room_id),
        chatDataCollection: {
          ...copy
        },
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetState, () => initialState)
      .addCase(fetchUserChats.pending, (state) => {
        state.chatsLoading = true
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        if (action.payload) {
          state.chats = action.payload.rooms
          state.chatsLoading = false
        }
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.chatsLoading = false
        state.chatsError = action.error.message || ''
      })
      .addCase(fetchRoomData.pending, (state) => {
        state.chatDataLoading = true
      })
      .addCase(fetchRoomData.fulfilled, (state, action) => {
        if (action.payload) {
          state.chatDataCollection = {
            ...state.chatDataCollection,
            [action.payload.room.uuid]: action.payload,
          }
          state.chatDataLoading = false
        }
      })
      .addCase(fetchRoomData.rejected, (state, action) => {
        state.chatDataLoading = false
        state.chatDataError = action.error.message || ''
      })
  },
})

// Action creators are generated for each case reducer function
export const { setSelected, setChats, updateChats, appendMessage, appendChat, appendParticipant, removeParticipantFromGroup, removeGroup } =
  chatSlice.actions

export default chatSlice.reducer
