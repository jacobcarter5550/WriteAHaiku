import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SettingsState = {};

const initialState: SettingsState = {};

export const settingsUpdater = createSlice({
  name: "settingsUpdater",
  initialState,
  reducers: {},
});

export const {} = settingsUpdater.actions;

export default settingsUpdater.reducer;
