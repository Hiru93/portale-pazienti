import { AbsoluteCenter } from "@chakra-ui/react"
import { type JSX } from "react"

import { BounceLoader } from "react-spinners"

import styles from "./Loader.module.css"

export const Loader = (): JSX.Element => {
    return (
        <div className={styles["loader-container"]} >
            <AbsoluteCenter>
                <BounceLoader color="#36d7b7" />
            </AbsoluteCenter>
        </div>
    )
}
