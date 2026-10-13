import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5001/api' })

// Send the token with every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If the token is no longer valid, clear the login and go to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const onLogin = window.location.pathname === '/login'
    if (err.response?.status === 401 && !onLogin) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
