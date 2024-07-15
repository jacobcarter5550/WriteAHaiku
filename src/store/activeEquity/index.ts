import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type OverrideData = {
  overrideID: string;
  previousWeight: number;
  newWeight: number;
};

type ActiveEquityState = {
  newOverrideData: OverrideData[] | null;
};

const initialState: ActiveEquityState = {
  newOverrideData: null,
};

export const activeEquityUpdater = createSlice({
  name: "activeEquityUpdater",
  initialState,
  reducers: {
    updateNewOverrideData: (state, action: PayloadAction<any>) => {
      if (state.newOverrideData == null) {
        state.newOverrideData = [action.payload];
      } else {
        state.newOverrideData = [...state.newOverrideData, action.payload ]
      }
    },
    clearNewOverrideData : (state) =>{
        state.newOverrideData = null
    }
  },
});

export const {
clearNewOverrideData,updateNewOverrideData
} = activeEquityUpdater.actions;

export default activeEquityUpdater.reducer;
