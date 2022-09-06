import React, { useState } from 'react'
import { Login, Signup } from '../components'
import { MyToast } from '../utilities/toastFunction'

export const Home = () => {
  return (
    <section className='max-w-sm mx-auto h-screen flex flex-col items-center justify-center'>
      <div className='w-full h-full md:h-fit bg-white md:rounded-md shadow-md text-center'>
        <AuthWrapper className='py-5 rounded-lg w-full'>
          <h2 className='text-2xl font-bold'>Chat</h2>
          <button
            onClick={() => MyToast({ textContent:'🦄 Testing the toast!!!'})}
          >
            toast
          </button>
        </AuthWrapper>
        <AuthWrapper>
          <Tab />
        </AuthWrapper>
      </div>
    </section>
  )
}

const AuthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode | React.ReactNode[]
}) => {
  return <div className={`w-full py-5 rouned-xl ${className}`}>{children}</div>
}

const Tab = ({
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
