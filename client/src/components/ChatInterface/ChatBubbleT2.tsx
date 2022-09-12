import React from 'react'

export const ChatBubbleT2 = () => {
  return (
    <div className='bubble alt'>
      <div className='txt'>
        <p className='name alt'>
          +353 87 1234 567<span> ~ John</span>
        </p>
        <p className='message'>
          Nice... this will work great for my new project.
        </p>
        <span className='timestamp'>10:22 pm</span>
      </div>
      <div className='bubble-arrow alt'></div>
    </div>
  )
}
