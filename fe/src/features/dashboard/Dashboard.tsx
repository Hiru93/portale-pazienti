// #region [Type Imports]
import { useEffect, useRef, useState, type JSX } from "react";
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
    const innerRef = useRef<HTMLDivElement>(null);
    const outerRef = useRef<HTMLDivElement>(null);
    // #endRegion [Redux State]

    // #region [Local State]
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
    // #endRegion [Local State]

    // #region [Constants]
    // #endRegion [Constants]

    // #region [UI Logic]
    // #endRegion [UI Logic]

    // #region [Render]
    return (
        <>
            <Stack>
                <VStack style={{ overflow: 'hidden' }}>
                    <Topbar />
                    <AbsoluteCenter>
                        <Grid className={selectedComponent ? styles.collapsedGrid : ''}>
                            <HStack gap="20">
                                <GridItem>
                                    <Box
                                        className={`${styles.componentCard}${selectedComponent ? ' ' + styles.collapsedCard : ''}`}
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
                                                <div className={`${styles.iconWrapper}${selectedComponent === "appointments" ? ' ' + styles.iconWrapperSelected : ''}`}>
                                                    <Icon boxSize="12">
                                                        <FaCalendar />
                                                    </Icon>
                                                </div>
                                                <div className={`${styles.labelWrapper}${selectedComponent ? ' ' + styles.hiddenLabelWrapper : ''}`}>
                                                    <Box
                                                        className={styles.labelFormatting}
                                                        transition="visibility 0.3s ease"
                                                    >
                                                        <span>I miei appuntamenti</span>
                                                    </Box>
                                                </div>
                                            </VStack>
                                        </Stack>
                                    </Box>
                                </GridItem>
                                <GridItem>
                                    <Box
                                        className={`${styles.componentCard}${selectedComponent ? ' ' + styles.collapsedCard : ''}`}
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
                                                <div className={`${styles.iconWrapper}${selectedComponent === "specialists" ? ' ' + styles.iconWrapperSelected : ''}`}>
                                                    <Icon boxSize="12">
                                                        <FaUserMd />
                                                    </Icon>
                                                </div>
                                                <div className={`${styles.labelWrapper}${selectedComponent ? ' ' + styles.hiddenLabelWrapper : ''}`}>
                                                    <Box
                                                        className={styles.labelFormatting}
                                                        transition="visibility 0.3s ease"
                                                    >
                                                        <span>Trova uno specialista</span>
                                                    </Box>
                                                </div>
                                            </VStack>
                                        </Stack>
                                    </Box>
                                </GridItem>
                                <GridItem>
                                    <Box
                                        className={`${styles.componentCard}${selectedComponent ? ' ' + styles.collapsedCard : ''}`}
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
                                                <div className={`${styles.iconWrapper}${selectedComponent === "reports" ? ' ' + styles.iconWrapperSelected : ''}`}>
                                                    <Icon boxSize="12">
                                                        <FaFileAlt />
                                                    </Icon>
                                                </div>
                                                <div className={`${styles.labelWrapper}${selectedComponent ? ' ' + styles.hiddenLabelWrapper : ''}`}>
                                                    <Box
                                                        className={styles.labelFormatting}
                                                        transition="visibility 0.3s ease"
                                                    >
                                                        <span>I miei referti</span>
                                                    </Box>
                                                </div>
                                            </VStack>
                                        </Stack>
                                    </Box>
                                </GridItem>
                            </HStack>
                        </Grid>
                    </AbsoluteCenter>
                    <Box
                        position="fixed"
                        bottom="2.5vh"
                        left="2.5vw"
                        height="83vh"
                        width="95vw"
                        bg="bg.emphasized"
                        borderRadius="md"
                        boxShadow="md"
                        color="fg"
                        transform={selectedComponent ? 'translateY(0vh)' : 'translateY(100vh)'}
                        transition="transform 1.4s ease, opacity 1.4s ease"
                        zIndex="5"
                        padding="20px"
                    >
                        <span> Test content</span>
                    </Box>
                </VStack>
            </Stack>
        </>
    )
    // #endregion [Render]
}