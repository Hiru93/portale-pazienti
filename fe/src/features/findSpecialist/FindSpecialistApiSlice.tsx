import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FindSpecialistItem } from "@/app/types";
import type { RootState } from "@/app/store";

export const findSpecialistApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api/specialist",
        prepareHeaders: (headers: Headers, { getState }) => {
            const token = (getState() as RootState).login.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    reducerPath: "specialistsApi",
    tagTypes: ["Specialists"],
    endpoints: build => ({
        getSpecialists: build.query<FindSpecialistItem[], { lat: number, lng: number, radius: string }>({
            query: ({ lat, lng, radius }) => `/?lat=${lat as unknown as string}&lng=${lng as unknown as string}&radius=${radius as unknown as string}`,
            providesTags: ["Specialists"],
            transformResponse: (response: { specialists: FindSpecialistItem[] }) => response.specialists,
        })
    })
})

export const { useGetSpecialistsQuery, useLazyGetSpecialistsQuery } = findSpecialistApiSlice