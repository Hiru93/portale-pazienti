import type { PayloadAction } from "@reduxjs/toolkit"
import type {
  BaseResponse,
  BasicUserInfo,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/app/types"
import { createAppSlice } from "../../app/createAppSlice"
import { doLogin, doSignup } from "./LoginAPI"

export type LoginSliceState = {
  loginStatus: "idle" | "loading" | "success" | "failed"
  signupStatus: "idle" | "loading" | "success" | "failed"
  authToken: string | null
  userInfo: BasicUserInfo | null
}

const initialState: LoginSliceState = {
  loginStatus: "idle",
  signupStatus: "idle",
  authToken: null,
  userInfo: null,
}

export const loginSlice = createAppSlice({
  name: "login",
  initialState,
  reducers: create => ({
    loginUser: create.asyncThunk(
      async (params: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
        return await doLogin(params)
      },
      {
        pending: state => {
          state.loginStatus = "loading"
        },
        fulfilled: (
          state,
          action: PayloadAction<BaseResponse<LoginResponse>>,
        ) => {
          console.info("Login successful:", action.payload)
          state.loginStatus = "success"
          state.authToken = action.payload.data?.access_token ?? null
          state.userInfo = action.payload.data?.user_data ?? null
        },
        rejected: state => {
          console.error("Login failed")
          state.loginStatus = "failed"
          state.authToken = null
        },
      },
    ),
    signupUser: create.asyncThunk(
      async (params: SignupRequest): Promise<BaseResponse<SignupResponse>> => {
        const response = await doSignup(params)
        return response
      },
      {
        pending: state => {
          state.signupStatus = "loading"
        },
        fulfilled: (
          state,
          action: PayloadAction<BaseResponse<SignupResponse>>,
        ) => {
          console.info("Signup successful:", action.payload)
          state.signupStatus = "success"
        },
        rejected: state => {
          console.error("Signup failed")
          state.signupStatus = "failed"
        },
      },
    ),
    resetStatus: create.reducer(
      (state, action: PayloadAction<"login" | "signup">) => {
        console.log("Resetting login status to idle" + action.payload)
        state[`${action.payload}Status`] = "idle"
      },
    ),
  }),
  selectors: {
    selectAuthToken: state => state.authToken,
    selectLoginStatus: state => state.loginStatus,
    selectSignupStatus: state => state.signupStatus,
    selectUserInfo: state => state.userInfo,
  },
})

export const { loginUser, signupUser, resetStatus } = loginSlice.actions

export const {
  selectAuthToken,
  selectLoginStatus,
  selectSignupStatus,
  selectUserInfo,
} = loginSlice.selectors
