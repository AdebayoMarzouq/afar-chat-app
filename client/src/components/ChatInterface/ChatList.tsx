import { AnimatePresence, Reorder } from 'framer-motion'

import { useDispatch, useSelector } from 'react-redux'
import { useSocketContext } from '../../context/SocketContext'
import { fetchRoomData, setSelected } from '../../redux/chatSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { mySort } from '../../utilities/sort'
import { ModalInfo } from '../ModalInfo'
import { ChatListHeader } from './ChatListHeader'
import { ChatListItem } from './ChatListItem'
import { Profilebar } from './Profilebar'
import { Searchbar } from './Searchbar'

export const ChatList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const { modalInfo, profile: profileBar, searchBar } = useSelector((state: RootState) => state.interaction)
  const {
    selected,
    chatDataCollection,
    chats,
    chatsLoading,
    chatsError,
  } = useSelector((state: RootState) => state.chat)
  const { userInfo } = useSelector((state: RootState) => state.user)

  //
  //
  // Fix chat return to take care of participant name in the list
  //
  //

  const openSelected = (uuid: string) => {
    if (uuid !== selected) {
      dispatch(setSelected(uuid))
    }
    if (!chatDataCollection[uuid]) {
      dispatch(fetchRoomData())
    }
  }

  const sorted_chats = [...chats].sort(function (b, a) {
    if (a.updated_at < b.updated_at) return -1
    else if (a.updated_at > b.updated_at) return 1
    return 0
  })

  return (
    <div className='col-span-2 xl:col-span-3 relative h-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary'>
      <ChatListHeader />
      <AnimatePresence>
        <div className='pb-4 overflow-y-auto flex-grow'>
          {chatsLoading && <div className='text-center'>Loading...</div>}
          {chatsError && (
            <div>
              Something went wrong, try again {JSON.stringify(chatsError)}
            </div>
          )}
          {chats && chats.length ? (
            sorted_chats.map((chatItem) => {
              // const info = chatItem.rooms
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
              You don not have any chats, create a group or search for some
              friends
            </div>
          )}
        </div>
      </AnimatePresence>
      <AnimatePresence>{profileBar && <Profilebar />}</AnimatePresence>
      <AnimatePresence>{searchBar && <Searchbar />}</AnimatePresence>
      <AnimatePresence>{modalInfo && <ModalInfo />}</AnimatePresence>
    </div>
  )
}
