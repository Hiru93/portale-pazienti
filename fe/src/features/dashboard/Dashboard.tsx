// #region [Type Imports]
import { type JSX } from "react";
// #endregion [Type Imports]

// #region [Style Imports]
// #endregion [Style Imports]

// #region [Library Imports]
import { useAppSelector } from "@/app/hooks";
import {
    selectAuthToken,
    selectUserInfo,
    selectAuthLevel
} from "@/features/login/LoginSlice"
// #endregion [Library Imports]

export const Dashboard = (): JSX.Element => {
    const token = useAppSelector(selectAuthToken);
    const userInfo = useAppSelector(selectUserInfo);
    const authLevel = useAppSelector(selectAuthLevel);
    return (
        <div>
            <h1>Ciao {userInfo?.first_name} {userInfo?.last_name}</h1>
            <p>Auth Level: {authLevel}</p>
            <p>Token: {token}</p>
        </div>
    )
}