// #region [Type Imports]
import { useEffect, useState, type JSX } from "react";
// #endregion [Type Imports]

// #region [Style Imports]
import styles from "./Dashboard.module.css";
// #endregion [Style Imports]

// #region [Library Imports]
import { FaCalendar, FaUserMd, FaFileAlt } from "react-icons/fa";
import { Topbar } from "@/features/topbar/Topbar";
import { AbsoluteCenter, Box, Grid, GridItem, Stack, VStack, HStack, Icon } from "@chakra-ui/react";
// #endregion [Library Imports]

export const Dashboard = (): JSX.Element => {

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    // #endRegion [Redux State]

    // #region [Local State]
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
    // #endRegion [Local State]

    // #region [Constants]
    // #endRegion [Constants]

    // #region [UI Logic]
    useEffect(() => {
        console.log('==================== selectedComponent: ', selectedComponent)
    }, [selectedComponent])
    // #endRegion [UI Logic]

    // #region [Render]
    return (
        <>
            <Stack>
                <VStack>
                    <Topbar />
                    <AbsoluteCenter>
                        <Grid>
                            <HStack>
                                <GridItem>
                                    <Box
                                        className={styles.componentCard}
                                        bg="bg.emphasized"
                                        px="4"
                                        py="2"
                                        borderRadius="md"
                                        boxShadow="md"
                                        color="fg"
                                        onClick={() => { setSelectedComponent("appointments") }}
                                    >
                                        <Stack>
                                            <VStack>
                                                <span>I miei appuntamenti</span>
                                                <Icon size="lg" color="cyan">
                                                    <FaCalendar />
                                                </Icon>
                                            </VStack>
                                        </Stack>
                                    </Box>
                                </GridItem>
                                <GridItem>
                                    <Box
                                        className={styles.componentCard}
                                        bg="bg.emphasized"
                                        px="4"
                                        py="2"
                                        borderRadius="md"
                                        boxShadow="md"
                                        color="fg"
                                        onClick={() => { setSelectedComponent("specialists") }}
                                    >
                                        <Stack>
                                            <VStack>
                                                <span>Trova uno specialista</span>
                                                <Icon size="lg" color="cyan">
                                                    <FaUserMd />
                                                </Icon>
                                            </VStack>
                                        </Stack>
                                    </Box>
                                </GridItem>
                                <GridItem>
                                    <Box
                                        className={styles.componentCard}
                                        bg="bg.emphasized"
                                        px="4"
                                        py="2"
                                        borderRadius="md"
                                        boxShadow="md"
                                        color="fg"
                                        onClick={() => { setSelectedComponent("reports") }}
                                    >
                                        <Stack>
                                            <VStack>
                                                <span>I miei referti</span>
                                                <Icon size="lg" color="cyan">
                                                    <FaFileAlt />
                                                </Icon>
                                            </VStack>
                                        </Stack>
                                    </Box>
                                </GridItem>
                            </HStack>
                        </Grid>
                    </AbsoluteCenter>
                </VStack>
            </Stack>
        </>
    )
    // #endregion [Render]
}