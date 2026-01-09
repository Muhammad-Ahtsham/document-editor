import type { CreateDocContentResponse } from "@/types/types";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react"; // Fixed import

export const DocContentApi = createApi({
  reducerPath: "DocContentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/docContent/",
  }),

  endpoints: (builder) => ({
    createDocContent: builder.mutation<CreateDocContentResponse, { documentId: string; content: string }>({
      query: ({ documentId, content }) => ({
        url: "create",
        method: "POST",
        body: { documentId, content },
        credentials: "include"
      })
    }),
    getDocContent: builder.query<CreateDocContentResponse, { documentId: string }>({
      query: ({ documentId }) => ({
        url: "get",
        method: "GET",
        params: { documentId },
        credentials: "include"
      })
    }),
    updateDocContent: builder.mutation<CreateDocContentResponse, { documentId: string; content: string }>({
      query: ({ documentId, content }) => ({
        url: "update",
        method: "PUT",
        body: { documentId, content },
        credentials: "include"
      })
    }),
    exportDocument: builder.mutation<Blob,{ html: string; title: string }>({
      query: ({ html, title }) => ({
        url: "export/docx",
        method: "POST",
        body: { html, title },
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    })
  }),

})

export const {
  useCreateDocContentMutation,
  useGetDocContentQuery,
  useUpdateDocContentMutation,
  useExportDocumentMutation
} = DocContentApi;