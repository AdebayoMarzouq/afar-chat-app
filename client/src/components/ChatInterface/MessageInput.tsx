import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSocketContext } from '../../context/SocketContext'
import useAutosizeTextArea from '../../hooks/useAutoSizeTextArea'
import { RootState } from '../../redux/store'

export const MessageInput = ({}) => {
  const { socket } = useSocketContext()
  const selected = useSelector((state: RootState) => state.chat.selected)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(event.target.value)
  useAutosizeTextArea(textAreaRef.current, value)

  const sendMessageConnection = useCallback(() => {
    socket.emit('send_message', {
      user_id: userInfo?.uuid,
      room_id: selected,
      message: value.trim(),
    })
  }, [value, selected])

  const handleSubmit = () => {
    if (!value) {
      //toast here
      return
    }
    sendMessageConnection()
    setValue('')
  }

  useEffect(() => {
    setValue('')
  }, [selected])

  // useEffect(() => {
  //   const handleEvent = (e: KeyboardEvent) => {
  //     if (!e.target) return
  //     if (e.target.key === 'Enter') {
  //       handleSubmit()
  //     }
  //   }
  //   if (!textAreaRef.current) return
  //   textAreaRef.current.addEventListener('keyup', handleEvent)

  //   return () => {
  //     if (!textAreaRef.current) return
  //     textAreaRef.current.removeEventListener('keyup', handleEvent)
  //   }
  // }, [])

  return (
    <form
      className='border-t mt-auto shrink-0'
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <label htmlFor='chat' className='sr-only'>
        Your message
      </label>
      <div className='flex items-end py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700'>
        <button type='button' className='icon-btn'>
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
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <span className='sr-only'>Upload image</span>
        </button>
        <button type='button' className='icon-btn'>
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
              d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span className='sr-only'>Add emoji</span>
        </button>
        <textarea
          id='chat'
          onChange={handleChange}
          ref={textAreaRef}
          rows={1}
          value={value}
          className='resize-none max-h-[100px] mx-4 w-full p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:border-light-main-primary outline-none'
          placeholder='Your message...'
        ></textarea>
        <button
          type='submit'
          className='icon-btn'
          onClick={handleSubmit}
        >
          <svg
            className='w-6 h-6 rotate-90'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
            />
          </svg>
          <span className='sr-only'>Send message</span>
        </button>
      </div>
    </form>
  )
}
