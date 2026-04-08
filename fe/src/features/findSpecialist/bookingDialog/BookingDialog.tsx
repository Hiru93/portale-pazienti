// #region [Type Imports]
import type { BookingDialogProps } from "@/app/types";
import { type JSX } from "react";
// #endregion [Type Imports]

// #region [Style Imports]
import styles from "./BookingDialog.module.css"
// #endregion [Style Imports]

// #region [Library Imports]
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { CloseButton, Dialog, Field, Grid, GridItem, HStack, Input, Portal } from "@chakra-ui/react";
// #endregion [Library Imports]

export const BookingDialog = ({ selectedRange, onClose }: BookingDialogProps): JSX.Element => {

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    // #endRegion [Redux State]

    // #region [Constants]
    // #endRegion [Constants]

    // #region [Local State]
    const [slots, setSlots] = useState<Date[]>([]);
    // #endRegion [Local State]

    // #region [UI Logic]
    useEffect(() => {
        if (!selectedRange) {
            setSlots([]);
            return;
        }

        const slots: string[] = [];
        let current = dayjs(selectedRange.opening, "HH:mm");
        const closing = dayjs(selectedRange.closing, "HH:mm");

        while (current.isBefore(closing)) {
            slots.push(current.format("HH:mm"));
            current = current.add(30, "minute");
        }

        setSlots(slots.map(slot => dayjs(slot, "HH:mm").toDate()));
    }, [selectedRange])
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
                        <HStack justifyContent="flex-start" gap={2}>
                            <Grid templateColumns="repeat(4, 1fr)" gap={2} width="70%">
                                <GridItem colSpan={1}>
                                    <Field.Root>
                                        <Field.Label>Nome</Field.Label>
                                        <Input placeholder="Nome" />
                                    </Field.Root>
                                </GridItem>
                                <GridItem colSpan={1}>
                                    <Field.Root>
                                        <Field.Label>Cognome</Field.Label>
                                        <Input placeholder="Cognome" />
                                    </Field.Root>
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <Field.Root>
                                        <Field.Label>Email</Field.Label>
                                        <Input placeholder="Email" />
                                    </Field.Root>
                                </GridItem>
                            </Grid>
                            <Grid templateColumns="repeat(1, 1fr)" gap={2} width="30%">
                                {slots.map((slot, index) => {
                                    return (<GridItem key={index} colSpan={1}>
                                        <Field.Root>
                                            <span>{JSON.stringify(slot)}</span>
                                        </Field.Root>
                                    </GridItem>
                                    )
                                })}
                            </Grid>
                        </HStack>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    )
}