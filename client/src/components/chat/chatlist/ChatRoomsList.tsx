import React, {memo, useMemo} from "react";
import { RootState } from "../../../redux/store";
import { ChatListItem } from "./ChatListItem";
import { useSelector } from 'react-redux'

export const ChatRoomsList = () => {
  const { chats } = useSelector((state: RootState) => state.chat)

  const sorted_chats = useMemo(
    () =>
      [...chats].sort(function (a, b) {
        return a.updated_at > b.updated_at
          ? -1
          : a.updated_at < b.updated_at
          ? 1
          : 0
      }),
    [chats]
  )

  const ListItem = ({ index }: { index: number; key: string }) => {
    const chat = sorted_chats[index]
    return <ChatListItem key={chat.uuid} {...chat} />
  }

  return (
    <div className='pb-4 overflow-y-auto flex-grow'>
      {chats && chats.length ? (
        sorted_chats.map(chat => <ChatListItem key={chat.uuid} {...chat} />)
      ) : (
        <div className='text-center'>
          You don not have any chats, create a group or search for some friends
        </div>
      )}
    </div>
  )
}
  