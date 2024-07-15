import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ResearchViewENUM } from "../../components/research/index.tsx";
import { WidgetSource } from "../../components/research/widgets/types.ts";

export type ResearchState = {
  selectedResearchView: ResearchViewENUM;
  assetClassWidgets: WidgetSource[] | null;
  macroResearchWidgets: WidgetSource[] | null;
  equityResearchWidgets: WidgetSource[] | null;
  fixedIncomeResearchWidgets: WidgetSource[] | null;
  portfolioResearchWidgets: WidgetSource[] | null;
  layout : any;
};



type LayoutUpdatePayload = {
  currentLayout: any; // Define the type based on your layout structure
  newLayout: any; // Define the type based on your layout structure
  screen: ResearchViewENUM;
};




// default states for accountdetails and currentnode were chagned to null. might cause issues

const initialState: ResearchState = {
  selectedResearchView: ResearchViewENUM.ASSET_CLASS,
  assetClassWidgets:  null,
  macroResearchWidgets: null,
  equityResearchWidgets : null,
  fixedIncomeResearchWidgets : null,
  portfolioResearchWidgets : null,
  layout: null
};


// Thunk action creator
export const updateLayoutAsync = createAsyncThunk(
  "researchUpdater/updateLayout",
  async ({ currentLayout, newLayout, screen }: LayoutUpdatePayload, { rejectWithValue }) => {      
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ layout: newLayout, screen }),
      });
      if (!response.ok) {
        throw new Error("API call failed");
      }
      console.log('response', response)
      const data = currentLayout
      return data;
    } catch (error) {
      return rejectWithValue(currentLayout);
    }
  }
);


export const researchUpdater = createSlice({
  name: "researchUpdater",
  initialState,
  reducers: {
    setSelectedResearchTab: (
      state,
      action: PayloadAction<ResearchViewENUM>
    ) => {
      state.selectedResearchView = action.payload;
    },
    updateAssetClassWidgets: (
      state,
      action: PayloadAction<WidgetSource | WidgetSource[]>
    ) => {
      const isPayloadArray = Array.isArray(action.payload);
      let dest: WidgetSource[] = [];
      if (state.assetClassWidgets === null) {
        state.assetClassWidgets = isPayloadArray
          ? (action.payload as WidgetSource[])
          : [action.payload as WidgetSource];
      } else {
        isPayloadArray
          ? dest.push(...(action.payload as WidgetSource[]))
          : dest.push(action.payload as WidgetSource);
        state.assetClassWidgets = dest;
      }
    },
    updateMacroClassWidgets: (
      state,
      action: PayloadAction<WidgetSource | WidgetSource[]>
    ) => {
      const isPayloadArray = Array.isArray(action.payload);
      let dest: WidgetSource[] = [];
      if (state.macroResearchWidgets === null) {
        state.macroResearchWidgets = isPayloadArray
          ? (action.payload as WidgetSource[])
          : [action.payload as WidgetSource];
      } else {
        isPayloadArray
          ? dest.push(...(action.payload as WidgetSource[]))
          : dest.push(action.payload as WidgetSource);
        state.macroResearchWidgets = dest;
      }
    },
    updateEquityResearchWidgets: (
      state,
      action: PayloadAction<WidgetSource | WidgetSource[]>
    ) => {
      const isPayloadArray = Array.isArray(action.payload);
      let dest: WidgetSource[] = [];
      if (state.equityResearchWidgets === null) {
        state.equityResearchWidgets = isPayloadArray
          ? (action.payload as WidgetSource[])
          : [action.payload as WidgetSource];
      } else {
        isPayloadArray
          ? dest.push(...(action.payload as WidgetSource[]))
          : dest.push(action.payload as WidgetSource);
        state.equityResearchWidgets = dest;
      }
    },
    updateFixedIncomeResearchWidgets: (
      state,
      action: PayloadAction<WidgetSource | WidgetSource[]>
    ) => {
      const isPayloadArray = Array.isArray(action.payload);
      let dest: WidgetSource[] = [];
      if (state.fixedIncomeResearchWidgets === null) {
        state.fixedIncomeResearchWidgets = isPayloadArray
          ? (action.payload as WidgetSource[])
          : [action.payload as WidgetSource];
      } else {
        isPayloadArray
          ? dest.push(...(action.payload as WidgetSource[]))
          : dest.push(action.payload as WidgetSource);
        state.fixedIncomeResearchWidgets = dest;
      }
    },
    updatePortfolioResearchWidgets: (
      state,
      action: PayloadAction<WidgetSource | WidgetSource[]>
    ) => {
      const isPayloadArray = Array.isArray(action.payload);
      let dest: WidgetSource[] = [];
      if (state.portfolioResearchWidgets === null) {
        state.portfolioResearchWidgets = isPayloadArray
          ? (action.payload as WidgetSource[])
          : [action.payload as WidgetSource];
      } else {
        isPayloadArray
          ? dest.push(...(action.payload as WidgetSource[]))
          : dest.push(action.payload as WidgetSource);
        state.portfolioResearchWidgets = dest;
      }
    },
    },
    extraReducers: (builder) => {
      builder.addCase(updateLayoutAsync.pending, (state) => {
        })
        .addCase(updateLayoutAsync.fulfilled, (state, action) => {
          console.log(action.payload,'success')
          state.layout = action.payload;
        })
        .addCase(updateLayoutAsync.rejected, (state, action) => {
          console.log(action.payload,'failed')
          state.layout = action.payload; 
        });
  },
});

export const {
  setSelectedResearchTab,
  updateAssetClassWidgets,
  updateMacroClassWidgets,
  updateEquityResearchWidgets,
  updateFixedIncomeResearchWidgets,
  updatePortfolioResearchWidgets,
} = researchUpdater.actions;

export default researchUpdater.reducer;
