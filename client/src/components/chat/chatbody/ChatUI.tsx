import { ChatBody } from './ChatBody'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { ChatUIHeader } from './ChatUIHeader'
import { MessageInput } from './MessageInput'
import { AnimatePresence } from 'framer-motion'
import { ChatMenubar } from './ChatMenubar'
import { useWindowDimensions } from '../../../hooks'

export const ChatUI = () => {
  const {width} = useWindowDimensions()
  const {groupMenu, mainToggle} = useSelector((state: RootState) => state.interaction)
  const { selected, chatDataCollection } = useSelector((state: RootState) => state.chat)

  return (
    <div
      className={`${
        !mainToggle && width < 768 && 'hidden'
      } relative col-span-3 xl:col-span-6 h-screen flex flex-col w-full bg-white`}
    >
      <>
        <ChatUIHeader />
        <ChatBody />
        {selected && <MessageInput />}
      </>
      {width < 1280 && (
        <AnimatePresence>
          {selected && groupMenu && <ChatMenubar />}
        </AnimatePresence>
      )}
    </div>
  )
}
