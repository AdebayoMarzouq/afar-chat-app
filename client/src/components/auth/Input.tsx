import React from 'react'

export const Input = ({
  name,
  label,
  error,
  isValid,
  show,
  setShow,
  disableShow,
  ...props
}: {
  name: string
  label: string
  isValid?: boolean
  error?: string | boolean
  show?: { [key: string]: boolean }
  setShow?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
    >
  disableShow?: boolean
} & React.HTMLProps<HTMLInputElement>) => {
  const valid =
    'border-green-500 dark:border-green-400 text-green-900 dark:text-green-400 placeholder-green-700 rounded-lg focus:ring-green-400 focus:border-green-500 dark:caret-green-400'
  const invalid =
    'border border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 rounded-lg focus:ring-red-500 focus:border-red-500 dark:caret-dark-text-primary dark:caret-red-400'
  return (
    <div className='relative mb-6 text-left'>
      <label
        htmlFor={name}
        className='block mb-2 ml-2 text-sm font-medium text-gray-700 dark:text-dark-text-secondary
        '
      >
        {label}
      </label>
      <div className='relative'>
        <input
          id={name}
          className={`border outline-none text-sm w-full p-2.5 block ${
            error ? invalid : 'dark:border-dark-text-secondary dark:caret-dark-text-primary'
          } ${isValid ? valid : ''} bg-gray-50 dark:bg-dark-fillOne rounded-md`}
          {...props}
        />
        {setShow && (
          <button
            className={`${
              disableShow && 'hidden'
            } absolute inset-y-1 right-4 text-gray-500 outline-none border-none ring-none`}
            disabled={disableShow}
            onClick={(e) => {
              e.preventDefault()
              if (!setShow) return
              setShow((prev) => {
                const check = { ...prev, [name]: !prev[name] }
                return check
              })
            }}
          >
            {show && show[name] ? (
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                  clipRule='evenodd'
                />
                <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
              </svg>
            ) : (
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                <path
                  fillRule='evenodd'
                  d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p
          className={`${
            !error && 'hidden'
          } mt-2 text-xs tracking-tight leading-none text-red-600 dark:text-red-400`}
        >
          {error}
        </p>
      )}
    </div>
  )
}
