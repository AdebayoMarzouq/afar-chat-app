import React, { memo, useState } from 'react'
import { Avatar } from './Avatar'
import type { RootState } from '../../redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { closeProfile } from '../../redux/interactionSlice'
import { motion } from 'framer-motion'
import { HeaderTypeone } from '../common/HeaderTypeone'

const variants = {
  initial: { opacity: 0, x: '-100%' },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: 'backInOut',
      duration: 0.6,
    },
  },
  exit: {
    x: '-100%',
    transition: {
      type: 'spring',
      duration: 0.5,
      bounce: 0,
    },
  },
}

export const Profilebar = () => {
  const { userInfo } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [edit, setEdit] = useState(false)
  const [usernameInput, setUsernameInput] = useState(userInfo!.username)

  const close = () => {
    dispatch(closeProfile())
  }

  return (
    <motion.div
      className={`absolute bg-white inset-0`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={variants}
      layout
    >
      <HeaderTypeone title='Profile' fn={close} />
      {userInfo ? (
        <>
          <div className='relative py-8 flex justify-center items-center w-full'>
            <Avatar size={48} src={userInfo.profile_image} />
            <label
              htmlFor='profile_upload'
              className='absolute inset flex flex-col justify-center items-center w-48 h-48 rounded-full bg-gray-50 hover:opacity-50 opacity-0 border-2 border-gray-300 border-dashed cursor-pointer text-gray-500'
            >
              <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                <svg
                  className='w-12 h-12'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                <p className='text-xs text-gray-900 max-w-1/3 overflow-wrap'>
                  Change Profile Photo
                </p>
              </div>
              <input
                id='profile_upload'
                name='profile_image'
                type='file'
                className='hidden'
              />
            </label>
          </div>
          <form className='px-4 mt-4'>
            <div className='relative z-0 mb-6 w-full'>
              <label htmlFor='username' className='text-xs'>
                username
              </label>
              <input
                type='text'
                name='username'
                id='username'
                value={usernameInput}
                readOnly={!edit}
                placeholder='username is here'
                className={`block pt-2.5 pb-0.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 ${
                  !edit ? 'border-b' : 'border-b-2'
                } border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-400`}
                required
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <button
                type='button'
                className='absolute right-0 top-1/2'
                onClick={() => setEdit((x) => !x)}
              >
                edit
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className='text-center'>Loading</div>
      )}
    </motion.div>
  )
}

// export const Profilebar = memo(ProfileBar)

// <Input
//   id='image'
//   name='image'
//   label='Upload Profile Picture'
//   type='File'
//   accept='image/*'
//   onChange={(event) => {
//     if (!event.currentTarget.files) return
//     setFieldValue('image', event.currentTarget.files[0])
//   }}
// />
// console.log(
//         JSON.stringify(
//           {
//             fileName: values.image.name,
//             type: values.image.type,
//             size: `${values.image.size} bytes`,
//           },
//           null,
//           2
//         )
//       )
//     },
{
  /* <Thumbnail file={values.image} /> */
}
// const Thumbnail = ({ file }: { file: File | null }) => {
//   const [state, setState] = useState({
//     loading: false,
//     thumbnail: null,
//   } as {
//     loading: boolean
//     thumbnail: string | ArrayBuffer | null
//   })

//   useEffect(() => {
//     if (!file) return
//     process()
//   }, [file])

//   console.log(file)

//   if (!file) return null

//   const process = () => {
//     if (!file) return
//     setState({ loading: false, thumbnail: null })
//     let reader = new FileReader()

//     reader.onloadend = () => {
//       setState({ loading: false, thumbnail: reader.result })
//     }

//     reader.readAsDataURL(file)
//   }

//   return <img src={state.thumbnail} alt={file!.name} height='50' width='50' />
// }
