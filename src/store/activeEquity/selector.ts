import { RootState } from "..";

export const getNewOverrideData = (state: RootState) =>
  state.app.activeEquityUpdater.newOverrideData;
