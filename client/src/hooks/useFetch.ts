import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

export const useFetch = <T>({
  url,
  method,
  payload,
  timeout,
}: {
  url?: string
  method?: string
  payload?: {}
  timeout?: number
  }) => {
  const userToken = useSelector((state: RootState) => state.user.userToken)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const controllerRef = useRef(new AbortController())
  const cancel = () => {
    controllerRef.current.abort()
  }

  const fetch = async (fetchUrl?: string, fetchPayload?: {}) => {
    setLoading(true)
    try {
      const response = await axios.request({
        data: fetchPayload || payload,
        headers: { Authorization: 'Bearer ' + userToken },
        signal: controllerRef.current.signal,
        timeout: timeout || 1000,
        method: method || 'get',
        url: fetchUrl || url,
        proxy: {
          protocol: 'http',
          host: '127.0.0.1',
          port: 3001,
        },
      })
      if (response.status === 200 || response.status === 201) {
        setData(response.data)
      } else {
        setError('An error occurred: ' + response.status)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message)
      } else {
        console.log(error)
        setError(JSON.stringify(error))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!url) return
    fetch()

    return (() => cancel())
  }, [url])

  return { cancel, fetch, data, error, loading }
}
