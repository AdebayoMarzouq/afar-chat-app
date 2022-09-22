import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface InteractionState {
  profile: boolean
  searchBar: boolean
  modalInfo: boolean
  groupMenu: boolean
}

const initialState: InteractionState = {
  profile: false,
  searchBar: false,
  modalInfo: false,
  groupMenu: false,
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
    openModalInfo: (state) => {
      state.modalInfo = true
    },
    closeModalInfo: (state) => {
      state.modalInfo = false
    },

    openGroupMenu: (state) => {
      state.groupMenu= true
    },
    closeGroupMenu: (state) => {
      state.groupMenu= false
    },
  },
})

export const { openProfile, closeProfile, openSearchbar, closeSearchbar, openModalInfo, closeModalInfo, openGroupMenu, closeGroupMenu } = interactionSlice.actions

export default interactionSlice.reducer
