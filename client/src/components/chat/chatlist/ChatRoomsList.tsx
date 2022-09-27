import React, {memo, useMemo} from "react";
import { RootState } from "../../../redux/store";
import { ChatListItem } from "./ChatListItem";
import { useSelector } from 'react-redux'
import {FixedSizeList} from 'react-window'

export const ChatRoomsList = () => {
  const { chats } = useSelector((state: RootState) => state.chat)

  const sorted_chats = useMemo(
    () =>
      [...chats].sort(function (a, b) {
        return a.updated_at > b.updated_at ? -1 : a.updated_at < b.updated_at ? 1 : 0
      }),
    [chats]
  )

  return (
    <div className='pb-4 overflow-y-auto flex-grow'>
      {chats && chats.length ? (
        <FixedSizeList height={100}  itemCount={sorted_chats.length} itemSize={40} width={100}>
          {sorted_chats.map((chatItem) => {
            return <ChatListItem key={chatItem.uuid} {...chatItem} />
          })}
        </FixedSizeList>
      ) : (
        <div className='text-center'>
          You don not have any chats, create a group or search for some friends
        </div>
      )}
    </div>
  )
}
  