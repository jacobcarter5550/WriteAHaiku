import activeEquityUpdater from "./activeEquity/index.ts";
import nonPersistantUpdater from "./nonPerstistant/index.ts";
import pdfUpdater from "./pdf/index.ts";
import portfolioUpdater from "./portfolio/index.ts";
import researchUpdater from "./research/index.ts";
import settingsUpdater from "./settings/index.ts";
import taxAdvsiorReducer from "./taxAdvisor/index.ts";
import userUpdater from "./user/index.ts";

export const reducers = {
  portfolioUpdater: portfolioUpdater,
  settingsUpdater: settingsUpdater,
  taxAdvsiorUpdater: taxAdvsiorReducer,
  activeEquityUpdater: activeEquityUpdater,
  userUpdater: userUpdater,
  researchUpdater: researchUpdater,
  pdfUpdater: pdfUpdater,
};

export const nonPersistedReducers = {
  nonPersistantUpdater: nonPersistantUpdater,
};
