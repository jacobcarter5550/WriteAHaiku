// types.ts
export type CompanyInfo = {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}

export interface Message {
  sender: 'human' | 'ai' | 'ai_tool';
  text: string;
  toolName?: string;
  done?: boolean;
}


export type SalesData = {
  [category: string]: number;
};

export type SalesInfo = {
  ticker: string;
  data: {
    [date: string]: SalesData;
  }[];
};

export function isCompanyInfo(info: InfoBox): info is CompanyInfo {
  return (info as CompanyInfo).companyName !== undefined;
}

export function isSalesInfo(info: InfoBox): info is SalesInfo {
  const salesInfo = info as SalesInfo;
  return (
    typeof salesInfo.ticker === 'string' &&
    Array.isArray(salesInfo.data) &&
    salesInfo.data.every(item =>
      typeof item === 'object' &&
      item !== null &&
      Object.keys(item).every(date =>
        typeof date === 'string' &&
        typeof item[date] === 'object' &&
        item[date] !== null &&
        Object.values(item[date]).every(value => typeof value === 'number')
      )
    )
  );
}


export type InfoBox = CompanyInfo | SalesInfo; // Extend this type as you add more info box types
