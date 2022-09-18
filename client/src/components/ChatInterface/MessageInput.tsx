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
        <button
          type='button'
          className='inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
        >
          <svg
            aria-hidden='true'
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
              clipRule='evenodd'
            ></path>
          </svg>
          <span className='sr-only'>Upload image</span>
        </button>
        <button
          type='button'
          className='p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
        >
          <svg
            aria-hidden='true'
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z'
              clipRule='evenodd'
            ></path>
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
          className='inline-flex justify-end p-2 text-light-main-primary rounded-full cursor-pointer hover:bg-light-main-secondary'
          onClick={handleSubmit}
        >
          <svg
            aria-hidden='true'
            className='w-6 h-6 rotate-90'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
          </svg>
          <span className='sr-only'>Send message</span>
        </button>
      </div>
    </form>
  )
}
