import { AuthWrapper, Tab } from '../../components/auth'

export const Authentication = () => {
  return (
    <section className='max-w-sm mx-auto min-h-screen flex flex-col items-center justify-center py-8'>
      <div className='w-full h-full md:h-fit bg-light-bg-primary dark:bg-dark-bg-secondary md:rounded-md shadow-md text-center'>
        <AuthWrapper className='py-5 rounded-lg w-full'>
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
