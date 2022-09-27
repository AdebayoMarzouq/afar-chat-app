import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Spinner } from '../../miscellaneous/Spinner';
import { CreateGroupModal } from '../modal/CreateGroupModal';
import { Profilebar } from '../profilebar/Profilebar';
import { Searchbar } from '../searchbar/Searchbar';
import { ChatListHeader } from './ChatListHeader';
import { ChatRoomsList } from './ChatRoomsList';

export const ChatList = () => {
  const { modalInfo, profile: profileBar, searchBar } = useSelector((state: RootState) => state.interaction)
  const {
    chatsLoading,
    chatsError,
  } = useSelector((state: RootState) => state.chat)

  // *Fix chat return to take care of participant name in the list

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
        <ChatRoomsList key='chat-rooms-list' />
        {profileBar && <Profilebar key='profile-bar' />}
        {searchBar && <Searchbar key='search-bar' />}
        {modalInfo && <CreateGroupModal key='create-modal' />}
      </AnimatePresence>
    </div>
  )
}
