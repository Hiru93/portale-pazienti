// #region [Type Imports]
import { Box, Button, HStack, Stack, VStack } from "@chakra-ui/react";
import { useCallback, useMemo, useState, type JSX } from "react";
// #endregion [Type Imports]

// #region [Style Imports]
import styles from "./FindSpecialist.module.css";
// #endregion [Style Imports]

// #region [Library Imports]
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { RiMapPin2Fill } from 'react-icons/ri'
import type { Map } from 'leaflet'
// #endregion [Library Imports]

export const FindSpecialist = (): JSX.Element => {

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    // #endRegion [Redux State]

    // #region [Constants]
    const initialMapCenter = { lat: 45.40781159193707, lng: 11.873366454660607 };
    const zoom = 13;
    const mockedSpecialists = [
        { visible: true, name: "Dr. Rossi", lat: 45.41234, lng: 11.87891 }, // ~650m NE
        { visible: true, name: "Dr. Bianchi", lat: 45.40312, lng: 11.87012 }, // ~700m SW
        { visible: true, name: "Dr. Verdi", lat: 45.41089, lng: 11.86754 }, // ~800m NW
        { visible: true, name: "Dr. Esposito", lat: 45.40456, lng: 11.88123 }, // ~600m SE
        { visible: true, name: "Dr. Ferrari", lat: 45.41567, lng: 11.87445 }, // ~860m N
        { visible: true, name: "Dr. Conti", lat: 45.40098, lng: 11.87234 }, // ~750m S
        { visible: true, name: "Dr. Marino", lat: 45.40923, lng: 11.88456 }, // ~900m E
        { visible: true, name: "Dr. Greco", lat: 45.40612, lng: 11.86389 }, // ~850m W
    ];

    // #endRegion [Constants]

    // #region [Local State]
    const [map, setMap] = useState<Map | null>(null);
    const [dynamicMarkers, setDynamicMarkers] = useState<{ name: string, lat: number, lng: number, visible: boolean }[] | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>(initialMapCenter);
    const [results, setResults] = useState<{ name: string, lat: number, lng: number, visible: boolean }[] | null>(null);
    const [selectedResult, setSelectedResult] = useState<{ name: string, lat: number, lng: number, visible: boolean } | null>(null);
    // #endRegion [Local State]

    // #region [UI Logic]
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
                            A pretty CSS3 popup. <br /> Easily customizable.
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
        /* The following actually calls the method .invalidateSize with a rate
        of 60fps in order to match the flow of the css transition */
        const interval = setInterval(() => {
            map?.invalidateSize();
        }, 16);
        setTimeout(() => {
            clearInterval(interval);
            map?.flyTo(initialMapCenter, zoom);
        }, 1400);
    }, [map])

    const handleSetResults = useCallback(() => {
        setResults(mockedSpecialists);
        setDynamicMarkers(mockedSpecialists);
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
                                onClick={() => { handleSetResults() }}>
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