import axios from "axios"

const BASE_URL = "https://gym-api-d2a5.onrender.com"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,

})

export const privateAxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },

})
export default axiosInstance

