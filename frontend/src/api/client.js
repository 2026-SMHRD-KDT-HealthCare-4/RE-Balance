import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:3000',
})

// 요청마다 JWT 토큰 자동 첨부
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default client