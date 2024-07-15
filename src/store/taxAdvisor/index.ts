import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TaxAdvisoryState = {
    portfolioList: any;
};

const initialState: TaxAdvisoryState = {
  portfolioList: [],
};

export const taxAdvisorUpdater = createSlice({
  name: "taxAdvisorUpdater",
  initialState,
  reducers: {
      getPortfolioList: (state, action: PayloadAction<boolean>) => {
          state.portfolioList = action.payload;
      },
  },
});

export const {
    getPortfolioList
} = taxAdvisorUpdater.actions;

export default taxAdvisorUpdater.reducer;
