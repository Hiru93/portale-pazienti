import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FindSpecialistItem } from "@/app/types/FindSpecialistTypes";

export const findSpecialistApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/specialists" }),
    reducerPath: "specialistsApi",
    tagTypes: ["Specialists"],
    endpoints: build => ({
        getSpecialists: build.query<FindSpecialistItem[], undefined>({
            query: () => "/",
            providesTags: ["Specialists"]
        })
    })
})

export const { useGetSpecialistsQuery } = findSpecialistApiSlice