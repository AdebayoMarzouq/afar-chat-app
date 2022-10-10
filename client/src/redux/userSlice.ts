import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../types/user'
import { resetState } from './action'

export enum Theme {
  light = 'light',
  dark = 'dark',
  plain = 'plain',
}

export enum Status {
  online = 'online',
  offline = 'offline',
  reconnecting = 'reconnecting',
  failed = 'failed'
}
export interface UserState {
  userToken: string | null
  userInfo: UserType | null
  userStatus: Status
  userSettings: {
    theme: Theme
  }
}

const initialState: UserState = {
  userToken: null,
  userInfo: null,
  userStatus: Status.offline,
  userSettings: {
    theme: Theme.light,
  },
}

// const fetchUserInfo = userInfo

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserInfo: (state, action: PayloadAction<UserType | null>) => {
      state.userInfo = action.payload
    },
    addUserToken: (state, action: PayloadAction<string | null>) => {
      state.userToken = action.payload
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.userSettings.theme = action.payload
    },
    setStatus: (state, action: PayloadAction<Status>) => {
      state.userStatus = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => initialState)
  }
})

// Action creators are generated for each case reducer function
export const { addUserInfo, addUserToken, setTheme, setStatus } = userSlice.actions

export default userSlice.reducer
