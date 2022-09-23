import axios from 'axios'

export const axiosRequest = async ({
  url,
  method,
  token,
  payload,
}: {
  url: string
  method?: string
  token?: string | null
  payload?: {}
}) =>
  await axios.request({
    data: payload,
    headers: { Authorization: 'Bearer ' + token },
    method: method || 'get',
    url,
    proxy: {
      protocol: 'http',
      host: '127.0.0.1',
      port: 3001,
    },
  })
