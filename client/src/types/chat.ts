export type RoomType = {
  uuid: string
  room_name: string
  is_group: boolean
  last_message: null
}

export type ChatListType = {
  count: number
  rooms: RoomType[]
}

