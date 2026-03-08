// #region [Type Imports]
import { useEffect, type JSX } from "react";
// #endregion [Type Imports]

// #region [Style Imports]
// #endregion [Style Imports]

// #region [Library Imports]
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
    logoutUser,
    selectAccessToken,
    selectLogoutStatus,
    selectUserInfo,
} from "@/features/login/LoginSlice"
import { AbsoluteCenter, Avatar, Box, Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { BeatLoader } from "react-spinners";
// #endregion [Library Imports]

export const Topbar = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    const userInfo = useAppSelector(selectUserInfo);
    const logoutStatus = useAppSelector(selectLogoutStatus);
    const accessToken = useAppSelector(selectAccessToken);
    // #endRegion [Redux State]

    // #region [Local State]
    useEffect(() => {
        if (!accessToken) void navigate("/")
    }, [accessToken])
    useEffect(() => {
        if (logoutStatus === "success") void navigate("/")
    }, [logoutStatus])
    // #endRegion [Local State]

    // #region [Constants]
    // #endRegion [Constants]

    // #region [UI Logic]
    const handleLogout = () => {
        void dispatch(logoutUser({ token: accessToken ?? "" }))
    }
    // #endRegion [UI Logic]

    // #region [Render]
    return (
        <>
            <AbsoluteCenter
                axis="horizontal"
                top="0"
                style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                width="100vw"
                position="fixed"
            >
                <Box
                    bg="bg.emphasized"
                    px="4"
                    py="2"
                    color="fg"
                    width="100vw"
                >
                    <Stack direction="row" gap="5">
                        <Avatar.Root>
                            <Avatar.Fallback name={userInfo?.first_name} />
                            <Avatar.Image src="https://bit.ly/sage-adebayo" />
                        </Avatar.Root>
                        <Stack direction="column" align="start" gap="0">
                            <span>Bentornato</span>
                            <span>{userInfo?.first_name} {userInfo?.last_name}</span>
                        </Stack>
                        <Button
                            loading={logoutStatus === "loading"}
                            ml="auto"
                            colorPalette="red"
                            variant="ghost"
                            spinner={<BeatLoader size="8" color="cyan" />}
                            onClick={() => { handleLogout() }}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Box>
            </AbsoluteCenter>
        </>
    )
    // #endregion [Render]
}