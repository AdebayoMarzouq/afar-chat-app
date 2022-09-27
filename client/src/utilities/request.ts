import axios from 'axios'
import { store } from '../redux/store'

export const request = async ({
  url,
  method,
  payload,
}: {
  url: string
  method?: string
  payload?: {}
}) =>
  await axios.request({
    data: payload,
    headers: { Authorization: 'Bearer ' + store.getState().user.userToken },
    method: method || 'get',
    url,
    proxy: {
      protocol: 'http',
      host: '127.0.0.1',
      port: 3001,
    },
  })
