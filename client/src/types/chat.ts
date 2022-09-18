import { UserType } from "./user"

export type RoomType = {
  uuid: string
  room_name: string
  is_group: boolean
  last_message: null | string
  created_at: string
  updated_at: string
}

export type ChatListType = {
  count: number
  rooms: RoomType[]
}

export type ChatParticipant = UserType & {
  Participants: {
    joined_at: string
  }
}

export type MessageType = {
  uuid: string
  message_text: string
  deleted_at: string | null
  sent_at: string
  updated_at: string
  repliedMessageId: number | null
}

export type MessageListItem = UserType & {
  Message: MessageType
}

export type ChatData = {
  room: {
    uuid: string
    room_name: string
    is_group: boolean
    last_message: null | string
    created_at: string
    updated_at: string
    creator: UserType
  }
  participants: ChatParticipant[]
  messages: MessageListItem[]
}
