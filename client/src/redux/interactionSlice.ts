import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { resetState } from './action'

export interface InteractionState {
  profile: boolean
  searchBar: boolean
  createGroupbar: boolean
  groupMenu: boolean
  mainToggle: boolean
}

const initialState: InteractionState = {
  profile: false,
  searchBar: false,
  createGroupbar: false,
  groupMenu: false,
  mainToggle: false
}

export const interactionSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    openProfile: (state) => {
      state.profile = true
    },
    closeProfile: (state) => {
      state.profile = false
    },
    openSearchbar: (state) => {
      state.searchBar = true
    },
    closeSearchbar: (state) => {
      state.searchBar = false
    },
    openCreateGroupbar: (state) => {
      state.createGroupbar = true
    },
    closeCreateGroupbar: (state) => {
      state.createGroupbar = false
    },

    openGroupMenu: (state) => {
      state.groupMenu= true
    },
    closeGroupMenu: (state) => {
      state.groupMenu= false
    },
    openMainToggle: (state) => {
      state.mainToggle = true
    },
    closeMainToggle: (state) => {
      state.mainToggle = false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => initialState)
  }
})

export const { openProfile, closeProfile, openSearchbar, closeSearchbar, openCreateGroupbar, closeCreateGroupbar, openGroupMenu, closeGroupMenu, openMainToggle, closeMainToggle } = interactionSlice.actions

export default interactionSlice.reducer
