import { RootState } from "..";

export const getOpt = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.opt;

export const getOptVal = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.optVal;

export const getSecurities = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.securities;

export const getCurrentSelection = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.currentSelection;

export const getCurrentOpen = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.currentOpen;

export const getShowOptimizationDefinition = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.showOptimizationDefinition;

export const getShowOcioOptimizationDefinition = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.showOcioOptimizationDefinition;

export const getSecurityModal = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.securityModal;

export const getSecurityDetails = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.securityDetails;

export const getForm = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.form;

export const getShowLetter = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.showLetter;

export const getAuthor = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.author;

export const getAdditionalData = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.additionalData;

export const getAbsolute = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.absolute;

export const getAbsoluteCharacter = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.absoluteCharacter;

export const getAbsoluteCharacterReturn = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.absoluteCharacterReturn;

export const getHighlightedNodes = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.highlightedNodes;

export const getOverrideAccountId = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.overrideAccountId;

export const getOverrideConfigAccount = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.overrideConfigAccount;

export const getShowOverrideConfiguration = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.showOverrideConfiguration;

export const getShowNewAccountCreation = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.showNewAccountCreation;

export const getActiveDynamicPortfolioFilterId = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.activeDynamicPortfolioFilterId;

export const getAccordianVisibility = (state: RootState) =>
  state.nonPersistedApp.nonPersistantUpdater.hideAccordians;
