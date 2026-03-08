import axios from "axios";
import { baseUrl } from "@/utils/constants";

export const apiClient = axios.create({
    baseURL: baseUrl,
    // Needed to include cookies for authentication in cross-origin-requests
    withCredentials: true
})

export default apiClient;