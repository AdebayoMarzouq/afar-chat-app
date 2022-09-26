import React from 'react'

export const Avatar = ({
  size,
  src,
  alt,
}: {
  size?: number
  src?: string
  alt?: string
  }) => {
  const width = `w-${size}`
  const sizeHClass = size ? `${size * 4}px` : `${12 * 4}px`
  const sizeWClass = size ? `${size * 4}px` : `${12 * 4}px`

  return (
    <div className={`flex justify-center ${width}`}>
      <img
        className='object-cover shrink-0 rounded-full shadow-inner'
        style={{
          height: sizeHClass,
          width: sizeWClass,
        }}
        src={
          src ||
          'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        }
        alt={alt || 'Rounded Avatar'}
      />
    </div>
  )
}
