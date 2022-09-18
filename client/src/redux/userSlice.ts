import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../types/user'

export interface UserState {
  userToken: string | null
  userInfo: UserType | null
}

const initialState: UserState = {
  userToken: null,
  userInfo: null,
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
  },
})

// Action creators are generated for each case reducer function
export const { addUserInfo, addUserToken } = userSlice.actions

export default userSlice.reducer
