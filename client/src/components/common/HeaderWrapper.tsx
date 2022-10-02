import React from 'react'

export const HeaderWrapper = ({
  children,
}: {
  children?: React.ReactNode | React.ReactNode[]
}) => {
  return (
    <div className='shrink-0 px-4 flex items-center h-16 border-b dark:border-dark-separator bg-inherit dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary gap-4'>
      {children}
    </div>
  )
}
