import React, {useMemo} from "react";
import { RootState } from "../../redux/store";
import { ChatListItem } from "./ChatListItem";
import {useSelector} from 'react-redux'

export function ChatRoomsList({ openSelected }: {openSelected: (uuid: string) => void}) {
  const { userInfo } = useSelector((state: RootState) => state.user)
  const { selected, chats } = useSelector((state: RootState) => state.chat)

  const sorted_chats = useMemo(
    () =>
      [...chats].sort(function (b, a) {
        if (a.updated_at < b.updated_at) return -1
        else if (a.updated_at > b.updated_at) return 1
        return 0
      }),
    [chats]
  )

  return (
    <div className='pb-4 overflow-y-auto flex-grow'>
      {chats && chats.length ? (
        sorted_chats.map((chatItem) => {
          return (
            <ChatListItem
              key={chatItem.uuid}
              currentUser={userInfo!.uuid}
              selected={selected}
              openSelected={openSelected}
              {...chatItem}
            />
          )
        })
      ) : (
        <div className='text-center'>
          You don not have any chats, create a group or search for some friends
        </div>
      )}
    </div>
  )
}
  