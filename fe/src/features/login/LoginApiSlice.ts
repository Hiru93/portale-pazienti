import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Role } from "@/app/types/LoginTypes"

export const rolesApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/common" }),
    reducerPath: "rolesApi",
    tagTypes: ["Roles"],
    endpoints: build => ({
        getRoles: build.query<Role[], undefined>({
            query: () => "/roles",
            providesTags: ["Roles"]
        }),
    }),
})

export const { useGetRolesQuery } = rolesApiSlice