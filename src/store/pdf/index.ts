import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type NonPersistantState = {
  persistedPDFData: string | null;
};

// default states for accountdetails and currentnode were chagned to null. might cause issues

const initialState: NonPersistantState = {
  persistedPDFData: null,
};


export const pdfUpdater = createSlice({
    name: "pdfUpdater",
    initialState,
    reducers: {
        setPersistedPDF: (state, action: PayloadAction<string | null>) => {
            state.persistedPDFData = action.payload;
          },
    },
})

export const  {
    setPersistedPDF
} = pdfUpdater.actions

export default pdfUpdater.reducer;