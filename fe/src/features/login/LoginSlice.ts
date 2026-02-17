import type { PayloadAction } from "@reduxjs/toolkit"
import type { BaseResponse, BasicUserInfo, LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "@/app/types"
import { createAppSlice } from "../../app/createAppSlice"
import { doLogin, doSignup } from "./LoginAPI"

export type LoginSliceState = {
    status: "idle" | "loading" | "success" | "failed"
    authToken: string | null
    userInfo: BasicUserInfo | null
}

const initialState: LoginSliceState = {
    status: "idle",
    authToken: null,
    userInfo: null
}

export const loginSlice = createAppSlice({
    name: "login",
    initialState,
    reducers: create => ({
        loginUser: create.asyncThunk(
            async (params: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
                const response = await doLogin(params)
                return response
            },
            {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action: PayloadAction<BaseResponse<LoginResponse>>) => {
                    console.info("Login successful:", action.payload)
                    state.status = "idle"
                    state.authToken = action.payload.data?.access_token ?? null
                    state.userInfo = action.payload.data?.user_data ?? null
                },
                rejected: state => {
                    console.error("Login failed")
                    state.status = "failed"
                    state.authToken = null
                },
            },
        ),
        signupUser: create.asyncThunk(
            async (params: SignupRequest): Promise<BaseResponse<SignupResponse>> => {
                const response = await doSignup(params)
                return response
            }, {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action: PayloadAction<BaseResponse<SignupResponse>>) => {
                    console.info("Signup successful:", action.payload)
                    state.status = "idle"
                },
                rejected: state => {
                    console.error("Signup failed")
                    state.status = "failed"
                }
            }),
        resetStatus: create.reducer(state => {
            state.status = "idle"
        })
    }),
    selectors: {
        selectAuthToken: state => state.authToken,
        selectStatus: state => state.status,
        selectUserInfo: state => state.userInfo
    }
})

export const { loginUser, signupUser, resetStatus } = loginSlice.actions

export const { selectAuthToken, selectStatus, selectUserInfo } = loginSlice.selectors