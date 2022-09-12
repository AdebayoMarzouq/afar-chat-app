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
  token?: string
  payload?: {}
}) => {
  const [data, setData] = useState<T[] | T | null>(null)
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
        setData(response.data)
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
  }, [])

  return { cancel, data, error, loading }
}
