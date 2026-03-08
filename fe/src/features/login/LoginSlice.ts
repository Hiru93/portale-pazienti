import type { PayloadAction } from "@reduxjs/toolkit"
import type {
  BaseResponse,
  BasicUserInfo,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
  DashboardComponent,
  AccessResponse,
} from "@/app/types"
import { createAppSlice } from "../../app/createAppSlice"
import { doLogin, doLogout, doRefreshToken, doSignup } from "./LoginAPI"
import { loadLocalInfo, tokenParse } from "@/utils/store-utils"

export type LoginSliceState = {
  loginStatus: "idle" | "loading" | "success" | "failed"
  signupStatus: "idle" | "loading" | "success" | "failed"
  logoutStatus: "idle" | "loading" | "success" | "failed"
  accessToken: string | null
  authLevel: string[] | null
  availableComponents: DashboardComponent[] | null
  userInfo: BasicUserInfo | null
}

const initialTokenValue: string | null = loadLocalInfo("accessToken")

const initialState: LoginSliceState = {
  loginStatus: "idle",
  signupStatus: "idle",
  logoutStatus: "idle",
  accessToken: initialTokenValue,
  authLevel: initialTokenValue ? tokenParse(initialTokenValue).user_auth : null,
  availableComponents: initialTokenValue
    ? tokenParse(initialTokenValue).available_components
    : null,
  userInfo: initialTokenValue ? tokenParse(initialTokenValue).user_data : null,
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
          const data = action.payload.data
          if (!data) return
          const { access_token } = data
          state.loginStatus = "success"
          state.logoutStatus = "idle"
          state.accessToken = access_token
          if (access_token && loadLocalInfo("accessToken") !== access_token) {
            localStorage.setItem("accessToken", access_token)
          }
          const parsedToken = tokenParse(access_token)
          state.authLevel = parsedToken.user_auth
          state.userInfo = parsedToken.user_data
          state.availableComponents = parsedToken.available_components
        },
        rejected: state => {
          console.error("Login failed")
          state.loginStatus = "failed"
          state.accessToken = null
          localStorage.removeItem("accessToken")
          state.authLevel = null
          state.userInfo = null
        },
      },
    ),
    logoutUser: create.asyncThunk(
      async (params: LogoutRequest): Promise<BaseResponse<LogoutResponse>> => {
        return await doLogout(params)
      },
      {
        pending: state => {
          state.logoutStatus = "loading"
        },
        fulfilled: state => {
          state.logoutStatus = "success"
          state.accessToken = null
          localStorage.removeItem("accessToken")
          state.authLevel = null
          state.userInfo = null
        },
        rejected: state => {
          state.logoutStatus = "failed"
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
    refreshUser: create.asyncThunk(
      async (userId: string): Promise<BaseResponse<AccessResponse>> => {
        return await doRefreshToken(userId)
      },
      {
        fulfilled: (
          state,
          action: PayloadAction<BaseResponse<AccessResponse>>,
        ) => {
          const access_token = action.payload.data?.access_token
          if (!access_token) return
          state.accessToken = access_token
          localStorage.setItem("accessToken", access_token)
          const parsed = tokenParse(access_token)
          state.authLevel = parsed.user_auth
          state.userInfo = parsed.user_data
          state.availableComponents = parsed.available_components
        },
        rejected: state => {
          // refresh failed → full logout
          state.accessToken = null
          localStorage.removeItem("accessToken")
          state.authLevel = null
          state.userInfo = null
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
    selectAccessToken: state => state.accessToken,
    selectLoginStatus: state => state.loginStatus,
    selectSignupStatus: state => state.signupStatus,
    selectLogoutStatus: state => state.logoutStatus,
    selectUserInfo: state => state.userInfo,
    selectAuthLevel: state => state.authLevel,
    selectAvailableComponents: state => state.availableComponents,
  },
})

export const { loginUser, signupUser, logoutUser, resetStatus, refreshUser } =
  loginSlice.actions

export const {
  selectAccessToken,
  selectLoginStatus,
  selectSignupStatus,
  selectLogoutStatus,
  selectUserInfo,
  selectAuthLevel,
  selectAvailableComponents,
} = loginSlice.selectors
