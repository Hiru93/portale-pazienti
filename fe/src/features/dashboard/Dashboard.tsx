// #region [Type Imports]
import { useState, type JSX } from "react";
import { type DashboardComponent } from "@/app/types";
// #endregion [Type Imports]

// #region [Style Imports]
import styles from "./Dashboard.module.css";
// #endregion [Style Imports]

// #region [Library Imports]
import { useAppSelector } from "@/app/hooks";
import { FaCalendar, FaUserMd, FaFileAlt, FaCommentMedical } from "react-icons/fa";
import { Topbar } from "@/features/topbar/Topbar";
import { AbsoluteCenter, Box, Grid, GridItem, Stack, VStack, HStack, Icon } from "@chakra-ui/react";
import { selectAvailableComponents } from "../login/LoginSlice";
// #endregion [Library Imports]

export const Dashboard = (): JSX.Element => {

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    const components = useAppSelector(selectAvailableComponents)
    // #endRegion [Redux State]

    // #region [Local State]
    const [selectedComponent, setSelectedComponent] = useState<DashboardComponent | null>(null)
    // #endRegion [Local State]

    // #region [Constants]
    const iconMap: Record<string, JSX.Element> = {
        FaCalendar: <FaCalendar />,
        FaUserMd: <FaUserMd />,
        FaFileAlt: <FaFileAlt />
    };
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
                                {components?.map((component: DashboardComponent, index: number) => (
                                    <GridItem key={index}>
                                        <Box
                                            className={`${styles.componentCard}${selectedComponent ? ' ' + styles.collapsedCard : ''}`}
                                            bg="bg.emphasized"
                                            px="4"
                                            py="2"
                                            borderRadius="md"
                                            boxShadow="md"
                                            color="fg"
                                            onClick={() => { setSelectedComponent(component) }}
                                        >
                                            <Stack>
                                                <VStack>
                                                    <div className={`${styles.iconWrapper}${selectedComponent?.id === component.id ? ' ' + styles.iconWrapperSelected : ''}`}>
                                                        <Icon boxSize="12">
                                                            {iconMap[component.icon] ?? <FaCommentMedical />}
                                                        </Icon>
                                                    </div>
                                                    <div className={`${styles.labelWrapper}${selectedComponent ? ' ' + styles.hiddenLabelWrapper : ''}`}>
                                                        <Box
                                                            className={styles.labelFormatting}
                                                            transition="visibility 0.3s ease"
                                                        >
                                                            <span>{component.label}</span>
                                                        </Box>
                                                    </div>
                                                </VStack>
                                            </Stack>
                                        </Box>
                                    </GridItem>
                                ))}
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
                        <span>id: {selectedComponent?.id}</span><br />
                        <span>name: {selectedComponent?.name}</span><br />
                        <span>label: {selectedComponent?.label}</span><br />
                        <span>icon: {selectedComponent?.icon}</span><br />
                    </Box>
                </VStack>
            </Stack>
        </>
    )
    // #endregion [Render]
}