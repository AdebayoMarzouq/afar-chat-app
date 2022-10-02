import React from 'react'

const Header: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {extraStyles: string}
> = ({ children}) => {
  return (
    <div className={`shrink-0 px-4 flex items-center h-16 border-b dark:border-dark-separator bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary gap-4`}>
      {children}
    </div>
  )
}

export default Header