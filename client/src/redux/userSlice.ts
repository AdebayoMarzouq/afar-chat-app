import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../types/user'
import { resetState } from './action'

export enum Theme {
  light = 'light',
  dark = 'dark',
  plain = 'plain',
}
export interface UserState {
  userToken: string | null
  userInfo: UserType | null
  userSettings: {
    theme: Theme
  }
}

const initialState: UserState = {
  userToken: null,
  userInfo: null,
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
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => initialState)
  }
})

// Action creators are generated for each case reducer function
export const { addUserInfo, addUserToken, setTheme } = userSlice.actions

export default userSlice.reducer
