// axiosInstance.ts
import axios from "axios"

const isDevelopment = process.env.MODE === 'development'
const myBaseUrl = isDevelopment ? process.env.VITE_API_BASE_URL_LOCAL : process.env.VITE_API_BASE_URL_DEPLOY

const api = axios.create({
  baseURL: myBaseUrl,
})

// Request interceptor → add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor → refresh token if 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem("refresh_token")
        const res = await axios.post(`${myBaseUrl}api/auth/token/refresh/`, { refresh })
        localStorage.setItem("access_token", res.data.access)
        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.clear()
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api
