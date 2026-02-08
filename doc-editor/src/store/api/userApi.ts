import type { UpdateUserProfile, UploadResponse, User, UserProfile } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : '/api';
export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/user/`,
        credentials: "include"
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation<{ success: boolean, user: User }, { email: string; password: string }>({
            query: (data) => ({
                url: "login",
                method: "POST",
                body: data,
                // credentials: "include"

            }),
            invalidatesTags: ["User"],
        }),
        getUser: builder.query<User, "">({
            query: () => "me",
            providesTags: ["User"],
        }),
        updateUserProfile: builder.mutation<UserProfile, UpdateUserProfile>({
            query: (data) => ({
                url: "update",
                method: "PATCH",
                body: data,
                // credentials: "include"

            }),
            invalidatesTags: ["User"],
        }),
        uploadProfileImage: builder.mutation<UploadResponse, FormData>({
            query: (data) => ({
                url: "upload/photo",
                method: "POST",
                body: data,
                // credentials: "include",
                invalidatesTags: ["User"],
            })
        }),
        deleteProfileImage: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "delete/photo",
                method: "DELETE",
                // credentials: "include"
            }),
            invalidatesTags: ["User"],
        }
        ),

    })

})

export const { useLoginMutation, useGetUserQuery, useUploadProfileImageMutation, useDeleteProfileImageMutation, useUpdateUserProfileMutation } = userApi