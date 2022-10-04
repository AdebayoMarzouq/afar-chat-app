import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useWindowDimensions } from '../../hooks';
import { RootState } from '../../redux/store';
import { Spinner } from '../miscellaneous/Spinner';
import { CreateGroupbar } from './newgroup/CreateGroupbar';
import { Profilebar } from './profilebar/Profilebar';
import { Searchbar } from './searchbar/Searchbar';
import { ChatListHeader } from './chatlist/ChatListHeader';
import { ChatRoomsList } from './chatlist/ChatRoomsList';
import ColumnWrapper from '../common/ColumnWrapper';

export const LeftColumn = () => {
  const {width} = useWindowDimensions()
  const { createGroupbar, profile: profileBar, searchBar, mainToggle } = useSelector((state: RootState) => state.interaction)
  const {
    chatsLoading,
    chatsError,
  } = useSelector((state: RootState) => state.chat)

  if (chatsError) {
    return <ColumnWrapper extraStyles='md:col-span-2 xl:col-span-3 px-8 py-4'>Something went wrong, try again {JSON.stringify(chatsError)}</ColumnWrapper>
  }

  if (chatsLoading) {
    return <ColumnWrapper extraStyles='md:col-span-2 xl:col-span'>
      //* Skeleton loaders here
      Loading
    </ColumnWrapper>
  }

  return (
    <ColumnWrapper
      extraStyles={
        width < 768
          ? `${!mainToggle ? '' : 'hidden'}`
          : 'md:col-span-2 xl:col-span-3'
      }
    >
      <ChatListHeader />
      {/* {chatsLoading && (
        <div className='text-center py-4'>
          <Spinner className='w-8 h-8' />
        </div>
      )} */}
      <ChatRoomsList key='chat-rooms-list' />
      <AnimatePresence>
        {profileBar && <Profilebar key='profile-bar' />}
        {searchBar && <Searchbar key='search-bar' />}
        {createGroupbar && <CreateGroupbar key='create-modal' />}
      </AnimatePresence>
    </ColumnWrapper>
  )
}
