import React, { useState } from 'react'
import { Login } from './Login'
import { Signup } from './Signup'

export const Tab = ({
  className,
  children,
  ...props
}: {
  className?: string
  children?: React.ReactNode | React.ReactNode[]
}) => {
  const [currentTab, setCurrentTab] = useState('login')

  const activeTab = 'border-sky-600'
  const inActiveTab = 'text-gray-400 border-transparent hover:border-gray-400'

  return (
    <>
      <div className='mb-4 border-b border-gray-200'>
        <ul
          className='flex -mb-px text-sm font-medium text-center'
          id='Tab'
          role='tablist'
        >
          {['login', 'signup'].map((item) => (
            <li key={item} className='mr-2 w-1/2' role='presentation'>
              <button
                className={`${
                  currentTab === item ? activeTab : inActiveTab
                } inline-block p-4 rounded-t-lg border-b-2`}
                id={item + '-tab'}
                type='button'
                role='tab'
                aria-controls={item}
                aria-selected='false'
                onClick={() => setCurrentTab(item)}
              >
                {item.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id='TabContent'>
        {[
          { name: 'login', tab: <Login /> },
          { name: 'signup', tab: <Signup /> },
        ].map(({ name, tab }) => (
          <div
            className={`${currentTab === name ? '' : 'hidden'} p-4 rounded-lg`}
            key={name}
            role='tabpanel'
            aria-labelledby={name + '-tab'}
          >
            {tab}
          </div>
        ))}
      </div>
    </>
  )
}
