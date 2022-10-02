import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useWindowDimensions } from '../../../hooks'
import { RootState } from '../../../redux/store'
import { Spinner } from '../../miscellaneous/Spinner'
import {ChatMenuBody} from './ChatMenuBody'

const variants = {
  initial: { scale: 0, originY: 0, originX: '100%' },
  enter: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: 'spring',
      bounce: 0.3,
    },
  },
  exit: {
    scale: 0,
    originY: 0,
    originX: '100%',
    transition: {
      type: 'spring',
      bounce: 0.3,
    },
  },
}

export const ChatMenubar = () => {
  const { width } = useWindowDimensions()
  const { selected, chatDataLoading, chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )

  const mdclass = `absolute z-10 inset-0`
  const xlclass = 'xl:static xl:col-span-3 h-screen'

  return (
    <motion.div
      className={`${
        width < 1280 ? mdclass : xlclass
      } bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary flex flex-col pb-4 overflow-hidden`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={variants}
      layout
    >
      {selected ? (
        <>
          {chatDataLoading ? (
            <div className='text-center pb-4 pt-20'>
              <Spinner className='w-8 h-8' />
            </div>
          ) : (
            <ChatMenuBody />
          )}
        </>
      ) : (
        <div className='hidden xl:block xl:static xl:col-span-3 h-screen text-center'>
          <p className='mt-20 p-4 dark:text-dark-text-secondary'>
            No info to display, select a chat to display its info here
          </p>
        </div>
      )}
    </motion.div>
  )
}
