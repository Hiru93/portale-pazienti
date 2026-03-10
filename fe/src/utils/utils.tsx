import { type JSX, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { Navigate } from "react-router";
import { selectAccessToken, refreshUser } from "@/features/login/LoginSlice";
import { authLevels } from "./constants";
import { tokenParse, loadLocalInfo } from "./store-utils";

export const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole: string }) => {
    const accessToken = useAppSelector(selectAccessToken)
    const dispatch = useAppDispatch()
    const [initializing, setInitializing] = useState(!accessToken)

    useEffect(() => {
        if (accessToken) return
        const userId = loadLocalInfo("userId")
        if (!userId) { setInitializing(false); return }
        void dispatch(refreshUser(userId)).finally(() => {
            setInitializing(false)
        })
    }, [])

    if (initializing) return null

    const decodedToken = accessToken ? tokenParse(accessToken) : null

    console.log("Decoded token in ProtectedRoute: ", decodedToken)
    console.log("Required role: ", authLevels[requiredRole as keyof typeof authLevels])

    if (!accessToken) return <Navigate to="/" />
    if (!decodedToken) return <Navigate to="/" />
    if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) return <Navigate to="/" />
    if (!decodedToken.user_auth.length) return <Navigate to="/" />
    if (!authLevels[requiredRole as keyof typeof authLevels].some(role => decodedToken.user_auth.includes(role))) return <Navigate to="/" />

    return children
}

export const useHasAuth = (role: string): boolean => {
    const accessToken = useAppSelector(selectAccessToken)
    const decodedToken = accessToken ? tokenParse(accessToken) : null

    console.log("@@ Decoded token in useHasAuth: ", decodedToken)
    console.log("@@ Required role: ", authLevels[role as keyof typeof authLevels])

    return !!accessToken && !!decodedToken?.user_auth.length && authLevels[role as keyof typeof authLevels].some(r => decodedToken.user_auth.includes(r))
}