import { v4 } from 'uuid';
import { WidgetSource, WidgetType } from './widgets/types.ts'

type TableData = {
  id: string;
  symbol: string;
  name: string;
  latest: string;
  sector : string;
  CHG1: string;
  CHG2: string;
  date: string;
};




const portfolioData =  {
  heading: 'Portfolio Analysis',
  "data": [
    { 
      id: "1",
      sector: "Energy",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "2",
      sector: "Materials",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "3",
      sector: "Industrials",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "4",
      sector: "Consumer Discretionary",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "5",
      sector: "Consumer Staples",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "6",
      sector: "Healthcare",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "7",
      sector: "Financials",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "8",
      sector: "Information Technology",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "9",
      sector: "Communication Services",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "10",
      sector: "Cash",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    },
    {
      id: "11",
      sector: "Total",
      weight: "10.0%",
      portfolioReturn: "5.2%",
      benchmark: "4.8%",
      return: "2.0%",
      activeWeight: "2.0%",
      activeReturn: "0.5%",
      allocationEffect: "0.05%",
      selectionEffect: "-0.04%",
      currencyEffect: "0.01%",
      totalEffect: "0.10%",
      cashContribution: "0.01%",
      transactionCosts: "-0.02%",
      residual: "0.00%"
    }
  ],
  headers: [
    { key: "sector", header: "Bloomberg BClass Sector" },
    { key: "weight", header: "Weight (%)" },
    { key: "portfolioReturn", header: "Portfolio Return (%)" },
    { key: "benchmark", header: "Benchmark Return (%)" },
    { key: "return", header: "Return (%)" },
    { key: "activeWeight", header: "Active Weight (%)" },
    { key: "activeReturn", header: "Active Return (%)" },
    { key: "allocationEffect", header: "Allocation Effect (%)" },
    { key: "selectionEffect", header: "Selection Effect (%)" },
    { key: "currencyEffect", header: "Currency Effect (%)" },
    { key: "totalEffect", header: "Total Effect (%)" },
    { key: "cashContribution", header: "Cash Contribution (%)" },
    { key: "transactionCosts", header: "Transaction Costs (%)" },
    { key: "residual", header: "Residual (%)" }
  ]
};


// ASSET CLASS PAYLOAD

const performanceContribution: WidgetSource[] = [
  {
    i: v4(),
    x: 0,
    y: 0,
    w: 12,
    h: 5,
    key: v4(),
    data: "",
    type: WidgetType.DYNAMIC_CONTROL,
  },
  {
    i: v4(),
    x: 6,
    y: 0,
    w: 12,
    h: 16,
    key: v4(),
    data: portfolioData,
    type: WidgetType.PERFORMANCE_CONTROL,
  },
];

// MACRO RESEARCH PAYLOAD
const performanceRiskAlpha: WidgetSource[] = [
  {
    i: v4(),
    x: 0,
    y: 0,
    w: 12,
    h: 5,
    key: v4(),
    data: "",
    type: WidgetType.DYNAMIC_CONTROL,
  },
  {
    i: v4(),
    x: 6,
    y: 0,
    w: 12,
    h: 16,
    key: v4(),
    data: portfolioData,
    type: WidgetType.RISK_ANALYTICS,
  },
];

// Portfolio Research Payload
const performanceTaxAlpha = [
  {
    i: v4(),
    x: 0, 
    y: 0,
    w: 12,
    h: 5,
    key: v4(),
    data: "",
    type: WidgetType.DYNAMIC_CONTROL,
  },
  {
    i: v4(),
    x: 6,
    y: 0,
    w: 12,
    h: 16,
    key: v4(),
    type: WidgetType.TAX_ALPHA,
  },
];





export {
  performanceContribution,
  performanceTaxAlpha,
  performanceRiskAlpha,
}   