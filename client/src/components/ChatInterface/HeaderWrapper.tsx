import React from 'react'

export const HeaderWrapper = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[]
}) => {
  return (
    <div className='shrink-0 px-4 flex items-center h-16 border-b bg-light-bg'>
      {children}
    </div>
  )
}
