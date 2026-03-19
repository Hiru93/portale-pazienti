import type { AppStore } from "@/app/store"
import { tokenParse, loadLocalInfo } from "./store-utils"
import { refreshUser, logoutUser, selectAccessToken } from "@/features/login/LoginSlice"
import apiClient from "./apiClient"
import type { AxiosError } from "axios"

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

type QueueEntry = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

export const setupInterceptors = (store: AppStore) => {
  // Attach access token to every request
  apiClient.interceptors.request.use(config => {
    const token = selectAccessToken(store.getState())
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  // Handle 401 → try refresh → retry
  let isRefreshing = false
  let queue: QueueEntry[] = []

  const processQueue = (token: string) => {
    queue.forEach(({ resolve }) => { resolve(token) })
    queue = []
  }

  const rejectQueue = (error: unknown) => {
    queue.forEach(({ reject }) => { reject(error) })
    queue = []
  }

  apiClient.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const originalRequest = error.config
      if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      const token = selectAccessToken(store.getState())
      const userId = token
        ? String(tokenParse(token).user_id)
        : loadLocalInfo("userId")

      if (!userId) return Promise.reject(error)

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: newToken => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              resolve(apiClient(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      try {
        const result = await store.dispatch(refreshUser(userId))
        if (refreshUser.fulfilled.match(result) && result.payload.data?.access_token) {
          const newToken = result.payload.data.access_token
          processQueue(newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return await apiClient(originalRequest)
        } else {
          rejectQueue(error)
          await store.dispatch(logoutUser({ token: token ?? "" }))
          return await Promise.reject(error)
        }
      } catch (err) {
        rejectQueue(err)
        return await Promise.reject(err instanceof Error ? err : new Error(String(err)))
      } finally {
        isRefreshing = false
      }
    }
  )
}
