import React from 'react'
import { TypeOptions, ToastContentProps } from 'react-toastify'

// title, status, duration, isClosable, position

interface ToastProps extends Partial<ToastContentProps> {
  text: string
}

export const CustomToast = ({
  text,
  closeToast,
  toastProps,
}: ToastProps) => {
  return (
    <div
      className='flex items-center w-full h-full border-red-500'
      role='alert'
    >
      <div className='inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-700 bg-green-100 rounded-lg'>
        <svg
          className='w-6 h-6'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
          <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
        </svg>
        <span className='sr-only'>Check icon</span>
      </div>
      <div className='ml-3 text-sm font-normal'>{text}</div>
      <button
        type='button'
        className='ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8'
        aria-label='Close'
        onClick={closeToast}
      >
        <span className='sr-only'>Close</span>
        <svg
          aria-hidden='true'
          className='w-5 h-5'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          ></path>
        </svg>
      </button>
    </div>
  )
}
