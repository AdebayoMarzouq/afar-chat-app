import axios from 'axios'
import { useState, useRef, useEffect } from 'react'

export const useFetch = <T>({
  url,
  method,
  token,
  payload,
  timeout,
}: {
  url?: string
  method?: string
  token?: string | null
  payload?: {}
  timeout?: number
}) => {
  const [data, setData] = useState<T | T[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const controllerRef = useRef(new AbortController())
  const cancel = () => {
    controllerRef.current.abort()
  }

  const fetch = async (fetchUrl?: string) => {
    setLoading(true)
    try {
      const response = await axios.request({
        data: payload,
        headers: { Authorization: 'Bearer ' + token },
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
      if (response.status === 200) {
        setData(response.data)
      } else {
        setData(null)
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
  }, [url])

  return { cancel, fetch, data, error, loading }
}
