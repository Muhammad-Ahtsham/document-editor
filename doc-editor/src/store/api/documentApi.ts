import type { CreateDocumentResponse, Document, GetDocument } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/document/",
  }),
  tagTypes: ["Document"],

  endpoints: (builder) => ({
    getAllDocument: builder.query<{ success: boolean, document: Document[] }, void>({
      query: () => "get",
      providesTags: ["Document"]
    }),

    getDocument: builder.query<GetDocument, string>({
      query: (id) => `get/${id}`,
      providesTags: ["Document"]
    }),

    createDocument: builder.mutation<CreateDocumentResponse, Partial<Document>>({
      query: (newDocument) => ({
        url: "create",
        method: "POST",
        body: newDocument,
        credentials: "include",
      }),
      invalidatesTags: ["Document"],
    }),

    deleteDocument: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Document"],

    }),

    addMember: builder.mutation<CreateDocumentResponse, { documentId: string; email: string }>({
      query: ({ documentId, email }) => ({
        url: `addmember/${documentId}`,
        method: "PUT",
        body: { email },
        credentials: "include",
      }),
      invalidatesTags: ["Document"],

    }),
    deleteMember: builder.mutation<CreateDocumentResponse, { documentId: string; memberId: string }>({
      query: ({ documentId, memberId }) => ({
        url: `documents/${documentId}/member/${memberId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Document"],
    }),
    updateIsPrivate: builder.mutation<{ success: boolean, isPrivate: boolean, message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `public/${id}`,
        method: "PUT",
        credentials: "include"
      }),
      invalidatesTags: ["Document"]
    })
  }),
});

export const {
  useGetAllDocumentQuery,
  useCreateDocumentMutation,
  useAddMemberMutation,
  useGetDocumentQuery,
  useDeleteDocumentMutation,
  useUpdateIsPrivateMutation,
  useDeleteMemberMutation
} = documentApi;