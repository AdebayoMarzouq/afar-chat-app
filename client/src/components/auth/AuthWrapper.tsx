import React from 'react'

export const AuthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode | React.ReactNode[]
}) => {
  return <div className={`w-full py-5 rouned-xl ${className}`}>{children}</div>
}
