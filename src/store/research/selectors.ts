import { RootState } from "..";

export const getResearchState = (state: RootState) =>
  state.app.researchUpdater.selectedResearchView;

export const getAssetClassWidgets = (state: RootState) => 
  state.app.researchUpdater.assetClassWidgets;

export const getMacroResearchWidgets = (state: RootState) =>   
  state.app.researchUpdater.macroResearchWidgets;

export const getEquityResearchWidgets = (state: RootState) => 
state.app.researchUpdater.equityResearchWidgets;

export const getFixedIncomeResearchWidgets = (state: RootState) =>
  state.app.researchUpdater.fixedIncomeResearchWidgets;

export const getPortfolioResearchWidgets = (state: RootState) =>
  state.app.researchUpdater.portfolioResearchWidgets;

export const getLayoutCoordinated = (state: RootState) => state.app.researchUpdater.layout;

