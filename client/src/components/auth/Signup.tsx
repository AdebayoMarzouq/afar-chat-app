import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { Input } from './Input'
import { MyToast } from '../../utilities/toastFunction'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is a required field')
    .min(3, 'Username must be at least 3 characters long'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is a required field'),
  password: yup
    .string()
    .required('Please enter your password')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special case character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .when('password', {
      is: (password: string) =>
        password && password.length > 0 ? true : false,
      then: yup.string().oneOf([yup.ref('password')], "Passwords don't match"),
    }),
})

export const Signup = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  } as { [key: string]: boolean })
  const {
    getFieldProps,
    handleSubmit,
    touched,
    errors,
    isValid,
    dirty,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: typeof initialValues) => {
      const { username, email, password } = values
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }

        const { data } = await axios.post(
          '/api/account/register',
          { username, email, password },
          config
        )
        console.log(data)
        MyToast({ textContent: 'Registration successful' })
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
  const usernameProps = getFieldProps('username')
  const emailProps = getFieldProps('email')
  const passwordProps = getFieldProps('password')
  const confirmPasswordProps = getFieldProps('confirmPassword')

  return (
    <form className='px-4' onSubmit={handleSubmit}>
      <Input
        type='text'
        label='Username'
        isValid={touched.username && !errors.username}
        error={touched.username && errors.username}
        {...usernameProps}
      />
      <Input
        type='email'
        label='Email'
        isValid={touched.email && !errors.email}
        error={touched.email && errors.email}
        {...emailProps}
      />
      <Input
        label='Password'
        type={!show.password ? 'password' : 'text'}
        isValid={touched.password && !errors.password}
        error={touched.password && errors.password}
        show={show}
        setShow={setShow}
        {...passwordProps}
      />
      <Input
        label='Confirm Password'
        type={!show.confirmPassword ? 'password' : 'text'}
        error={touched.confirmPassword && errors.confirmPassword}
        show={show}
        setShow={setShow}
        {...confirmPasswordProps}
      />
      <button
        type='submit'
        disabled={!(isValid && dirty) || isSubmitting}
        className='bg-sky-600 px-4 py-2 rounded-md text-white cursor-pointer disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
      >
        {!isSubmitting ? 'Submit' : 'Loading...'}
      </button>
    </form>
  )
}

