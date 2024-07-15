export enum StrategyType {
  Long = "Long",
  Short = "Short",
  LongShort = "Long/Short",
  OneThirty = "130/30",
  MarketNeutral = "MarketNeutral",
}

export type SecurityHolding = {
  eventId: string;
  accountId: number;
  securityId: string;
  securityName: string;
  preOptimizationWeight: number;
  postOptimizationWeight: number;
  tradingWeight: number;
  creationTimestamp: string;
};

export type OptEventResponse = {
  accountOptimizedHoldingList: SecurityHolding[];
};

export type OptimizationSelection = {
  parentId: string;
  portId: string;
  optHistId: string;
  optHistName: string;
  isSelected?: boolean;
};

export type RebalanceResponse = {
  accountId: number | null;
  eventId: string;
  eventName: string;
  preOptExpectedReturn: number;
  postOptExpectedReturn: number;
  preOptExpectedVolatility: number;
  postOptExpectedVolatility: number;
  preOptTrackingError: number;
  postOptTrackingError: number;
  postOptTransactionCost: number;
  postOptTaxCost: number;
  message: string;
  creationDate: string | null;
  messages: string | null;
};
