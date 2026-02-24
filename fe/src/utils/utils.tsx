import { type JSX } from "react";
import { useAppSelector } from "@/app/hooks";
import { Navigate } from "react-router";
import { selectAuthToken } from "@/features/login/LoginSlice";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const authToken = useAppSelector(selectAuthToken)

    if (!authToken) return <Navigate to="/" />

    return children
}