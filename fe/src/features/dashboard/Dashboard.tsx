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
import { AbsoluteCenter, Avatar, Box, Button, Stack } from "@chakra-ui/react";
// #endregion [Library Imports]

export const Dashboard = (): JSX.Element => {
    const token = useAppSelector(selectAuthToken);
    const userInfo = useAppSelector(selectUserInfo);
    const authLevel = useAppSelector(selectAuthLevel);
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
                            ml="auto"
                            colorPalette="red"
                            variant="ghost"
                            onClick={() => { console.log('//-------- TO DO - Handle logout') }}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Box>
            </AbsoluteCenter>
        </>
    )
}