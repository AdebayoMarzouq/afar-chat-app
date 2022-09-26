import { AnimatePresence, Reorder } from 'framer-motion';
import { ChatRoomsList } from './ChatRoomsList';

import { useDispatch, useSelector } from 'react-redux';
import { useSocketContext } from '../../context/SocketContext';
import { fetchRoomData, setSelected } from '../../redux/chatSlice';
import { closeGroupMenu } from '../../redux/interactionSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { mySort } from '../../utilities/sort';
import { Spinner } from '../miscellaneous/Spinner';
import { ModalInfo } from '../ModalInfo';
import { ChatListHeader } from './ChatListHeader';
import { ChatListItem } from './ChatListItem';
import { Profilebar } from './Profilebar';
import { Searchbar } from './Searchbar';

export const ChatList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocketContext()
  const { modalInfo, profile: profileBar, searchBar } = useSelector((state: RootState) => state.interaction)
  const {
    selected,
    chatDataCollection,
    chatsLoading,
    chatsError,
  } = useSelector((state: RootState) => state.chat)

  //
  //
  // Fix chat return to take care of participant name in the list
  //
  //

  const openSelected = (uuid: string) => {
    if (uuid !== selected) {
      dispatch(closeGroupMenu())
      dispatch(setSelected(uuid))
    }
    if (!chatDataCollection[uuid]) {
      dispatch(fetchRoomData())
    }
  }

  return (
    <div className='col-span-2 xl:col-span-3 relative h-screen flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary overflow-x-hidden'>
      <ChatListHeader />
      {chatsLoading && (
        <div className='text-center py-4'>
          <Spinner className='w-8 h-8' />
        </div>
      )}
      {chatsError && (
        <div>Something went wrong, try again {JSON.stringify(chatsError)}</div>
      )}
      <AnimatePresence>
        <ChatRoomsList key='chat-rooms-list' openSelected={openSelected} />
        {profileBar && <Profilebar key='profile-bar' />}
        {searchBar && <Searchbar key='search-bar' />}
        {modalInfo && <ModalInfo key='create-modal' />}
      </AnimatePresence>
    </div>
  )
}
