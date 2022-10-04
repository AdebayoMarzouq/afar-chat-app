import { AuthWrapper, Tab } from '../../components/auth'

export const Authentication = () => {
  return (
    <section className='flex flex-col items-center justify-center w-screen max-w-sm min-h-screen col-span-1 py-8 mx-auto'>
      <div className='w-full h-full text-center shadow-md md:h-fit bg-light-bg-primary dark:bg-dark-bg-secondary md:rounded-md'>
        <AuthWrapper className='w-full py-5 rounded-lg'>
          <h2 className='text-2xl font-bold dark:text-dark-text-primary'>
            Chat
          </h2>
        </AuthWrapper>
        <AuthWrapper>
          <Tab />
        </AuthWrapper>
      </div>
    </section>
  )
}
