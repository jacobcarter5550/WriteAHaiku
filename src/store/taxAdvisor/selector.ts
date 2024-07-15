import { RootState } from "..";



export type PortfolioState = {
     taxAdvisoryPortfolio: [];
};


export const getTaxPortfolios = (state: RootState) => state.app.taxAdvsiorUpdater.portfolioList;

