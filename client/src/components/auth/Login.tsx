import axios from 'axios'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { AppDispatch } from '../../redux/store'
import { addUserInfo, addUserToken } from '../../redux/userSlice'
import { MyToast } from '../../utilities/toastFunction'
import { Input } from './Input'

const initialValues = {
  login_email: '',
  login_password: '',
}

const validationSchema = yup.object().shape({
  login_email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is a required field'),
  login_password: yup.string().required('Please enter your password'),
})

export const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [show, setShow] = useState({ login_password: false } as {
    [key: string]: boolean
  })
  const {
    isSubmitting,
    getFieldProps,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    touched,
    errors,
    isValid,
    dirty,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: typeof initialValues) => {
      const { login_email, login_password } = values
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }

        const {
          data: { token, user },
        } = await axios.post(
          '/api/account/login',
          { email: login_email, password: login_password },
          config
        )
        dispatch(addUserToken(token))
        dispatch(addUserInfo(user))
        MyToast({ textContent: 'Login successful' })
        navigate('/chat')
      } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
          MyToast({
            textContent: error.message || 'An error occurred',
          })
        } else {
          console.log(error)
        }
        dispatch(addUserToken(null))
        dispatch(addUserInfo(null))
      }
    },
  })

  //use formik.getFieldProps for input fields
  const emailProps = getFieldProps('login_email')
  const passwordProps = getFieldProps('login_password')

  const guestUser = async () => {
    await setFieldValue('login_email', import.meta.env.VITE_GUEST_USER_EMAIL)
    await setFieldValue(
      'login_password',
      import.meta.env.VITE_GUEST_USER_PASSWORD
    )
    await setFieldTouched('login_email', true, false)
    await setFieldTouched('login_password', true, false)
  }

  return (
    <form className='px-4' onSubmit={handleSubmit}>
      <Input
        type='email'
        label='Email'
        isValid={touched.login_email && !errors.login_email}
        error={touched.login_email && errors.login_email}
        {...emailProps}
      />
      <Input
        label='Password'
        type={
          !show.login_password ||
          emailProps.value === import.meta.env.VITE_GUEST_USER_EMAIL
            ? 'password'
            : 'text'
        }
        isValid={touched.login_password && !errors.login_password}
        error={touched.login_password && errors.login_password}
        show={show}
        setShow={setShow}
        disableShow={emailProps.value === import.meta.env.VITE_GUEST_USER_EMAIL}
        {...passwordProps}
      />
      <button
        type='submit'
        disabled={!(isValid && dirty) || isSubmitting}
        className='block mx-auto mb-4 bg-sky-600 px-4 py-2 rounded-md text-white cursor-pointer disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
      >
        {!isSubmitting ? 'Submit' : 'Loading...'}
      </button>
      <button
        type='button'
        className='block mx-auto bg-sky-600 px-4 py-2 rounded-md text-white cursor-pointer'
        onClick={(e) => {
          guestUser()
        }}
      >
        Login as a guest user
      </button>
    </form>
  )
}
