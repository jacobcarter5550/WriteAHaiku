import { RootState } from "..";

export const getPDFData = (state: RootState) =>
    state.app.pdfUpdater.persistedPDFData;
  