import React, {memo, useMemo} from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from 'react-redux'
import { ChatListItem } from "./ChatListItem";
import { LayoutGroup, motion } from "framer-motion";

export const ChatRoomsList = ({}) => {
  const { chats } = useSelector((state: RootState) => state.chat)

  const sorted_chats = [...chats].sort(function (a, b) {
    return a.updated_at > b.updated_at
      ? -1
      : a.updated_at < b.updated_at
      ? 1
      : 0
  })

  if (!chats.length) {
    return <div className='text-center'>
      You don not have any chats, create a group or search for some friends
    </div>
  }

  return (
    <LayoutGroup id='chats-list'>
      <motion.ul layout className='flex-grow pb-4 overflow-y-auto'>
        {sorted_chats.map((chat) => (
          <ChatListItem key={chat.uuid} {...chat} />
        ))}
      </motion.ul>
    </LayoutGroup>
  )
}
  