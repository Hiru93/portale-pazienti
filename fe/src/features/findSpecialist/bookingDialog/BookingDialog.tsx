// #region [Type Imports]
import type { BookingDialogProps } from "@/app/types";
import type { JSX } from "react";
// #endregion [Type Imports]

// #region [Style Imports]
import styles from "./BookingDialog.module.css"
// #endregion [Style Imports]

// #region [Library Imports]
import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
// #endregion [Library Imports]

export const BookingDialog = ({ selectedRange, onClose }: BookingDialogProps): JSX.Element => {

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    // #endRegion [Redux State]

    // #region [Constants]
    // #endRegion [Constants]

    // #region [Local State]
    // #endRegion [Local State]

    // #region [UI Logic]
    // #endRegion [UI Logic]

    // #region [Render]
    return (
        <Dialog.Root
            open={selectedRange !== null}
            onOpenChange={({ open }) => { if (!open) onClose() }}
            size="cover"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <span>{JSON.stringify(selectedRange)}</span>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    )
}