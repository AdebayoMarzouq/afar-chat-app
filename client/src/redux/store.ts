import { combineReducers, configureStore } from '@reduxjs/toolkit'
import chatReducer from './chatSlice'
import interactionReducer from './interactionSlice'
import storage from 'redux-persist/lib/storage'
import userReducer from './userSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const persistUserConfig = {
  key: 'user',
  storage,
}

const persistedUserReducer = persistReducer(persistUserConfig, userReducer)

export const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    user: persistedUserReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
