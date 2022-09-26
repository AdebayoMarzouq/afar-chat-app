import { ChatMenuInfo } from './ChatMenuInfo';
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWindowDimensions } from '../../hooks'
import { closeGroupMenu } from '../../redux/interactionSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { AddParticipantsBar } from './AddParticipantsBar'

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
  const dispatch = useDispatch<AppDispatch>()
  const { width } = useWindowDimensions()
  const [addParticipant, setAddParticipant] = useState<boolean>(false)
  const { selected, chatDataLoading,chatDataCollection } = useSelector(
    (state: RootState) => state.chat
  )

  const mdclass = `absolute z-10 inset-0`
  const xlclass = 'xl:static xl:col-span-3 h-screen'

  if (chatDataLoading) return <div>Loading...</div>
  if (!chatDataCollection[selected]) return <div>Select to view info here</div>

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
      <div className='px-2 h-16 shrink-0 flex items-center mt-auto gap-6 text-xl font-semibold border-b'>
        <button
          className='icon-btn'
          onClick={() => {
            if (!addParticipant) {
              dispatch(closeGroupMenu())
            } else {
              setAddParticipant(false)
            }
          }}
        >
          {addParticipant ? (
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          ) : (
            width < 1280 && (
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            )
          )}
        </button>
        {addParticipant ? 'Search Users to Add' : 'Group Info'}
      </div>
      <div className='relative overflow-y-auto flex-grow'>
        <AnimatePresence>
          {addParticipant ? (
            <AddParticipantsBar />
          ) : (
            <ChatMenuInfo setAddParticipant={setAddParticipant} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
