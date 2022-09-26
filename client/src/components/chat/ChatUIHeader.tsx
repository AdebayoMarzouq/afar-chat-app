import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "../../hooks";
import { openGroupMenu } from "../../redux/interactionSlice";
import { RootState } from '../../redux/store'
import { RoomType } from "../../types/chat";
import { Avatar } from "./Avatar";
import { HeaderWrapper } from './HeaderWrapper'

function ChatName() {
  const { selected, chats } = useSelector((state: RootState) => state.chat)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const room:RoomType | undefined = chats.find((chat) => chat.uuid === selected)

  if (!room) return null

  const { room_name, is_group, privateUserOne, privateUserTwo } = room!
  let oppositeUser

  if (!is_group && privateUserOne && privateUserTwo && userInfo) {
    oppositeUser =
      privateUserOne.uuid !== userInfo.uuid
        ? privateUserTwo.username
        : privateUserOne.username
  }

  return (
    <div className='tracking-wider capitalize'>{room_name || oppositeUser}</div>
  )
}

export function ChatUIHeader({ }) {
  const { width } = useWindowDimensions()
  const dispatch = useDispatch()

  return (
    <HeaderWrapper>
      {width < 768 && (
        <button className='icon-btn'>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>
      )}
      <button onClick={() => {}}>
        <Avatar size={10} />
      </button>
      <ChatName />
      <div className='ml-auto flex items-center gap-2'>
        {/* <button className='icon-btn'>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            />
          </svg>
        </button> */}
        {width < 1280 && (
          <button
            className='icon-btn'
            onClick={() => dispatch(openGroupMenu())}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </button>
        )}
      </div>
    </HeaderWrapper>
  )
}
  