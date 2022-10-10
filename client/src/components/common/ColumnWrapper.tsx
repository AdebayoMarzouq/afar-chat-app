import React from 'react'

export const ColumnWrapper:React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > & {extraStyles?: string}> = ({ children, extraStyles, ...props }) => {
  return (
    <section
      className={`${extraStyles ? extraStyles : ''} relative h-screen w-full flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary overflow-x-hidden`}
      {...props}
    >
      {children}
    </section>
  )
}
