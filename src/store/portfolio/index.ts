import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SelectOption } from "../../components/nav/Nav";
import {
  CurrentNode,
  Sector,
} from "../../components/modals/portfolioConstruction/types";
import { Option } from "../../types/types";
import { Security } from "../../components/modals/SecurityPreview/securtityViewTP";

export interface Item {
  item: any; // Update this with the correct type of 'item'
  label: string;
  value?: string;
  options?: Item[] | string;
}

export interface IDynamicPortfolioItem {
  filterId: number;
  userId: number;
  isActive: boolean;
  createdAt: string;
  name: string;
  cashLevelLower: number | null;
  cashLevelUpper: number | null;
  expectedAlphaLower: number | null;
  expectedAlphaUpper: number | null;
  expectedTeLower: number | null;
  expectedTeUpper: number | null;
  expectedVolLower: number | null;
  expectedVolUpper: number | null;
}

export type PortfolioState = {
  persistedCurrentSelection: Option | null;
  portfolioAction: Item[];
  portfolioSelectors: Item[];
  accountDetails: Security | null; // Update this with the correct type
  currentNode: CurrentNode | null;
  theme: string;
  accountId: SelectOption[];
  accountIDforSummary: string | null;
  dynamicPortfolioList: IDynamicPortfolioItem[];
  selectedAccountList: string[];
};

// default states for accountdetails and currentnode were chagned to null. might cause issues

const initialState: PortfolioState = {
  persistedCurrentSelection: null,
  portfolioAction: [],
  portfolioSelectors: [],
  accountDetails: null,
  currentNode: null,
  theme: "light",
  accountId: [],
  accountIDforSummary: null,
  dynamicPortfolioList: [],
  selectedAccountList: ["Select"],
};

export const portfolioUpdater = createSlice({
  name: "portfolioUpdater",
  initialState,
  reducers: {
    setPersistedCurrentSelection: (
      state,
      action: PayloadAction<Option | null>
    ) => {
      state.persistedCurrentSelection = action.payload;
    },
    setPortfolioAction: (state, action: PayloadAction<Item[]>) => {
      state.portfolioAction = action.payload;
    },
    setPortfolioSelectors: (state, action: PayloadAction<Item[]>) => {
      state.portfolioSelectors = action.payload;
    },
    addPortfolioSelectors: (state, action: PayloadAction<Item>) => {
      state.portfolioSelectors = [...state.portfolioSelectors, action.payload];
    },
    updateAccountId: (state, action: PayloadAction<SelectOption[]>) => {
      state.accountId = action.payload;
    },
    setAccountIdForSummary: (state, action: PayloadAction<string>) => {
      state.accountIDforSummary = action.payload;
    },
    updatePortfolioNode: (state, action: PayloadAction<Sector>) => {
      state.currentNode = action.payload;
    },
    addSecurityId: (state, action: PayloadAction<Security>) => {
      state.accountDetails = action.payload;
    },
    addDynamicPortfolioFilterList: (
      state,
      action: PayloadAction<IDynamicPortfolioItem[]>
    ) => {
      state.dynamicPortfolioList = action.payload;
    },
    setSelectedAccountList: (state, action: PayloadAction<string[]>) => {
      state.selectedAccountList = action.payload;
    },
  },
});

export const {
  setPersistedCurrentSelection,
  addPortfolioSelectors,
  updateAccountId,
  setAccountIdForSummary,
  setPortfolioAction,
  setPortfolioSelectors,
  updatePortfolioNode,
  addSecurityId,
  addDynamicPortfolioFilterList,
  setSelectedAccountList,
} = portfolioUpdater.actions;

export default portfolioUpdater.reducer;
