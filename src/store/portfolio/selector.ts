import { RootState } from "..";

export const getPortfolioActions = (state: RootState) =>
  state.app.portfolioUpdater.portfolioAction;

export const portfolioSelectors = (state: RootState) =>
  state.app.portfolioUpdater.portfolioSelectors;

export const getAccountId = (state: RootState) =>
  state.app.portfolioUpdater.accountId;

export const getAccountIdForSummary = (state: RootState) =>
  state.app.portfolioUpdater.accountIDforSummary;

export const getAccountDetails = (state: RootState) =>
  state.app.portfolioUpdater.accountDetails;

export const getCurrentNode = (state: RootState) =>
  state.app.portfolioUpdater.currentNode;

export const getPortfolioState = (state: RootState) =>
  state.app.portfolioUpdater;

export const getPersistedCurrentSelection = (state: RootState) =>
  state.app.portfolioUpdater.persistedCurrentSelection;

export const getDynamicPortfolioList = (state: RootState) =>
  state.app.portfolioUpdater.dynamicPortfolioList;

export const getSelectedAccountList = (state: RootState) =>
  state.app.portfolioUpdater.selectedAccountList;