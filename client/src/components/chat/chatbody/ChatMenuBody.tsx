import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "../../../hooks";
import { closeGroupMenu } from "../../../redux/interactionSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { AddParticipantsBar } from "./AddParticipantsBar";
import { ChatMenuInfo } from "./ChatMenuInfo";

export const ChatMenuBody = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { width } = useWindowDimensions()
  const [addParticipant, setAddParticipant] = useState<boolean>(false)

  const closeBar = () => {
    setAddParticipant(false)
  }

  return (
    <>
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
            <AddParticipantsBar close={closeBar} />
          ) : (
            <ChatMenuInfo setAddParticipant={setAddParticipant} />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
  
  