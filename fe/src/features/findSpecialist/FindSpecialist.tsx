// #region [Type Imports]
import { Box, Button, createListCollection, Field, Grid, GridItem, HStack, Input, Popover, Portal, Select, Stack, VStack } from "@chakra-ui/react";
import type { ChangeEvent, JSX } from "react";
import type {
    Radius,
    FindSpecialistItem,
    LeafletSearchResult,
    FindSpecialistResultItem,
    Day,
    ClinicSchedule
} from "@/app/types";
// #endregion [Type Imports]

// #region [Style Imports]
import styles from "./FindSpecialist.module.css";
// #endregion [Style Imports]

// #region [Library Imports]
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { RiMapPin2Fill } from 'react-icons/ri'
import type { Map } from 'leaflet'
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useLazyGetSpecialistsQuery } from "./FindSpecialistApiSlice";
import { useGetDaysQuery } from "./DictionaryApiSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FaPhoneAlt } from "react-icons/fa";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
// #endregion [Library Imports]

export const FindSpecialist = (): JSX.Element => {

    // #region [Helpers and utils]
    // #endregion [Helpers and utils]

    // #region [Redux State]
    const [fetchSpecialists, {
        data: specialists,
        isLoading: isLoadingSpecialists,
        isFetching: isFetchingSpecialists
    }] = useLazyGetSpecialistsQuery();
    const { data: daysDictionary } = useGetDaysQuery(undefined);
    // #endRegion [Redux State]

    // #region [Constants]
    const initialMapCenter = { lat: 45.40781159193707, lng: 11.873366454660607 };
    const zoom = 13;
    const radiusOptions = useMemo<Radius[]>(() => [
        { id: '1', label: '5 km', value: "5" },
        { id: '2', label: '10 km', value: "10" },
        { id: '3', label: '20 km', value: "20" },
        { id: '4', label: '50 km', value: "50" },
    ], [])
    // take a look here: https://www.npmjs.com/package/leaflet-geosearch
    const provider = new OpenStreetMapProvider({
        params: {
            'accept-language': 'it',
            countrycodes: 'it'
        }
    });
    // #endRegion [Constants]

    // #region [Local State]
    const [map, setMap] = useState<Map | null>(null);
    const [dynamicMarkers, setDynamicMarkers] = useState<FindSpecialistResultItem[] | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>(initialMapCenter);
    const [results, setResults] = useState<FindSpecialistResultItem[] | null>(null);
    const [selectedResult, setSelectedResult] = useState<FindSpecialistResultItem | null>(null);
    const [geoSearchParams, setGeoSearchParams] = useState<string>('');
    const [selectedRadius, setSelectedRadius] = useState<string>('');
    const [suggestions, setSuggestions] = useState<LeafletSearchResult[]>([]);
    const [pendingLocation, setPendingLocation] = useState<LeafletSearchResult | null>(null);
    const [openSpecialistSchedule, setOpenSpecialistSchedule] = useState<{ id: string, schedule: FindSpecialistResultItem['clinic_schedule'] } | null>(null);
    // #endRegion [Local State]

    // #region [UI Logic]
    const radiusCollection = useMemo(() => {
        return createListCollection<Radius>({
            items: radiusOptions,
            itemToString: (radius: Radius) => radius.label,
            itemToValue: (radius: Radius) => radius.value
        })
    }, [radiusOptions])

    useEffect(() => {
        // The following OR is necessary in order to correctly bypass RTKQuery caching 
        // (if the data fetched is the same as the one already in the cache, RTKQuery will 
        // not update the data and consequently not trigger this useEffect, which is what we 
        // want in this case since we want to trigger the map animation even if the user 
        // clicks multiple times on the "Set results" button)
        if (isLoadingSpecialists || isFetchingSpecialists) return
        if (!specialists) return
        const mappedResults = specialists.map((specialist: FindSpecialistItem) => ({
            id: specialist.id,
            name: `${specialist.first_name} ${specialist.last_name}`,
            lat: specialist.clinic_coords.y,
            lng: specialist.clinic_coords.x,
            clinic_schedule: specialist.clinic_schedule.map((scheduleItem: ClinicSchedule) => {
                const dayData = daysDictionary?.find((day: Day) => day.id === scheduleItem.id_day);
                return {
                    ...scheduleItem,
                    day: dayData ?? scheduleItem.day
                }
            }),
            clinic_address: specialist.clinic_address,
            clinic_name: specialist.clinic_name,
            clinic_phone: specialist.clinic_phone,
            visible: true
        }))
        if (mappedResults.length) {
            const bounds = mappedResults.reduce((acc, curr) => {
                return {
                    minLat: Math.min(acc.minLat, curr.lat),
                    maxLat: Math.max(acc.maxLat, curr.lat),
                    minLng: Math.min(acc.minLng, curr.lng),
                    maxLng: Math.max(acc.maxLng, curr.lng),
                }
            }, {
                minLat: mappedResults[0].lat,
                maxLat: mappedResults[0].lat,
                minLng: mappedResults[0].lng,
                maxLng: mappedResults[0].lng,
            })
            if (map) {
                /* Instead of the method ".flyTo" we use ".flyToBounds" in order to 
                automatically calculate the best zoom level to fit all the markers in the screen */
                map.flyToBounds([
                    [bounds.minLat, bounds.minLng],
                    [bounds.maxLat, bounds.maxLng]
                ], { padding: [50, 50] })
                /* The following actually calls the method .invalidateSize with a rate
                of 60fps in order to match the flow of the css transition */
                const interval = setInterval(() => {
                    map.invalidateSize();
                }, 16); // ~60fps, matches screen refresh rate
                setTimeout(() => {
                    clearInterval(interval);
                    map.invalidateSize();
                }, 1400);
            }
        }
        setResults(mappedResults)
        setDynamicMarkers(mappedResults)
    }, [daysDictionary, specialists, isLoadingSpecialists, isFetchingSpecialists])

    useEffect(() => {
        /* The following actually calls the method .invalidateSize with a rate
        of 60fps in order to match the flow of the css transition */
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

    const handleDiveInMap = useCallback((selectedMarker: FindSpecialistResultItem) => {
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
        setGeoSearchParams('')
        setSuggestions([]);
        setPendingLocation(null);
    }, [map])

    const handleSuggestionSelect = useCallback((suggestion: LeafletSearchResult) => {
        setGeoSearchParams(suggestion.label);
        setPendingLocation(suggestion);
        setSuggestions([]);
    }, [])

    const handleGeoSearch = useCallback(async () => {
        if (!pendingLocation) return
        const query = {
            ...pendingLocation,
            radius: selectedRadius || '25'
        };
        setGeoSearchParams(query.label);
        setSuggestions([]);
        await fetchSpecialists({
            lat: query.y,
            lng: query.x,
            radius: query.radius
        });
    }, [selectedRadius, pendingLocation, fetchSpecialists])

    const debouncedGeosearch = useDebouncedCallback(async (value: string) => {
        if (!value) return
        await provider.search({ query: value }).then((results) => {
            setSuggestions(results.map(result => ({
                x: result.x,
                y: result.y,
                label: result.label,
                bounds: result.bounds ?? [
                    [result.y, result.x],
                    [result.y, result.x]
                ]
            })));
        });
    }, 500);
    // #endRegion [UI Logic]

    // #region [Render]
    return (
        <>
            <Stack className={styles.baseContainer}>
                <HStack className={styles.baseContainer}>
                    <VStack className={styles.baseContainer} style={{ minHeight: 0 }} gap={5}>
                        <HStack gap={5} justifyContent="flex-end" width="100%">
                            <Field.Root width="auto">
                                <Popover.Root open={suggestions.length > 0}>
                                    <Popover.Anchor asChild>
                                        <Input
                                            placeholder="Trova specialisti intorno a te"
                                            value={geoSearchParams}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                setGeoSearchParams(e.target.value);
                                                void debouncedGeosearch(e.target.value);
                                            }}
                                            variant="subtle"
                                            size="lg"
                                        />
                                    </Popover.Anchor>
                                    <Portal>
                                        <Popover.Positioner>
                                            <Popover.Content>
                                                {suggestions.map((suggestion, index) => (
                                                    <Box
                                                        onMouseDown={() => { handleSuggestionSelect(suggestion) }}
                                                        key={index}
                                                        className={styles.resultItem}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {suggestion.label}
                                                    </Box>
                                                ))}
                                            </Popover.Content>
                                        </Popover.Positioner>
                                    </Portal>
                                </Popover.Root>
                            </Field.Root>
                            <Field.Root width="auto">
                                <Select.Root
                                    collection={radiusCollection}
                                    value={[selectedRadius]}
                                    variant="subtle"
                                    width="250px"
                                    onValueChange={(details) => { setSelectedRadius(details.value[0]) }}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText
                                                placeholder="Scegli la distanza massima"
                                            />
                                        </Select.Trigger>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {radiusCollection.items.map((radius: Radius) => (
                                                    <Select.Item item={radius} key={radius.id} onClick={() => { setSelectedRadius(radius.value) }}>
                                                        {radius.label}
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Field.Root>
                            <Button
                                colorPalette="cyan"
                                variant="outline"
                                disabled={!pendingLocation}
                                onClick={() => { void handleGeoSearch() }}>
                                Cerca
                            </Button>
                            <Button
                                colorPalette="red"
                                variant="outline"
                                onClick={() => { handleMapReset() }}>
                                Reset
                            </Button>
                        </HStack>
                        <HStack style={{ flex: 1, minHeight: 0, width: '100%' }} gap={5}>
                            <VStack className={`${styles.closedResultsDrawer} ${results ? styles.openedResultsDrawer : ''}`}>
                                {results?.length ? results.map((result: FindSpecialistResultItem, index: number) => (
                                    <Box
                                        key={index}
                                        boxShadow={selectedResult?.name === result.name ? 'md' : ''}
                                        borderRadius={selectedResult?.name === result.name ? 'md' : ''}
                                        className={`${styles.resultItem} ${selectedResult?.name === result.name ? styles.selectedResult : ''}`}
                                        style={{ width: '100%' }}
                                        onClick={() => { handleDiveInMap(result) }}>
                                        <VStack alignItems="flex-start" gap={0}>
                                            <span className={styles.resultName}>{result.name} - {result.clinic_name}</span>
                                            <HStack style={{ width: '100%' }}><RiMapPin2Fill /> <span>{result.clinic_address}</span></HStack>
                                            <HStack style={{ width: '100%' }}><FaPhoneAlt /> <span>{result.clinic_phone}</span></HStack>
                                            <div className={`${styles.scheduleCollapse} ${openSpecialistSchedule?.id === result.id ? styles.scheduleCollapseOpen : ''}`}>
                                                <div className={styles.scheduleCollapseInner}>
                                                    {(() => {
                                                        const sorted = [...result.clinic_schedule].sort((a, b) => Number(a.id_day) - Number(b.id_day));
                                                        return (
                                                            <Grid templateColumns={`auto repeat(${sorted.length.toString()}, 1fr)`} gap={2}>
                                                                <GridItem />
                                                                {sorted.map(item => {
                                                                    return (
                                                                        <GridItem key={item.id_day}>
                                                                            <span className={styles.scheduleDay}>{item.day?.name ?? item.id_day}</span>
                                                                        </GridItem>
                                                                    );
                                                                })}

                                                                <GridItem><span className={styles.scheduleDay}>Mattina</span></GridItem>
                                                                {sorted.map(item => (
                                                                    <GridItem key={item.id_day}>
                                                                        <span className={styles.scheduleTime} style={{ whiteSpace: 'nowrap' }}>
                                                                            {dayjs(item.opening_morning, 'HH:mm:ss').format('HH:mm')}
                                                                        </span><br />
                                                                        <span className={styles.scheduleTime} style={{ whiteSpace: 'nowrap' }}>
                                                                            {dayjs(item.closing_morning, 'HH:mm:ss').format('HH:mm')}
                                                                        </span>
                                                                    </GridItem>
                                                                ))}

                                                                <GridItem><span className={styles.scheduleDay}>Pomeriggio</span></GridItem>
                                                                {sorted.map(item => (
                                                                    <GridItem key={item.id_day}>
                                                                        <span className={styles.scheduleTime} style={{ whiteSpace: 'nowrap' }}>
                                                                            {dayjs(item.opening_afternoon, 'HH:mm:ss').format('HH:mm')}
                                                                        </span><br />
                                                                        <span className={styles.scheduleTime} style={{ whiteSpace: 'nowrap' }}>
                                                                            {dayjs(item.closing_afternoon, 'HH:mm:ss').format('HH:mm')}
                                                                        </span>
                                                                    </GridItem>
                                                                ))}
                                                            </Grid>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </VStack>
                                        <HStack style={{ width: '100%' }} key={index}>
                                            <Button
                                                onClick={() => { setOpenSpecialistSchedule({ id: result.id, schedule: result.clinic_schedule }) }}
                                                colorPalette="cyan"
                                                variant="ghost"
                                                ml="auto"
                                            >
                                                Mostra gli orari e prenota
                                            </Button>
                                        </HStack>
                                    </Box>
                                )) :
                                    <VStack alignItems="center" gap={3} mt={10}>
                                        <RiMapPin2Fill size={50} color="gray" />
                                        <span className={styles.noResultsText}>Nessuno specialista trovato</span>
                                    </VStack>
                                }
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