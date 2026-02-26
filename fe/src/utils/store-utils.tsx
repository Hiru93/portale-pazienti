import { type DecodedToken } from "@/app/types"
import { jwtDecode } from "jwt-decode"

export const loadLocalInfo = (localKey: string) => {
    return localStorage.getItem(localKey)
}

export const tokenParse = (token: string): DecodedToken => {
    try {
        return jwtDecode<DecodedToken>(token)
    } catch (error) {
        console.error("Error decoding token: ", error)
        return { exp: 0, iat: 0, user_auth: [], user_email: "", user_id: 0, user_data: { first_name: "", last_name: "" } }
    }
}