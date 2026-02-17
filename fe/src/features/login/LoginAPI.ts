import { baseUrl } from "@/utils/constants"

// #region [Type Imports]
import type { BaseResponse } from "@/app/types/CommonTypes"
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "@/app/types";
// #endregion [Type Imports]

// #region [Library Imports]
import axios from "axios"
// #endregion [Library Imports]

const urlContextLogin = 'auth'
const urlContextUsers = 'users'

export const doLogin = async (params: LoginRequest): Promise<BaseResponse<LoginResponse>> =>
  new Promise<BaseResponse<LoginResponse>>((resolve, reject) => {
    axios
      .post(`${baseUrl}/${urlContextLogin}/login`, params)
      .then((response: BaseResponse<LoginResponse>) => {
        console.log("Login response:", response)
        if (response.error) reject(new Error({message: response.error.error, code: response.error.code}.message))
        resolve({ data: response.data })
      })
      .catch((error: unknown) => {
        reject(error as Error)
      })
  })

export const doSignup = async (params: SignupRequest): Promise<BaseResponse<SignupResponse>> =>
  new Promise<BaseResponse<SignupResponse>>((resolve, reject) => {
    axios
      .post(`${baseUrl}/${urlContextUsers}/register`, params)
      .then((response: BaseResponse<SignupResponse>) => {
        console.log("Signup response: ", response)
        if (response.error) reject(new Error({message: response.error.error, code: response.error.code}.message))
        resolve({ data: response.data })
      })
      .catch((error: unknown) => {
        reject(error as Error)
      })
  })
