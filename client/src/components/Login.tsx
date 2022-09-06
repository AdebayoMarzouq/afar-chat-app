import { useFormik } from 'formik'
import { useState } from 'react'
import * as yup from 'yup'
import { Input } from './Input'
import { MyToast } from '../utilities/toastFunction'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

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
  const [autoFilled, setAutoFilled] = useState(false)
  const [show, setShow] = useState({ password: false } as {
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

        const { data } = await axios.post(
          '/api/account/login',
          { email: login_email, password: login_password },
          config
        )
        console.log(data)
        MyToast({ textContent: 'Login successful' })
        localStorage.setItem('user', JSON.stringify(data))
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
      }
    },
  })

  //use formik.getFieldProps for input fields
  const emailProps = getFieldProps('login_email')
  const passwordProps = getFieldProps('login_password')

  const guestUser = async() => {
    await setFieldValue('login_email', 'testuser@test.test')
    await setFieldValue('login_password', 'supersecret')
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
        type={!show.password ? 'password' : 'text'}
        isValid={touched.login_password && !errors.login_password}
        error={touched.login_password && errors.login_password}
        show={show}
        setShow={setShow}
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
        onClick={() => {
          // e.preventDefault()
          guestUser()
        }}
      >
        Login as a guest user
      </button>
    </form>
  )
}
