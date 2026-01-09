import type { Document } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


const initialState: Document[] = [];

export const DocumentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    createDoc: (state, action: PayloadAction<Document>) => {
      state.push(action.payload);
    },
  },
});

export const { createDoc } = DocumentSlice.actions;
export default DocumentSlice;
