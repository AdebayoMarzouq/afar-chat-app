import React from 'react'

export const ChatBubbleReply = ({isSender}:{isSender: boolean}) => {
  return (
    <div
      className={`${
        isSender
          ? 'alt bg-light-bubbleOne-replied dark:bg-dark-bubbleOne-replied'
          : 'bg-light-bubbleTwo-replied dark:bg-dark-bubbleTwo-replied'
      } p-1 border-l-4 border-rose-400 h-fit w-full max-h-[77px] overflow-hidden rounded-md text-sm mb-2`}
    >
      <div className='text-rose-400 text-xs font-semibold mb-0.5 capitalize'>
        Testuser1
      </div>
      <p
        className={`tracking-tight leading-tight break-words ${
          isSender ? 'text-gray-300' : 'text-gray-400'
        }`}
      >
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo sint
        optio quo magnam aliquam consectetur repellat vel
        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz placeat
        consequatur esse animi, mollitia rerum quibusdam. Libero laudantium
        facilis earum, corrupti repellat at odio ab esse expedita nulla ullam.
        Est, maxime molestiae?
      </p>
    </div>
  )
}
