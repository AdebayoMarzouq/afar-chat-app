import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InfoColumn, LeftColumn, RightColumn } from '../../components'
import { useWindowDimensions } from '../../hooks'
import { useSocketListeners } from '../../hooks/useSocketListeners'
import {
  fetchUserChats} from '../../redux/chatSlice'
import { AppDispatch, RootState } from '../../redux/store'

export const Chat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { width } = useWindowDimensions()
  useSocketListeners()

  const page =
    'grid w-screen h-screen grid-cols-1 divide-x md:grid-cols-5 xl:grid-cols-12 dark:divide-dark-separator'

  useEffect(() => {
    dispatch(fetchUserChats())
  }, [])
  
  if (width < 1280) {
    return (
      <div className={page}>
        <LeftColumn />
        <RightColumn />
      </div>
    )
  }

  return (
    <div className={page}>
      <LeftColumn />
      <RightColumn />
      <InfoColumn />
    </div>
  )
}
