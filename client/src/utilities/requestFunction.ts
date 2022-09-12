import axios from 'axios'

export const axiosRequest = async ({
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
  let loading = true,
    _error,
    data
  try {
    const response = await axios.request({
      data: payload,
      headers: { Authorization: 'Bearer ' + token },
      timeout: 1000,
      method: method || 'get',
      url,
      proxy: {
        protocol: 'http',
        host: '127.0.0.1',
        port: 3001,
      },
    })
    data = response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      _error = error.message
    } else {
      _error = JSON.stringify(error)
      console.log(error)
    }
  } finally {
    loading = false
  }
  return { loading, _error, data }
}
