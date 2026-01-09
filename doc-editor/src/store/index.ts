import { configureStore } from "@reduxjs/toolkit";
import { documentApi } from "./api/documentApi";
import DocumentSlice from "./slice/DocumentSlice";
import { DocContentApi } from "./api/docContentApi";
import { userApi } from "./api/userApi";
import UserSlice from "./slice/UserSlice";


export const store = configureStore({
  reducer: {
    [documentApi.reducerPath]: documentApi.reducer,
    [DocContentApi.reducerPath]: DocContentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    document: DocumentSlice.reducer,
    user: UserSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(documentApi.middleware)
      .concat(DocContentApi.middleware)
      .concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
