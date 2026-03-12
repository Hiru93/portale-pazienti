// #region [Type Imports]
import { Box, Button, HStack, Stack, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import {
    type FindSpecialistItem
} from "@/app/types";
// #endregion [Type Imports]

// #region [Style Imports]
import styles from "./FindSpecialist.module.css";
// #endregion [Style Imports]

// #region [Library Imports]
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { RiMapPin2Fill } from 'react-icons/ri'
import type { Map } from 'leaflet'
import { useLazyGetSpecialistsQuery } from "./FindSpecialistApiSlice";
// #endregion [Library Imports]

export const FindSpecialist = (): JSX.Element => {

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    const [fetchSpecialists, { data: specialists, isLoading: isLoadingSpecialists, isFetching: isFetchingSpecialists }] = useLazyGetSpecialistsQuery();
    // #endRegion [Redux State]

    // #region [Constants]
    const initialMapCenter = { lat: 45.40781159193707, lng: 11.873366454660607 };
    const zoom = 13;

    // #endRegion [Constants]

    // #region [Local State]
    const [map, setMap] = useState<Map | null>(null);
    const [dynamicMarkers, setDynamicMarkers] = useState<{ name: string, lat: number, lng: number, visible: boolean }[] | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>(initialMapCenter);
    const [results, setResults] = useState<{ name: string, lat: number, lng: number, visible: boolean }[] | null>(null);
    const [selectedResult, setSelectedResult] = useState<{ name: string, lat: number, lng: number, visible: boolean } | null>(null);
    // #endRegion [Local State]

    // #region [UI Logic]
    useEffect(() => {
        // The following OR is necessary in order to correctly bypass RTKQuery caching 
        // (if the data fetched is the same as the one already in the cache, RTKQuery will 
        // not update the data and consequently not trigger this useEffect, which is what we 
        // want in this case since we want to trigger the map animation even if the user 
        // clicks multiple times on the "Set results" button)
        if (isLoadingSpecialists || isFetchingSpecialists) return
        if (!specialists) return
        const mappedResults = specialists.map((specialist: FindSpecialistItem) => ({
            name: `${specialist.first_name} ${specialist.last_name} - ${specialist.clinic_name}`,
            lat: specialist.clinic_coords.y,
            lng: specialist.clinic_coords.x,
            visible: true
        }))
        setResults(mappedResults)
        setDynamicMarkers(mappedResults)
    }, [specialists, isLoadingSpecialists, isFetchingSpecialists])

    useEffect(() => {
        /* The following actually calls the method .invalidateSize with a rate
        of 60fps in order to match the flow of the css transition */
        if (!results) return
        const interval = setInterval(() => { map?.invalidateSize() }, 16)
        setTimeout(() => { clearInterval(interval); map?.invalidateSize() }, 1400)
    }, [results, map])


    const displayMap = useMemo(
        () => (
            <MapContainer
                style={{ height: '100%', width: '100%' }}
                center={mapCenter}
                zoom={zoom}
                scrollWheelZoom={false}
                ref={setMap}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {dynamicMarkers?.filter(marker => marker.visible).map((marker, index) => (
                    <Marker key={index} position={marker}>
                        <Popup>
                            {marker.name}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        ),
        [dynamicMarkers],
    )

    const handleDiveInMap = useCallback((selectedMarker: { name: string, lat: number, lng: number, visible: boolean }) => {
        if (!map) return
        setDynamicMarkers(dynamicMarkers?.map(marker => ({ ...marker, visible: marker.name === selectedMarker.name })) ?? [])
        setSelectedResult(selectedMarker)
        setMapCenter(selectedMarker)
        map.flyTo({ lat: selectedMarker.lat, lng: selectedMarker.lng }, zoom + 2)
    }, [map, dynamicMarkers])

    const handleMapReset = useCallback(() => {
        setSelectedResult(null)
        setDynamicMarkers(null)
        setResults(null)
    }, [map])

    const handleSetResults = useCallback(async () => {
        await fetchSpecialists({
            lat: 45.40781159193707,
            lng: 11.873366454660607,
            radius: 10
        });
        /* The following actually calls the method .invalidateSize with a rate
        of 60fps in order to match the flow of the css transition */
        const interval = setInterval(() => {
            map?.invalidateSize();
        }, 16); // ~60fps, matches screen refresh rate
        setTimeout(() => {
            clearInterval(interval);
            map?.invalidateSize();
        }, 1400);
    }, [map])
    // #endRegion [UI Logic]

    // #region [Render]
    return (
        <>
            <Stack className={styles.baseContainer}>
                <HStack className={styles.baseContainer}>
                    <VStack className={styles.baseContainer} style={{ minHeight: 0 }} gap={5}>
                        <HStack gap={5}>
                            <Button
                                onClick={() => {
                                    void handleSetResults();
                                }}>
                                Set results
                            </Button>
                            <Button
                                onClick={() => { handleMapReset() }}>
                                Reset results
                            </Button>
                        </HStack>
                        <HStack style={{ flex: 1, minHeight: 0, width: '100%' }} gap={5}>
                            <VStack className={`${styles.closedResultsDrawer} ${results ? styles.openedResultsDrawer : ''}`}>
                                {results?.map((result: { name: string, lat: number, lng: number, visible: boolean }, index: number) => (
                                    <Box
                                        key={index}
                                        boxShadow={selectedResult?.name === result.name ? 'md' : ''}
                                        borderRadius={selectedResult?.name === result.name ? 'md' : ''}
                                        className={`${styles.resultItem} ${selectedResult?.name === result.name ? styles.selectedResult : ''}`}
                                        style={{ width: '100%' }}
                                        onClick={() => { handleDiveInMap(result) }}>
                                        <VStack alignItems="flex-start" gap={0}>
                                            <span className={styles.resultName}>{result.name}</span>
                                            <span className={styles.resultCoordinates}>Lat: {result.lat.toFixed(5)}, Lng: {result.lng.toFixed(5)}</span>
                                        </VStack>
                                        <HStack style={{ width: '100%' }} key={index}><span>{result.name}</span> <RiMapPin2Fill /></HStack>
                                    </Box>
                                ))}
                            </VStack>
                            <div style={{ flex: 1, minWidth: 0, height: '100%' }}>{displayMap}</div>
                        </HStack>
                    </VStack>
                </HStack>
            </Stack>
        </>
    )
    // #endregion [Render]
}