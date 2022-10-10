import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../../context/SocketContext';
import { useWindowDimensions } from '../../hooks';
import { RootState } from '../../redux/store';
import { ColumnWrapper } from '../common/ColumnWrapper';
import { Spinner } from '../miscellaneous/Spinner';
import { ChatListHeader } from './chatlist/ChatListHeader';
import { ChatRoomsList } from './chatlist/ChatRoomsList';
import { CreateGroupbar } from './newgroup/CreateGroupbar';
import { Profilebar } from './profilebar/Profilebar';
import { Searchbar } from './searchbar/Searchbar';

export const LeftColumn = () => {
  const {width} = useWindowDimensions()
  const { createGroupbar, profile: profileBar, searchBar, mainToggle } = useSelector((state: RootState) => state.interaction)
  const {
    chatsLoading,
    chatsError,
  } = useSelector((state: RootState) => state.chat)
  // * Skeleton loaders here */

  return (
    <ColumnWrapper
      extraStyles={
        width < 768
          ? `${!mainToggle ? '' : 'hidden'}`
          : 'md:col-span-2 xl:col-span-3'
      }
    >
      <ChatListHeader />
      {true && <LeftColumnAlert />}
      {chatsError ? (
        <>Something went wrong, try again {JSON.stringify(chatsError)}</>
      ) : chatsLoading ? (
        <div className='text-center py-4'>
          <Spinner className='w-8 h-8' />
        </div>
      ) : (
        <ChatRoomsList key='chat-rooms-list' />
      )}
      <AnimatePresence>
        {profileBar && <Profilebar key='profile-bar' />}
        {searchBar && <Searchbar key='search-bar' />}
        {createGroupbar && <CreateGroupbar key='create-modal' />}
      </AnimatePresence>
    </ColumnWrapper>
  )
}

const LeftColumnAlert = () => {
  const { userStatus } = useSelector((state: RootState) => state.user)
  const { socket } = useSocketContext()
  
  const connect = () => {
    if (!socket.connected) {
      socket.connect()
    }
  }

  const disconnect = () => {
    if (socket.connected) {
      socket.disconnect()
    }
  }
      
      return (
        <div className='flex justify-start items-center gap-4 px-4 shrink-0 h-20 bg-yellow-600'>
          <p className='select-none'>{userStatus}</p>
          <button className='icon-btn' onClick={connect}>
            retry
          </button>
          <button className='icon-btn' onClick={disconnect}>
            disconnect
          </button>
          {userStatus === 'reconnecting' && 'Loading...'}
          <div className='text-center py-4 ml-auto'>
            <Spinner className='w-8 h-8 dark:fill-yellow-400' />
          </div>
        </div>
      )
    }
  