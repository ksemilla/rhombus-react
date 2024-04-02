import axios from "axios"

const ROYALTIES_API_ROOT =
  import.meta.env.VITE_ROYALTIES_API_ROOT ?? "http://localhost:8000"

export const api = axios.create({
  baseURL: ROYALTIES_API_ROOT,
})

// api.interceptors.request.use(
//   (config) => {
//     if (!!config.data && !config.data.accessToken)
//       config.data = convertObjectKeysToSnakeCase(config.data)
//     if (!!config.headers) {
//       config.headers = {
//         ...config.headers,
//         Authorization: getAuthorization(),
//       } as AxiosRequestHeaders
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// api.interceptors.response.use(
//   (response) => {
//     if (!!response.data) {
//       response.data = convertKeysToCamelCase(response.data)
//     }
//     return response
//   },
//   (error) => Promise.reject(error)
// )

// api.defaults.headers
