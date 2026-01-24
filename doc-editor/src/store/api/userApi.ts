import type { UpdateUserProfile, UploadResponse, UserProfile } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/user/"
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => "me",
            providesTags: ["User"]
        }),
        updateUserProfile: builder.mutation<UserProfile, UpdateUserProfile>({
            query: (data) => ({
                url: "update",
                method: "PATCH",
                body: data,
                credentials: "include"

            }),
            invalidatesTags: ["User"],
        }),
        uploadProfileImage: builder.mutation<UploadResponse, FormData>({
            query: (data) => ({
                url: "upload/photo",
                method: "POST",
                body: data,
                credentials: "include",
                invalidatesTags: ["User"],
            })
        }),
        deleteProfileImage: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "delete/photo",
                method: "DELETE",
                credentials: "include"
            }),
            invalidatesTags: ["User"],
        }
        ),

    })

})

export const { useGetUserQuery, useUploadProfileImageMutation, useDeleteProfileImageMutation, useUpdateUserProfileMutation } = userApi