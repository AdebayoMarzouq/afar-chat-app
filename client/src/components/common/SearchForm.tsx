import React from 'react'

export const SearchForm = ({
  handleSearch,
  setSearch,
  search,
}: {
  handleSearch: () => void
  setSearch: React.Dispatch<React.SetStateAction<string>>
  search: string
}) => {
  return (
    <form
      className='flex items-center py-4 border-b dark:border-dark-separator px-4 shrink-0'
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
    >
      <label htmlFor='search' className='sr-only'>
        Search users
      </label>
      <div className='relative w-full'>
        <input
          type='text'
          id='search'
          className='input-style1'
          placeholder='Search users by username or email'
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <button
        type='submit'
        className='icon-btn-alt ml-2'
        onClick={handleSearch}
      >
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          ></path>
        </svg>
        <span className='sr-only'>Search</span>
      </button>
    </form>
  )
}
