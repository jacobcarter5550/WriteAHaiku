export type Sector = {
  sectorModelId: number;
  sectorLevel: number;
  sectorCode: string;
  description: string | null;
  sectorLevelName: string;
  sectorName: string;
  parentSectorLevel: number;
  parentSectorCode: string | null;
  childSectors: Sector[];
  children?: Sector[];
};

export type CurrentNode = {
  accountId: number;
  securityId: string;
  quantity: number;
  price: number;
  weight: number;
  preOptimizationWeight: number;
  Sector : string;
  postOptimizationWeight: number;
  tradingWeight: number;
  benchmarkWeight: number;
  overrideWeight: number;
  securityCd: string;
  securityName: string;
  securityTypeCd: string;
  issuerId: null;
  cusip: string;
  sedol: string;
  isin: string;
  cik: string;
  regionModelId: number;
  regionCd: string;
  headquarter: string;
  foundingDate: string;
  securityDescription: string;
  figiId: string;
  shareclassFigiId: string;
  compositeFigiId: string;
  countryModelId: number;
  countryCd: string;
  assetClassCd: string;
  assetClassModelId: number;
  sectorModelId: number;
  sectorCd: string;
  sectorLevel: number;
  additionalAttributeMap?: CurrentNode[];
  valid: boolean;
  sectorName: string;
  default: string;
  dataPath: string[];
  postOptimizationWeight4: number;
  preOptimizationWeight4: number;
  tradingWeight4: number;
  quantity4: number;
  weight4: number;
  benchmarkWeight4: number;
  overrideWeight4: number;
};

export type Classification = {
  messages: any;
  sectorList: Sector[];
};

export type GenericSelctionOption = {
  title: string;
  val?: number | string;
  id?: number;
};

export type SimplifiedStrategy = {
  strategyId: number;
  parentStrategyId: number;
  name: string;
  level: number;
};

export type AccountDetail = {
  accountId: number;
  accountFullName: string;
  regionCd: string;
  accountManagerId: number;
  baseCurrency: string;
  effectiveEndDate: string | null;
  effectiveStartDate: string;
  creationDate: string;
  strategyId: number;
  managerName: string;
};

export type PortfolioCollection = {
  accountDetailViews: AccountDetail[];
  strategyHierarchyViews: SimplifiedStrategy[];
  message: string | null;
};

export type Node = {
  background_color?: string;
  name?: string;
  id: string;
  value: string;
  label?: any;
  renderIcon?: any;
  children?: Node[];
  cacheIn: any;
  cacheOut: any;
  rebalance: any;
  updateProperty?: (propertyId: number, newValue: object) => void;
  deleteProperty?: (propertyId: number) => void;
};
