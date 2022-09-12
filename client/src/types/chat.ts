export type RoomType = {
  id: string
  room_name: string
  is_group: boolean
  last_message: null
}

export type ChatInfoType = {
  Room: RoomType
}

export type ChatListType = {
  count: number
  rooms: ChatInfoType[]
}

