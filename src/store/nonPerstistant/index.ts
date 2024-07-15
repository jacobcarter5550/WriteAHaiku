import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Option } from "../../components/portfolio/portfolioLib";
import { NodeStateData } from "../../components/activeEquity/AEGrid";
import { Security } from "../../components/modals/SecurityPreview/securtityViewTP";

export type NonPersistantState = {
  opt: boolean;
  optVal: number | null;
  securities: Security[] | null;
  currentSelection: Option | null;
  currentOpen: boolean;
  showOptimizationDefinition: boolean;
  securityModal: boolean;
  securityDetails: Security | null;
  form: any;
  showLetter: boolean;
  author: string | null;
  additionalData: string[] | null;
  absolute: boolean;
  absoluteCharacter: boolean;
  showOverrideConfiguration: boolean;
  highlightedNodes: NodeStateData[] | null;
  overrideAccountId: number | null;
  overrideConfigAccount: string | null;
  showOcioOptimizationDefinition: boolean;
  showNewAccountCreation: boolean;
  activeDynamicPortfolioFilterId: number | null;
  absoluteCharacterReturn: boolean;
  hideAccordians: boolean;
};

// default states for accountdetails and currentnode were chagned to null. might cause issues

const initialState: NonPersistantState = {
  opt: false,
  optVal: null,
  securities: null,
  currentSelection: null,
  author: null,
  absolute: false,
  absoluteCharacter: false,
  additionalData: [],
  highlightedNodes: null,
  overrideAccountId: null,
  overrideConfigAccount: null,
  showOverrideConfiguration: false,
  currentOpen: false,
  showOptimizationDefinition: false,
  securityModal: false,
  securityDetails: null,
  form: {},
  showLetter: false,
  showOcioOptimizationDefinition: false,
  showNewAccountCreation: false,
  activeDynamicPortfolioFilterId: null,
  absoluteCharacterReturn: false,
  hideAccordians: false,
};

export const nonPersistantUpdater = createSlice({
  name: "nonPersistantUpdater",
  initialState,
  reducers: {
    setOpt: (state, action: PayloadAction<boolean>) => {
      state.opt = action.payload;
    },
    setOptVal: (state, action: PayloadAction<number | null>) => {
      state.optVal = action.payload;
    },
    addSecurities: (state, action: PayloadAction<Security[]>) => {
      state.securities = action.payload;
    },
    setCurrentSelection: (state, action: PayloadAction<Option>) => {
      state.currentSelection = action.payload;
    },
    setCurrentOpen: (state, action: PayloadAction<boolean>) => {
      state.currentOpen = action.payload;
    },
    setShowOptimizationDefinition: (state, action: PayloadAction<boolean>) => {
      state.showOptimizationDefinition = action.payload;
    },
    setShowOcioOptimizationDefinition: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.showOcioOptimizationDefinition = action.payload;
    },
    setSecurityModal: (state, action: PayloadAction<boolean>) => {
      state.securityModal = action.payload;
    },
    setSecurityDetails: (state, action: PayloadAction<Security | null>) => {
      state.securityDetails = action.payload;
    },
    setForm: (state, action: PayloadAction<any>) => {
      state.form = action.payload;
    },
    setShowLetter: (state, action: PayloadAction<boolean>) => {
      state.showLetter = action.payload;
    },
    setAuthor: (state, action: PayloadAction<string | null>) => {
      state.author = action.payload;
    },
    setAdditionalData: (state, action: PayloadAction<string[] | null>) => {
      state.additionalData = action.payload;
    },
    setAbsolute: (state, action: PayloadAction<boolean>) => {
      state.absolute = action.payload;
    },
    setAbsoluteCharacter: (state, action: PayloadAction<boolean>) => {
      state.absoluteCharacter = action.payload;
    },
    setShowOverrideConfiguration: (state, action: PayloadAction<boolean>) => {
      state.showOverrideConfiguration = action.payload;
    },
    setHighlightedNodes: (
      state,
      action: PayloadAction<NodeStateData[] | null>
    ) => {
      state.highlightedNodes = action.payload;
    },
    setOverrideAccountId: (state, action: PayloadAction<number | null>) => {
      state.overrideAccountId = action.payload;
    },
    setOverrideConfigAccount: (state, action: PayloadAction<string | null>) => {
      state.overrideConfigAccount = action.payload;
    },
    setNewAccountCreation: (state, action: PayloadAction<boolean>) => {
      state.showNewAccountCreation = action.payload;
    },
    setActiveDynamicPortfolioFilterId: (
      state,
      action: PayloadAction<number>
    ) => {
      state.activeDynamicPortfolioFilterId = action.payload;
    },
    setAbsoluteCharacterReturn: (state, action: PayloadAction<boolean>) => {
      state.absoluteCharacterReturn = action.payload;
    },
    setAccordianVisbility: (state, action: PayloadAction<boolean>) => {
      state.hideAccordians = action.payload;
    },
  },
});

export const {
  addSecurities,
  setAbsolute,
  setAbsoluteCharacter,
  setAdditionalData,
  setAuthor,
  setCurrentOpen,
  setCurrentSelection,
  setForm,
  setHighlightedNodes,
  setOpt,
  setOptVal,
  setOverrideAccountId,
  setOverrideConfigAccount,
  setSecurityDetails,
  setSecurityModal,
  setShowLetter,
  setShowOptimizationDefinition,
  setShowOverrideConfiguration,
  setShowOcioOptimizationDefinition,
  setNewAccountCreation,
  setActiveDynamicPortfolioFilterId,
  setAbsoluteCharacterReturn,
  setAccordianVisbility,
} = nonPersistantUpdater.actions;

export default nonPersistantUpdater.reducer;
