import React from 'react'

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, ...props }) => {
  return <button {...props} className='py-2 px-4 bg-blue-400 text-white rounded-md hover:bg-blue-500'>{children}</button>
}

export default Button
