// #region [Type Imports]
import type { ChangeEvent, JSX } from "react"
// import { type Role } from "@/app/types"
import { type BasicErrorMessages, type SignupForm } from "@/app/types"
// #endregion [Type Imports]

// #region [Style Imports]
// #endregion [Style Imports]

// #region [Library Imports]
import { useState, useMemo, useRef, useEffect } from "react"
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
    loginUser,
    signupUser,
    resetStatus,
    selectAccessToken,
    selectLoginStatus,
    selectSignupStatus,
    selectUserInfo
} from "./LoginSlice"
import {
    AbsoluteCenter,
    // Alert,
    Box,
    Button,
    // CloseButton,
    Field,
    createListCollection,
    Input,
    Select,
    Stack,
    Text,
    VStack,
    Portal
} from "@chakra-ui/react"
import { BeatLoader } from "react-spinners"
import { PasswordInput, PasswordStrengthMeter } from "@/components/ui/password-input"
// import { useGetRolesQuery } from "./LoginApiSlice"
import { strengthOptions } from "@/utils/constants"
import { passwordStrength } from "check-password-strength"
import { toaster } from "@/components/ui/toaster"
// #endregion [Library Imports]


export const Login = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // #region [Helpers and utils]
    const handleGridPosition: (index: number, itemsPerRow: number) => { row: number, column: number } = (index, itemsPerRow) => {
        const row = Math.floor(index / itemsPerRow) + 1
        const column = (index % itemsPerRow) + 1
        return { row, column }
    }
    // #endregion

    // #region [Redux State]
    const loginStatus = useAppSelector(selectLoginStatus)
    const signupStatus = useAppSelector(selectSignupStatus)
    const accessToken = useAppSelector(selectAccessToken)
    const userInfo = useAppSelector(selectUserInfo)
    // const { data: roles, isLoading: rolesLoading } = useGetRolesQuery(undefined)
    // #endregion [Redux State]

    // #region [Local State]
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const logoPathRef = useRef<SVGPathElement>(null);
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [signupEmail, setSignupEmail] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [birthPlace, setBirthPlace] = useState("")
    const [userGender, setUserGender] = useState("")
    const [cap, setCap] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [fiscalCode, setFiscalCode] = useState("")
    const [phone, setPhone] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [showSignupForm, setShowSignupForm] = useState(false)
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
    // #endregion [Local State]

    // #region [Constants]
    const itemsPerRow = 3
    const errorMessages: BasicErrorMessages = {
        email: "Email is required",
        password: "Password is required",
        passwordsMatch: "Passwords do not match"
    }

    const genderOptions = useMemo(() => [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' }
    ], [])

    const fields: SignupForm = [{
        label: 'Name',
        type: 'text',
        value: firstName,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setFirstName(e.target.value) }
    }, {
        label: 'Surname',
        type: 'text',
        value: lastName,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setLastName(e.target.value) }
    }, {
        label: 'Birth Date',
        type: 'date',
        value: birthDate,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setBirthDate(e.target.value) }
    }, {
        label: 'Birth Place',
        type: 'text',
        value: birthPlace,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setBirthPlace(e.target.value) }
    }, {
        label: 'CAP',
        type: 'number',
        value: cap,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setCap(e.target.value) }
    }, {
        label: 'Address',
        type: 'text',
        value: address,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setAddress(e.target.value) }
    }, {
        label: 'City',
        type: 'text',
        value: city,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setCity(e.target.value) }
    }, {
        label: 'Gender',
        type: 'select',
        value: "",
        options: genderOptions,
    }, {
        label: 'Fiscal Code',
        type: 'text',
        value: fiscalCode,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setFiscalCode(e.target.value) }
    }, {
        label: 'Phone',
        type: 'number',
        value: phone,
        onChange: (e: ChangeEvent<HTMLInputElement>) => { setPhone(e.target.value) }
    }]
    // #endregion

    // #region [UI Logic]
    const genderCollection = useMemo(() => {
        return createListCollection({
            items: genderOptions,
            itemToString: option => option.label,
            itemToValue: option => option.value
        })
    }, [genderOptions])

    const strengthId = useMemo((): number => {
        if (!signupPassword) return 0;
        return (passwordStrength(signupPassword, strengthOptions) as { id: number }).id;
    }, [signupPassword])

    useEffect(() => {
        const outer = outerRef.current
        const inner = innerRef.current
        if (!outer || !inner) return

        outer.style.height = `${inner.scrollHeight.toString()}px`
        outer.style.width = `${inner.scrollWidth.toString()}px`

        const observer = new ResizeObserver(() => {
            outer.style.height = `${inner.scrollHeight.toString()}px`
            outer.style.width = `${inner.scrollWidth.toString()}px`
        })

        observer.observe(inner)

        return () => { observer.disconnect() }
    }, [])

    // Animation block that allows the logo to self draw on component mount and every time we switch back from the signup form to the login form
    useEffect(() => {
        const el = logoPathRef.current
        if (!el) return

        // Capture current visual state WHILE animations are still active
        const computed = getComputedStyle(el)
        const currentOffset = computed.strokeDashoffset
        const currentFill = computed.fill

        // Now safe to cancel — we've already captured the values
        el.getAnimations().forEach(a => { a.cancel() })

        const targetOffset = !showSignupForm ? '0' : '1'
        const targetFill = !showSignupForm ? '#ddd' : 'transparent'

        const strokeAnim = el.animate(
            [{ strokeDashoffset: currentOffset }, { strokeDashoffset: targetOffset }],
            { duration: !showSignupForm ? 2000 : 500, easing: 'ease', fill: 'forwards' }
        )
        const fillAnim = el.animate(
            [{ fill: currentFill }, { fill: targetFill }],
            { duration: 500, easing: 'ease', delay: !showSignupForm ? 1800 : 0, fill: 'forwards' }
        )

        // Once finished, persist final values as inline styles so they survive
        // browser Garbage Collection of completed fill:'forwards' animations during long idle periods
        strokeAnim.finished.then(() => {
            el.style.strokeDashoffset = targetOffset
            strokeAnim.cancel()
        }).catch(() => { /* animation was cancelled before finishing */ })
        fillAnim.finished.then(() => {
            el.style.fill = targetFill
            fillAnim.cancel()
        }).catch(() => { /* animation was cancelled before finishing */ })

    }, [showSignupForm])

    const passwordsMatchCheck = useMemo(() => {
        if (!showSignupForm) return true
        return signupPassword === repeatPassword
    }, [signupPassword, repeatPassword, showSignupForm])

    const validationControls = useMemo(() => {
        return {
            email: signupEmail.trim().length,
            password: signupPassword.trim().length,
            passwordsMatch: passwordsMatchCheck
        }
    }, [signupEmail, signupPassword, passwordsMatchCheck])

    // Reset validation state on input change to provide real-time feedback for signup form
    useEffect(() => {
        setHasAttemptedSubmit(false)
    }, [signupEmail, signupPassword, repeatPassword])

    const handleLoginUser = () => {
        void dispatch(loginUser({ email: loginEmail, password: loginPassword }))
    }

    const handleUserCreation = () => {
        setHasAttemptedSubmit(true)
        const allValid = Object.values(validationControls).every(Boolean)
        if (!allValid) return

        void dispatch(signupUser({
            patInfo: {
                email: signupEmail,
                password: signupPassword,
                first_name: firstName,
                last_name: lastName,
                cap: Number(cap),
                city: city,
                state: "State",
                address: address,
                cod_fisc: fiscalCode,
                birth_date: birthDate,
                sex: userGender,
                phone: Number(phone),
                birth_place: birthPlace,
            },
            opInfo: null,
            specInfo: null
        }))
    }

    useEffect(() => {
        if (signupStatus === "success") {
            resetSignupForm()
            resetLoginForm()
            setShowSignupForm(false)
            /**
             * queueMicrotask schedules the toast to run right after 
             * the current task completes, so React is no longer in 
             * the middle of a render cycle when flushSync is called. 
             * setTimeout(() => { ... }, 0) would also work but queueMicrotask 
             * runs sooner (before the browser paints).
             */
            queueMicrotask(() => {
                toaster.success({
                    closable: true,
                    onStatusChange: (t => {
                        if (t.status === "dismissing") dispatch(resetStatus('signup'))
                    }),
                    title: "Signup Successful",
                    description: "Your account has been created successfully. You can now log in with your credentials."
                })
            })
        } else if (signupStatus === "failed") {
            queueMicrotask(() => {
                toaster.error({
                    closable: true,
                    onStatusChange: (t => {
                        if (t.status === "dismissing") dispatch(resetStatus('signup'))
                    }),
                    title: "Signup Failed",
                    description: "An error occurred during signup. Please check your information and try again."
                })
            })
        }
    }, [signupStatus])

    useEffect(() => {
        if (loginStatus === "failed") {
            queueMicrotask(() => {
                toaster.error({
                    closable: true,
                    onStatusChange: (t => {
                        if (t.status === "dismissing") dispatch(resetStatus('login'))
                    }),
                    title: "Login Failed",
                    description: "Invalid email or password. Please try again."
                })
            })
        } else if (loginStatus === "success" && userInfo) {
            queueMicrotask(() => {
                toaster.success({
                    closable: true,
                    onStatusChange: (t => {
                        if (t.status === "dismissing") dispatch(resetStatus('login'))
                    }),
                    title: "Login Successful",
                    description: `Welcome back, ${userInfo.first_name} ${userInfo.last_name}!`
                })
            })
            if (accessToken) void navigate("/dashboard")
        }
    }, [loginStatus, userInfo, accessToken, navigate])

    const handleErrorMessages = (field: keyof typeof validationControls) => {
        return hasAttemptedSubmit && !validationControls[field] ? <Field.ErrorText>{errorMessages[field]}</Field.ErrorText> : null
    }

    const resetSignupForm = () => {
        // Precompiling both email and password fields for login form
        setLoginEmail(signupEmail)
        setLoginPassword(signupPassword)
        // Resetting each signup field
        setSignupEmail("")
        setSignupPassword("")
        setRepeatPassword("")
        setFirstName("")
        setLastName("")
        setBirthDate("")
        setBirthPlace("")
        setCap("")
        setAddress("")
        setCity("")
        setFiscalCode("")
        setPhone("")
        setHasAttemptedSubmit(false)
    }

    const resetLoginForm = () => {
        setLoginEmail("")
        setLoginPassword("")
    }
    // #endregion [UI Logic]

    // #region [Render]
    return (
        <>
            <Box h="100%" borderRadius="md">
                <VStack gap="4" direction="column">
                    <AbsoluteCenter>
                        <Box
                            bg="bg.emphasized"
                            px="4"
                            py="2"
                            borderRadius="md"
                            color="fg"
                        >
                            <Stack
                                direction="column"
                                gap="2"
                                justify="start"
                                mt="2"
                                ref={outerRef}
                                overflow="hidden"
                                transition="height 0.5s ease, width 0.5s ease"
                            >
                                <div ref={innerRef} style={{ width: 'max-content', minWidth: '300px' }}>
                                    <Box
                                        display="grid"
                                        placeItems="center"
                                    >
                                        <Box
                                            gridRow="1"
                                            gridColumn="1"
                                            opacity={showSignupForm ? 0 : 1}
                                            transition="opacity 0.5s ease"
                                        >
                                            <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    ref={logoPathRef}
                                                    d="M22.82,20.55l-.63-.18c-1.06-.29-1.79-.51-1.91-1.75,2.83-3,2.79-5.67,2.73-8.47,0-.38,0-.76,0-1.15a7.1,7.1,0,0,0-7-7A7.1,7.1,0,0,0,9,9c0,.39,0,.77,0,1.15-.06,2.8-.1,5.45,2.73,8.47-.12,1.24-.85,1.46-1.91,1.75l-.63.18C5.61,21.74,2,25,2,29a1,1,0,0,0,2,0c0-3,3-5.61,5.82-6.55.16-.06.34-.1.52-.15A4.11,4.11,0,0,0,13.45,20a5.4,5.4,0,0,0,5.1,0,4.11,4.11,0,0,0,3.11,2.35c.18.05.36.09.52.15C25,23.39,28,26,28,29a1,1,0,0,0,2,0C30,25,26.39,21.74,22.82,20.55Zm-9.36-3C10.9,15,10.94,12.86,11,10.18,11,9.8,11,9.4,11,9A5,5,0,0,1,21,9c0,.4,0,.8,0,1.18,0,2.68.09,4.8-2.47,7.36A3.58,3.58,0,0,1,13.46,17.54Z"
                                                    fill="transparent"
                                                    stroke="#ddd"
                                                    strokeWidth="0.5"
                                                    pathLength={1}
                                                    strokeDasharray={1}
                                                    strokeDashoffset={1}
                                                />
                                            </svg>
                                        </Box>
                                        <Text
                                            gridRow="1"
                                            opacity={showSignupForm ? 1 : 0}
                                            transition="opacity 0.5s ease"
                                            gridColumn="1"
                                            mb="5"
                                        >
                                            Create an account
                                        </Text>
                                    </Box>
                                    {showSignupForm ?
                                        <>
                                            <Field.Root required invalid={hasAttemptedSubmit && !validationControls.email} mb="2">
                                                <Field.Label>
                                                    Email <Field.RequiredIndicator />
                                                </Field.Label>
                                                <Input
                                                    placeholder="Email"
                                                    mb="2"
                                                    variant="subtle"
                                                    value={signupEmail}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setSignupEmail(e.target.value) }}
                                                />
                                                {handleErrorMessages("email")}
                                            </Field.Root>
                                            <Field.Root required invalid={hasAttemptedSubmit && !validationControls.password} mb="2">
                                                <Field.Label>
                                                    Password <Field.RequiredIndicator />
                                                </Field.Label>
                                                <PasswordInput
                                                    placeholder="Password"
                                                    variant="subtle"
                                                    value={signupPassword}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setSignupPassword(e.target.value) }}
                                                />
                                                {handleErrorMessages("password")}
                                            </Field.Root>
                                            <PasswordStrengthMeter
                                                value={strengthId}
                                            />
                                            <Field.Root invalid={hasAttemptedSubmit && !validationControls.passwordsMatch} mb="2">
                                                <Field.Label>Repeat Password</Field.Label>
                                                <PasswordInput
                                                    placeholder="Repeat Password"
                                                    variant="subtle"
                                                    value={repeatPassword}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setRepeatPassword(e.target.value) }}
                                                />
                                                {handleErrorMessages("passwordsMatch")}
                                            </Field.Root>
                                            <Box
                                                mt="2"
                                                mb="4"
                                                display="grid"
                                                gridTemplateColumns={`repeat(${String(itemsPerRow)}, 1fr)`}
                                                gap="1"
                                            >
                                                {fields.map((field, index) => {
                                                    const { row, column } = handleGridPosition(index, itemsPerRow)
                                                    switch (field.type) {
                                                        case 'select':
                                                            return (
                                                                <Select.Root
                                                                    collection={genderCollection}
                                                                    key={index}
                                                                    variant="subtle"
                                                                    gridRow={row}
                                                                    gridColumn={column}
                                                                    justifySelf="stretch"
                                                                    value={[userGender]}
                                                                    onValueChange={(e) => { setUserGender(e.value[0] ?? "") }}
                                                                >
                                                                    <Select.HiddenSelect />
                                                                    <Select.Label>{field.label}</Select.Label>
                                                                    <Select.Control>
                                                                        <Select.Trigger>
                                                                            <Select.ValueText placeholder="" />
                                                                        </Select.Trigger>
                                                                    </Select.Control>
                                                                    <Portal>
                                                                        <Select.Positioner>
                                                                            <Select.Content>
                                                                                {genderCollection.items.map((option) => (
                                                                                    <Select.Item item={option} key={option.value}>
                                                                                        {option.label}
                                                                                    </Select.Item>
                                                                                ))}
                                                                            </Select.Content>
                                                                        </Select.Positioner>
                                                                    </Portal>
                                                                </Select.Root>
                                                            )
                                                        case 'text':
                                                        case 'number':
                                                        case 'date':
                                                            return (
                                                                <Field.Root
                                                                    key={index}
                                                                    {...handleGridPosition(index, itemsPerRow)}
                                                                    justifySelf="stretch"
                                                                >
                                                                    <Field.Label>{field.label}</Field.Label>
                                                                    <Input
                                                                        variant="subtle"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                        type={field.type === "date" ? "date" : "text"}
                                                                    />
                                                                </Field.Root>
                                                            )
                                                        default:
                                                            return null
                                                    }
                                                })}
                                            </Box>
                                        </> :
                                        <>
                                            <Field.Root mb="2">
                                                <Input
                                                    placeholder="Email"
                                                    mb="2"
                                                    value={loginEmail}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setLoginEmail(e.target.value) }}
                                                />
                                            </Field.Root>
                                            <Field.Root mb="2">
                                                <PasswordInput
                                                    placeholder="Password"
                                                    mb="2"
                                                    value={loginPassword}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setLoginPassword(e.target.value) }}
                                                />

                                            </Field.Root>
                                        </>
                                    }
                                </div>
                            </Stack>
                            <Stack direction="row" gap="2" justify="flex-end">
                                {showSignupForm ?
                                    <>
                                        <Button
                                            colorPalette="red"
                                            variant="ghost"
                                            onClick={() => {
                                                setShowSignupForm(false)
                                                resetSignupForm()
                                            }}
                                        >
                                            Back to Login
                                        </Button>
                                        <Button
                                            colorPalette="cyan"
                                            variant="ghost"
                                            spinner={<BeatLoader size="xs" color="cyan" />}
                                            onClick={() => {
                                                handleUserCreation()
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                    </> :
                                    <>
                                        <Button
                                            loading={loginStatus === "loading"}
                                            colorPalette="cyan"
                                            variant="ghost"
                                            onClick={() => {
                                                handleLoginUser()
                                            }}
                                            spinner={<BeatLoader size="8" color="cyan" />}
                                            disabled={loginStatus === "loading"}
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            colorPalette="cyan"
                                            variant="ghost"
                                            disabled={loginStatus === "loading"}
                                            onClick={() => {
                                                setShowSignupForm(true)
                                                resetLoginForm()
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </>}
                            </Stack>
                        </Box>
                    </AbsoluteCenter>
                </VStack>
            </Box >
        </>
    )
}
// #endregion [Render]