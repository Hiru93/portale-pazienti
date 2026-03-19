import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Day } from "@/app/types";

export const dictionaryApiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api/common",
    }),
    reducerPath: "dictionaryApi",
    tagTypes: ["Dictionary"],
    endpoints: build => ({
        getDays: build.query<Day[], undefined>({
            query: () => `/days`,
            providesTags: ["Dictionary"],
        })
    })
})

export const { useGetDaysQuery, useLazyGetDaysQuery } = dictionaryApiSlice