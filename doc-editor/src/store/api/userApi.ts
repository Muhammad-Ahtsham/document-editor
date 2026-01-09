import type { UpdateUserProfile, UploadResponse, UserProfile } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/user/"
    }),
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => "me"
        }),
        updateUserProfile: builder.mutation<UserProfile, UpdateUserProfile>({
            query: (data) => ({ 
                url: "update",
                method: "PATCH",
                body: data,
                credentials: "include"
            })
        }),
        uploadProfileImage: builder.mutation<UploadResponse, FormData>({
            query: (data) => ({
                url: "upload/photo",
                method: "POST",
                body: data,
                credentials: "include"
            })
        }),
        deleteProfileImage: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "delete/photo",
                method: "DELETE",
                credentials: "include"
            })

        }
        ),

    })

})

export const { useGetUserQuery, useUploadProfileImageMutation, useDeleteProfileImageMutation, useUpdateUserProfileMutation } = userApi