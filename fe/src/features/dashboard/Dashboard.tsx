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
import { FindSpecialist } from "../findSpecialist/FindSpecialist";
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

    const componentMap: Record<string, JSX.Element> = {
        agenda: <div>Agenda Component</div>,
        find_specialist: <FindSpecialist />,
        medical_report: <div>Medical Report Component</div>,
        profile: <div>Profile Component</div>
    }
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
                        bg="bg.emphasized"
                        borderRadius="md"
                        boxShadow="md"
                        color="fg"
                        transform={selectedComponent ? 'translateY(0vh)' : 'translateY(100vh)'}
                        className={`${styles.componentContainer}${selectedComponent ? '' : styles.hiddenComponentContainer}`}>
                        {componentMap[selectedComponent?.name ?? '']}
                    </Box>
                </VStack>
            </Stack>
        </>
    )
    // #endregion [Render]
}