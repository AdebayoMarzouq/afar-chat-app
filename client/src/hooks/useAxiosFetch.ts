import axios from 'axios'
import { useState, useRef, useEffect } from 'react'

export const useAxios = <T>({
  url,
  method,
  token,
  payload,
}: {
  url: string
  method?: string
  token?: string | null
  payload?: {}
}) => {
  const [data, setData] = useState<T | T[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const controllerRef = useRef(new AbortController())
  const cancel = () => {
    controllerRef.current.abort()
  }

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      try {
        const response = await axios.request({
          data: payload,
          headers: { Authorization: 'Bearer ' + token },
          signal: controllerRef.current.signal,
          timeout: 1000,
          method: method || 'get',
          url,
          proxy: {
            protocol: 'http',
            host: '127.0.0.1',
            port: 3001,
          },
        })
        console.log(response.data || null)
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
    })()
  }, [url])

  return { cancel, data, error, loading }
}
