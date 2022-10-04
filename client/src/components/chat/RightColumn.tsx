import { AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import ColumnWrapper from "../common/ColumnWrapper"
import { useWindowDimensions } from "../../hooks"
import { RootState } from "../../redux/store"
import { ChatBody } from "./chatbody/ChatBody"
import { ChatUIHeader } from "./chatbody/ChatUIHeader"
import { MessageInput } from "./chatbody/MessageInput"
import { InfoColumn } from "./InfoColumn"


export const RightColumn = () => {
  const {width} = useWindowDimensions()
  const {groupMenu, mainToggle} = useSelector((state: RootState) => state.interaction)
  const { selected } = useSelector((state: RootState) => state.chat)

  if (width < 768 || width > 1280) {
    return (
      <ColumnWrapper
        extraStyles={
          width < 768
            ? `${mainToggle ? '' : 'hidden'}`
            : 'xl:col-span-6'
        }
      >
        <ChatUIHeader />
        <ChatBody />
        {selected && <MessageInput />}
      </ColumnWrapper>
    )
  }

  return (
    <ColumnWrapper extraStyles='md:col-span-3'>
      <>
        <ChatUIHeader />
        <ChatBody />
        {selected && <MessageInput />}
        <AnimatePresence>
          {selected && groupMenu && <InfoColumn />}
        </AnimatePresence>
      </>
    </ColumnWrapper>
  )
}
