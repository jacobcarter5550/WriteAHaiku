import { WidgetSource, WidgetType } from './widgets/types.ts'
import { v4 } from "uuid";


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



// mock data for asset class
const sectorPerformance : { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
    heading  : 'Sector Performance',
    subHeading  : 'Sector Index Performance (Q1 2022 - Q4 2022)',
    data: [
      {
        "id": "a",
        "sector": "Technology",
        "Q1 2022": "-8.9%",
        "Q2 2022": "-20.1%",
        "Q3 2022": "-5.4%",
        "Q4 2022": "4.7%"
      },
      {
        "id": "b",
        "sector": "Healthcare",
        "Q1 2022": "-3.2%",
        "Q2 2022": "-5.7%",
        "Q3 2022": "-3.0%",
        "Q4 2022": "5.8%"
      },
      {
        "id": "c",
        "sector": "Financials",
        "Q1 2022": "-1.7%",
        "Q2 2022": "-17.5%",
        "Q3 2022": "2.0%",
        "Q4 2022": "8.6%"
      },
      {
        "id": "d",
        "sector": "Consumer Goods",
        "Q1 2022": "-2.1%",
        "Q2 2022": "-10.7%",
        "Q3 2022": "-1.5%",
        "Q4 2022": "3.2%"
      }
    ],
    "headers": [
      {
        "key": "sector",
        "header": "Sector"
      },
      {
        "key": "Q1 2022",
        "header": "Q1 2022"
      },
      {
        "key": "Q2 2022",
        "header": "Q2 2022"
      },
      {
        "key": "Q3 2022",
        "header": "Q3 2022"
      },
      {
        "key": "Q4 2022",
        "header": "Q4 2022"
      }
    ]
}

const fixedIncomePerformance : { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  heading  : 'Fixed Performance',
  subHeading  : 'Fixed Index Performance (Q1 2022 - Q4 2022)',
  "data": [
    {
      "id": "a",
      "index": "Bloomberg US Agg Bond",
      "Jan 2022": "-2.1%",
      "Feb 2022": "-1.1%",
      "Mar 2022": "-2.8%",
      "Apr 2022": "-3.8%",
      "May 2022": "0.6%",
      "Jun 2022": "-1.6%",
      "Jul 2022": "2.4%",
      "Aug 2022": "-2.6%",
      "Sep 2022": "-4.3%",
      "Oct 2022": "-1.3%"
    },
    {
      "id": "b",
      "index": "Bloomberg Global Agg",
      "Jan 2022": "-1.8%",
      "Feb 2022": "-0.9%",
      "Mar 2022": "-2.4%",
      "Apr 2022": "-3.4%",
      "May 2022": "0.7%",
      "Jun 2022": "-1.3%",
      "Jul 2022": "2.5%",
      "Aug 2022": "-2.4%",
      "Sep 2022": "-4.1%",
      "Oct 2022": "-1.1%"
    },
    {
      "id": "c",
      "index": "Bloomberg High Yield",
      "Jan 2022": "-3.6%",
      "Feb 2022": "-1.0%",
      "Mar 2022": "-1.9%",
      "Apr 2022": "-3.6%",
      "May 2022": "0.2%",
      "Jun 2022": "-6.7%",
      "Jul 2022": "5.9%",
      "Aug 2022": "-2.3%",
      "Sep 2022": "-3.9%",
      "Oct 2022": "-2.0%"
    },
    {
      "id": "d",
      "index": "Bloomberg Muni Bond",
      "Jan 2022": "-2.7%",
      "Feb 2022": "-0.3%",
      "Mar 2022": "-3.2%",
      "Apr 2022": "-2.8%",
      "May 2022": "-0.6%",
      "Jun 2022": "-1.6%",
      "Jul 2022": "2.6%",
      "Aug 2022": "-2.3%",
      "Sep 2022": "-3.8%",
      "Oct 2022": "-0.9%"
    }
  ],
  "headers": [
    {
      "key": "index",
      "header": "Index"
    },
    {
      "key": "Jan 2022",
      "header": "Jan 2022"
    },
    {
      "key": "Feb 2022",
      "header": "Feb 2022"
    },
    {
      "key": "Mar 2022",
      "header": "Mar 2022"
    },
    {
      "key": "Apr 2022",
      "header": "Apr 2022"
    },
    {
      "key": "May 2022",
      "header": "May 2022"
    },
    {
      "key": "Jun 2022",
      "header": "Jun 2022"
    },
    {
      "key": "Jul 2022",
      "header": "Jul 2022"
    },
    {
      "key": "Aug 2022",
      "header": "Aug 2022"
    },
    {
      "key": "Sep 2022",
      "header": "Sep 2022"
    },
    {
      "key": "Oct 2022",
      "header": "Oct 2022"
    }
  ]
}

const votalityIndex : { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  heading  : 'Votality Index',
  subHeading  : 'Votality Index ( 2022 -  2022)',
  "data": [
    {
      "id": "a",
      "index": "VIX",
      "Jan 2022": "-2.1%",
      "Feb 2022": "-1.1%",
      "Mar 2022": "-2.8%",
      "Apr 2022": "-3.8%",
      "May 2022": "0.6%",
      "Jun 2022": "-1.6%",
      "Jul 2022": "2.4%",
      "Aug 2022": "-2.6%",
      "Sep 2022": "-4.3%",
      "Oct 2022": "-1.3%"
    },
    {
      "id": "b",
      "index": "VXN",
      "Jan 2022": "-1.8%",
      "Feb 2022": "-0.9%",
      "Mar 2022": "-2.4%",
      "Apr 2022": "-3.4%",
      "May 2022": "0.7%",
      "Jun 2022": "-1.3%",
      "Jul 2022": "2.5%",
      "Aug 2022": "-2.4%",
      "Sep 2022": "-4.1%",
      "Oct 2022": "-1.1%"
    },
    {
      "id": "c",
      "index": "RVX",
      "Jan 2022": "-3.6%",
      "Feb 2022": "-1.0%",
      "Mar 2022": "-1.9%",
      "Apr 2022": "-3.6%",
      "May 2022": "0.2%",
      "Jun 2022": "-6.7%",
      "Jul 2022": "5.9%",
      "Aug 2022": "-2.3%",
      "Sep 2022": "-3.9%",
      "Oct 2022": "-2.0%"
    },
  ],
  "headers": [
    {
      "key": "index",
      "header": "Index"
    },
    {
      "key": "Jan 2022",
      "header": "Jan 2022"
    },
    {
      "key": "Feb 2022",
      "header": "Feb 2022"
    },
    {
      "key": "Mar 2022",
      "header": "Mar 2022"
    },
    {
      "key": "Apr 2022",
      "header": "Apr 2022"
    },
    {
      "key": "May 2022",
      "header": "May 2022"
    },
    {
      "key": "Jun 2022",
      "header": "Jun 2022"
    },
    {
      "key": "Jul 2022",
      "header": "Jul 2022"
    },
    {
      "key": "Aug 2022",
      "header": "Aug 2022"
    },
    {
      "key": "Sep 2022",
      "header": "Sep 2022"
    },
    {
      "key": "Oct 2022",
      "header": "Oct 2022"
    }
  ]
}

const majorEquity : { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  heading  : 'Major Equity Indices',
  subHeading  : 'Major Equity Indices (Q1 2022 - Q4 2022)',
  "data": [
    {
      "id": "a",
      "index": "SAP500",
      "Jan 2022": "-2.1%",
      "Feb 2022": "-1.1%",
      "Mar 2022": "-2.8%",
      "Apr 2022": "-3.8%",
      "May 2022": "0.6%",
      "Jun 2022": "-1.6%",
      "Jul 2022": "2.4%",
      "Aug 2022": "-2.6%",
      "Sep 2022": "-4.3%",
      "Oct 2022": "-1.3%"
    },
    {
      "id": "b",
      "index": "NASDAQ 100",
      "Jan 2022": "-1.8%",
      "Feb 2022": "-0.9%",
      "Mar 2022": "-2.4%",
      "Apr 2022": "-3.4%",
      "May 2022": "0.7%",
      "Jun 2022": "-1.3%",
      "Jul 2022": "2.5%",
      "Aug 2022": "-2.4%",
      "Sep 2022": "-4.1%",
      "Oct 2022": "-1.1%"
    },
    {
      "id": "FTSE 100",
      "index": "RVX",
      "Jan 2022": "-3.6%",
      "Feb 2022": "-1.0%",
      "Mar 2022": "-1.9%",
      "Apr 2022": "-3.6%",
      "May 2022": "0.2%",
      "Jun 2022": "-6.7%",
      "Jul 2022": "5.9%",
      "Aug 2022": "-2.3%",
      "Sep 2022": "-3.9%",
      "Oct 2022": "-2.0%"
    },
  ],
  "headers": [
    {
      "key": "index",
      "header": "Index"
    },
    {
      "key": "Jan 2022",
      "header": "Jan 2022"
    },
    {
      "key": "Feb 2022",
      "header": "Feb 2022"
    },
    {
      "key": "Mar 2022",
      "header": "Mar 2022"
    },
    {
      "key": "Apr 2022",
      "header": "Apr 2022"
    },
    {
      "key": "May 2022",
      "header": "May 2022"
    },
    {
      "key": "Jun 2022",
      "header": "Jun 2022"
    },
    {
      "key": "Jul 2022",
      "header": "Jul 2022"
    },
    {
      "key": "Aug 2022",
      "header": "Aug 2022"
    },
    {
      "key": "Sep 2022",
      "header": "Sep 2022"
    },
    {
      "key": "Oct 2022",
      "header": "Oct 2022"
    }
  ]
}

const commodiyPrice : { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  heading  : 'Commodity Price',
  subHeading  : 'Commodity Price (Q1 2022 - Q4 2022)',
  "data": [
    {
      "id": "a",
      "index": "GOLD",
      "Jan 2022": "-2.1%",
      "Feb 2022": "-1.1%",
      "Mar 2022": "-2.8%",
      "Apr 2022": "-3.8%",
      "May 2022": "0.6%",
      "Jun 2022": "-1.6%",
      "Jul 2022": "2.4%",
      "Aug 2022": "-2.6%",
      "Sep 2022": "-4.3%",
      "Oct 2022": "-1.3%"
    },
    {
      "id": "b",
      "index": "Silver",
      "Jan 2022": "-1.8%",
      "Feb 2022": "-0.9%",
      "Mar 2022": "-2.4%",
      "Apr 2022": "-3.4%",
      "May 2022": "0.7%",
      "Jun 2022": "-1.3%",
      "Jul 2022": "2.5%",
      "Aug 2022": "-2.4%",
      "Sep 2022": "-4.1%",
      "Oct 2022": "-1.1%"
    },
    {
      "id": "Crude Oil",
      "index": "RVX",
      "Jan 2022": "-3.6%",
      "Feb 2022": "-1.0%",
      "Mar 2022": "-1.9%",
      "Apr 2022": "-3.6%",
      "May 2022": "0.2%",
      "Jun 2022": "-6.7%",
      "Jul 2022": "5.9%",
      "Aug 2022": "-2.3%",
      "Sep 2022": "-3.9%",
      "Oct 2022": "-2.0%"
    },
    {
      "id": "Copper",
      "index": "RVX",
      "Jan 2022": "-3.6%",
      "Feb 2022": "-1.0%",
      "Mar 2022": "-1.9%",
      "Apr 2022": "-3.6%",
      "May 2022": "0.2%",
      "Jun 2022": "-6.7%",
      "Jul 2022": "5.9%",
      "Aug 2022": "-2.3%",
      "Sep 2022": "-3.9%",
      "Oct 2022": "-2.0%"
    },
  ],
  "headers": [
    {
      "key": "index",
      "header": "Index"
    },
    {
      "key": "Jan 2022",
      "header": "Jan 2022"
    },
    {
      "key": "Feb 2022",
      "header": "Feb 2022"
    },
    {
      "key": "Mar 2022",
      "header": "Mar 2022"
    },
    {
      "key": "Apr 2022",
      "header": "Apr 2022"
    },
    {
      "key": "May 2022",
      "header": "May 2022"
    },
    {
      "key": "Jun 2022",
      "header": "Jun 2022"
    },
    {
      "key": "Jul 2022",
      "header": "Jul 2022"
    },
    {
      "key": "Aug 2022",
      "header": "Aug 2022"
    },
    {
      "key": "Sep 2022",
      "header": "Sep 2022"
    },
    {
      "key": "Oct 2022",
      "header": "Oct 2022"
    }
  ]
}

// mock data for macro research

const gdpGrowthRates = {
  heading: "GDP Growth Rates",
  subHeading: "Quarterly GDP Growth Rates (Q1 2022 - Q4 2022)",
  data: [
      {
          id: "a",
          country: "USA",
          "Q1 2022": "6.9%",
          "Q2 2022": "-1.6%",
          "Q3 2022": "-0.6%",
          "Q4 2022": "2.7%"
      },
      {
          id: "b",
          country: "China",
          "Q1 2022": "4.8%",
          "Q2 2022": "0.4%",
          "Q3 2022": "3.9%",
          "Q4 2022": "2.9%"
      },
      {
          id: "c",
          country: "Germany",
          "Q1 2022": "-0.3%",
          "Q2 2022": "0.1%",
          "Q3 2022": "0.4%",
          "Q4 2022": "0.3%"
      },
      {
          id: "d",
          country: "India",
          "Q1 2022": "4.1%",
          "Q2 2022": "12.7%",
          "Q3 2022": "6.3%",
          "Q4 2022": "4.4%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Q1 2022", header: "Q1 2022" },
      { key: "Q2 2022", header: "Q2 2022" },
      { key: "Q3 2022", header: "Q3 2022" },
      { key: "Q4 2022", header: "Q4 2022" }
  ]
};

const inflationRates = {
  heading: "Inflation Rates",
  subHeading: "Monthly Inflation Rates (Jan 2022 - Nov 2022)",
  data: [
      {
          id: "a",
          country: "USA",
          Jan: "7.5%",
          Feb: "7.9%",
          Mar: "8.5%",
          Apr: "8.3%",
          May: "8.6%",
          Jun: "9.1%",
          Jul: "8.5%",
          Aug: "8.3%",
          Sep: "8.2%",
          Oct: "7.7%",
          Nov: "7.1%"
      },
      {
          id: "b",
          country: "China",
          Jan: "0.9%",
          Feb: "0.9%",
          Mar: "1.5%",
          Apr: "2.1%",
          May: "2.1%",
          Jun: "2.5%",
          Jul: "2.7%",
          Aug: "2.5%",
          Sep: "2.8%",
          Oct: "2.1%",
          Nov: "1.6%"
      },
      {
          id: "c",
          country: "Germany",
          Jan: "4.9%",
          Feb: "5.1%",
          Mar: "5.9%",
          Apr: "7.4%",
          May: "7.9%",
          Jun: "7.6%",
          Jul: "7.5%",
          Aug: "7.9%",
          Sep: "10.0%",
          Oct: "10.4%",
          Nov: "10.0%"
      },
      {
          id: "d",
          country: "India",
          Jan: "6.0%",
          Feb: "6.1%",
          Mar: "7.0%",
          Apr: "7.8%",
          May: "7.0%",
          Jun: "7.0%",
          Jul: "6.7%",
          Aug: "7.0%",
          Sep: "7.4%",
          Oct: "6.8%",
          Nov: "5.9%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" },
      { key: "Oct", header: "Oct 2022" },
      { key: "Nov", header: "Nov 2022" }
  ]
};

const unemploymentRates = {
  heading: "Unemployment Rates",
  subHeading: "Monthly Unemployment Rates (Jan 2022 - Nov 2022)",
  data: [
      {
          id: "a",
          country: "USA",
          Jan: "4.0%",
          Feb: "3.8%",
          Mar: "3.6%",
          Apr: "3.6%",
          May: "3.6%",
          Jun: "3.6%",
          Jul: "3.5%",
          Aug: "3.7%",
          Sep: "3.5%",
          Oct: "3.7%",
          Nov: "3.6%"
      },
      {
          id: "b",
          country: "China",
          Jan: "5.1%",
          Feb: "5.1%",
          Mar: "5.8%",
          Apr: "6.1%",
          May: "5.9%",
          Jun: "5.5%",
          Jul: "5.4%",
          Aug: "5.3%",
          Sep: "5.5%",
          Oct: "5.5%",
          Nov: "5.7%"
      },
      {
          id: "c",
          country: "Germany",
          Jan: "3.1%",
          Feb: "3.2%",
          Mar: "3.1%",
          Apr: "3.0%",
          May: "2.9%",
          Jun: "2.8%",
          Jul: "2.8%",
          Aug: "2.8%",
          Sep: "2.8%",
          Oct: "2.9%",
          Nov: "2.9%"
      },
      {
          id: "d",
          country: "India",
          Jan: "7.2%",
          Feb: "8.1%",
          Mar: "7.6%",
          Apr: "7.6%",
          May: "7.5%",
          Jun: "7.3%",
          Jul: "7.2%",
          Aug: "7.1%",
          Sep: "7.0%",
          Oct: "7.3%",
          Nov: "7.2%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" },
      { key: "Oct", header: "Oct 2022" },
      { key: "Nov", header: "Nov 2022" }
  ]
};

const interestRates = {
  heading: "Central Bank Interest Rates",
  subHeading: "Monthly Central Bank Interest Rates (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          country: "USA (Fed)",
          Jan: "0.25%",
          Feb: "0.25%",
          Mar: "0.50%",
          Apr: "0.75%",
          May: "1.00%",
          Jun: "1.50%",
          Jul: "2.25%",
          Aug: "2.50%",
          Sep: "3.25%"
      },
      {
          id: "b",
          country: "Eurozone (ECB)",
          Jan: "0.00%",
          Feb: "0.00%",
          Mar: "0.00%",
          Apr: "0.00%",
          May: "0.00%",
          Jun: "0.00%",
          Jul: "0.00%",
          Aug: "0.50%",
          Sep: "1.25%"
      },
      {
          id: "c",
          country: "UK (BoE)",
          Jan: "0.25%",
          Feb: "0.50%",
          Mar: "0.75%",
          Apr: "1.00%",
          May: "1.25%",
          Jun: "1.50%",
          Jul: "1.75%",
          Aug: "2.00%",
          Sep: "2.25%"
      },
      {
          id: "d",
          country: "Japan (BoJ)",
          Jan: "-0.10%",
          Feb: "-0.10%",
          Mar: "-0.10%",
          Apr: "-0.10%",
          May: "-0.10%",
          Jun: "-0.10%",
          Jul: "-0.10%",
          Aug: "-0.10%",
          Sep: "-0.10%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};

const exchangeRates = {
  heading: "Currency Exchange Rates",
  subHeading: "Exchange Rates (USD Base) (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          currencyPair: "USD/EUR",
          Jan: "0.88",
          Feb: "0.89",
          Mar: "0.90",
          Apr: "0.92",
          May: "0.93",
          Jun: "0.95",
          Jul: "0.97",
          Aug: "0.99",
          Sep: "1.01"
      },
      {
          id: "b",
          currencyPair: "USD/JPY",
          Jan: "115.5",
          Feb: "116.0",
          Mar: "120.5",
          Apr: "125.0",
          May: "130.0",
          Jun: "135.0",
          Jul: "140.0",
          Aug: "142.0",
          Sep: "145.0"
      },
      {
          id: "c",
          currencyPair: "USD/GBP",
          Jan: "0.74",
          Feb: "0.75",
          Mar: "0.76",
          Apr: "0.77",
          May: "0.78",
          Jun: "0.79",
          Jul: "0.80",
          Aug: "0.81",
          Sep: "0.82"
      },
      {
          id: "d",
          currencyPair: "USD/CNY",
          Jan: "6.35",
          Feb: "6.40",
          Mar: "6.45",
          Apr: "6.50",
          May: "6.55",
          Jun: "6.60",
          Jul: "6.65",
          Aug: "6.70",
          Sep: "6.75"
      }
  ],
  headers: [
      { key: "currencyPair", header: "Currency Pair" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};


// mock data for portfolio research

const valueAtRiskPortfolio = {
  heading: 'Value at Risk',
  subHeading: 'Value at Risk (VaR)',
  data: [
    {
      id: 'a',
      portfolio: 'US Equities',
      '1 Day VaR (95%)': '-2.5%',
      '1 Day VaR (99%)': '-1.4%',
      '10 Day VaR (95%)': '-1.4%',
      '10 Day VaR (99%)': '-1.4%'
    },
    {
      id: 'b',
      portfolio: 'Global Bonds',
      '1 Day VaR (95%)': '-1.4%',
      '1 Day VaR (99%)': '-1.4%',
      '10 Day VaR (95%)': '-1.4%',
      '10 Day VaR (99%)': '-1.4%'
    },
    {
      id: 'c',
      portfolio: 'High Yield',
      '1 Day VaR (95%)': '-2.5%',
      '1 Day VaR (99%)': '-1.4%',
      '10 Day VaR (95%)': '-1.4%',
      '10 Day VaR (99%)': '-1.4%'
    },
    {
      id: 'd',
      portfolio: 'Muni Bonds',
      '1 Day VaR (95%)': '-2.5%',
      '1 Day VaR (99%)': '-1.4%',
      '10 Day VaR (95%)': '-1.4%',
      '10 Day VaR (99%)': '-1.4%'
    }
  ],
  headers: [
    { key: 'portfolio', header: 'Portfolio' },
    { key: '1 Day VaR (95%)', header: '1 Day VaR (95%)' },
    { key: '1 Day VaR (99%)', header: '1 Day VaR (99%)' },
    { key: '10 Day VaR (95%)', header: '10 Day VaR (95%)' },
    { key: '10 Day VaR (99%)', header: '10 Day VaR (99%)' }
  ]
};

const stressTestingScenarioAnalysis = {
  heading: 'Stress Testing and Scenario Analysis',
  subHeading: 'US Equities (%)',
  data: [
    {
      id: 'a',
      scenario: '2008 Financial Crisis',
      'US Equities (%)': '-56.4%'
    },
    {
      id: 'b',
      scenario: 'COVID-19 Shock',
      'US Equities (%)': '-34.1%'
    },
    {
      id: 'c',
      scenario: 'Interest Rate Spike',
      'US Equities (%)': '-15.2%'
    },
    {
      id: 'd',
      scenario: 'Inflation Surge',
      'US Equities (%)': '-12.4%'
    }
  ],
  headers: [
    { key: 'scenario', header: 'Scenario' },
    { key: 'US Equities (%)', header: 'US Equities (%)' }
  ]
};

const factorAnalysisPortfolio = {
  heading: 'Factor Analysis',
  subHeading: 'Scenario Analysis',
  data: [
    {
      id: 'a',
      marketBeta: 'US Equities',
      sizeFactor: '1.2',
      valueFactor: '0.5',
      momentumFactor: '0.2'
    },
    {
      id: 'b',
      marketBeta: 'Global Bonds',
      sizeFactor: '1.2',
      valueFactor: '0.5',
      momentumFactor: '0.2'
    },
    {
      id: 'c',
      marketBeta: 'High Yield',
      sizeFactor: '1.2',
      valueFactor: '0.5',
      momentumFactor: '0.2'
    },
    {
      id: 'd',
      marketBeta: 'Muni Bonds',
      sizeFactor: '1.2',
      valueFactor: '0.5',
      momentumFactor: '0.2'
    }
  ],
  headers: [
    { key: 'marketBeta', header: 'Market Beta' },
    { key: 'sizeFactor', header: 'Size Factor' },
    { key: 'valueFactor', header: 'Value Factor' },
    { key: 'momentumFactor', header: 'Momentum Factor' }
  ]
};

const alphaAndBetaSeparation = {
  heading: 'Alpha and Beta Separation',
  subHeading: 'Alpha and Beta (%)',
  data: [
    {
      id: 'a',
      portfolio: 'US Equities',
      alpha: '2.5%',
      beta: '1.2'
    },
    {
      id: 'b',
      portfolio: 'Global Bonds',
      alpha: '2.5%',
      beta: '1.2'
    },
    {
      id: 'c',
      portfolio: 'High Yield',
      alpha: '2.5%',
      beta: '1.2'
    },
    {
      id: 'd',
      portfolio: 'Muni Bonds',
      alpha: '2.5%',
      beta: '1.2'
    }
  ],
  headers: [
    { key: 'portfolio', header: 'Portfolio' },
    { key: 'alpha', header: 'Alpha (%)' },
    { key: 'beta', header: 'Beta (%)' }
  ]
};

const optimizationAlgorithms = {
  heading: 'Optimization Algorithms',
  subHeading: 'Expected Return, Expected Risk and Sharpe Ratio',
  data: [
    {
      id: 'a',
      portfolio: 'Optimized Port 1',
      'expectedReturn': '2.0%',
      'expectedRisk': '10.0%',
      'sharpeRatio': '0.8'
    },
    {
      id: 'b',
      portfolio: 'Optimized Port 2',
      'expectedReturn': '3.0%',
      'expectedRisk': '15.0%',
      'sharpeRatio': '0.9'
    },
    {
      id: 'c',
      portfolio: 'Optimized Port 3',
      'expectedReturn': '4.0%',
      'expectedRisk': '20.0%',
      'sharpeRatio': '1.0'
    },
    {
      id: 'd',
      portfolio: 'Optimized Port 4',
      'expectedReturn': '5.0%',
      'expectedRisk': '25.0%',
      'sharpeRatio': '1.1'
    }
  ],
  headers: [
    { key: 'portfolio', header: 'Portfolio' },
    { key: 'expectedReturn', header: 'Expected Return (%)' },
    { key: 'expectedRisk', header: 'Expected Risk (%)' },
    { key: 'sharpeRatio', header: 'Sharpe Ratio' }
  ]
};

const top10HoldingsBarChart = {
  heading: 'Top 10 Holdings Bar Chart',
  subHeading: 'Top 10 Holdings by Weight',
  data: [
    {
      id: 'a',
      holding: 'Apple (AAPL)',
      weight: '10%'
    },
    {
      id: 'b',
      holding: 'Microsoft (MSFT)',
      weight: '10%'
    },
    {
      id: 'c',
      holding: 'Amazon (AMZN)',
      weight: '10%'
    },
    {
      id: 'd',
      holding: 'Alphabet (GOOGL)',
      weight: '10%'
    },
    {
      id: 'e',
      holding: 'TESLA (TSLA)',
      weight: '10%'
    },
    {
      id: 'f',
      holding: 'NVIDIA (NVDA)',
      weight: '10%'
    },
    {
      id: 'g',
      holding: 'Berkshire Hathaway (BRK.B)',
      weight: '10%'
    },
    {
      id: 'h',
      holding: 'JPMorgan Chase (JPM)',
      weight: '10%'
    },
    {
      id: 'i',
      holding: 'Johnson & Johnson (JNJ)',
      weight: '10%'
    },
    {
      id: 'j',
      holding: 'UnitedHealth Group (UNH)',
      weight: '10%'
    }
  ],
  headers: [
    { key: 'holding', header: 'Holding' },
    { key: 'weight', header: 'Weight (%)' }
  ]
};

const portfolioPerformanceVsBenchmark = {
  heading: 'Portfolio Performance vs. Benchmark Line Chart',
  subHeading: 'Portfolio Return vs. Benchmark Return',
  data: [
    {
      id: 'a',
      date: '2023-01-01',
      'portfolioReturn': '2.5%',
      'benchmarkReturn': '-2.0%'
    },
    {
      id: 'b',
      date: '2023-02-01',
      'portfolioReturn': '2.5%',
      'benchmarkReturn': '-2.0%'
    },
    {
      id: 'c',
      date: '2023-03-01',
      'portfolioReturn': '2.5%',
      'benchmarkReturn': '-2.0%'
    },
    {
      id: 'd',
      date: '2023-04-01',
      'portfolioReturn': '2.5%',
      'benchmarkReturn': '-2.0%'
    }
  ],
  headers: [
    { key: 'date', header: 'Date' },
    { key: 'portfolioReturn', header: 'Portfolio Return (%)' },
    { key: 'benchmarkReturn', header: 'Benchmark Return (%)' }
  ]
};

const riskReturnScatterPlot = {
  heading: 'Risk Return Scatter Plot',
  subHeading: 'Risk vs. Return',
  data: [
    {
      id: 'a',
      holding: 'Apple (AAPL)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'b',
      holding: 'Microsoft (MSFT)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'c',
      holding: 'TESLA (TSLA)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'd',
      holding: 'Amazon (AMZN)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'e',
      holding: 'Alphabet (GOOGL)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'f',
      holding: 'NVIDIA (NVDA)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'g',
      holding: 'Alphabet (GOOGL)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'h',
      holding: 'Johnson & Johnson (JNJ)',
      return: '2.5%',
      risk: '-2.0%'
    },
    {
      id: 'i',
      holding: 'META (META)',
      return: '2.5%',
      risk: '-2.0%'
    }
  ],
  headers: [
    { key: 'holding', header: 'Holding' },
    { key: 'return', header: 'Return (%)' },
    { key: 'risk', header: 'Risk (%)' }
  ]
};

const regionalExposureMap = {
  heading: 'Regional Exposure Map',
  subHeading: 'Regional Exposure',
  data: [
    {
      id: 'a',
      region: 'North America',
      allocation: '60%'
    },
    {
      id: 'b',
      region: 'Europe',
      allocation: '25%'
    },
    {
      id: 'c',
      region: 'Asia Pacific',
      allocation: '15%'
    },
    {
      id: 'd',
      region: 'Latin America',
      allocation: '12%'
    },
    {
      id: 'e',
      region: 'Africa/Middle East',
      allocation: '2%'
    }
  ],
  headers: [
    { key: 'region', header: 'Region' },
    { key: 'allocation', header: 'Allocation (%)' }
  ]
};

const attributionAnalysisStackedBarChart = {
  heading: 'Attribution Analysis Stacked Bar Chart',
  subHeading: 'Sector Contribution to Return',
  data: [
    {
      id: 'a',
      sector: 'Technology',
      contributionToReturn: '10%'
    },
    {
      id: 'b',
      sector: 'United States',
      contributionToReturn: '10%'
    },
    {
      id: 'c',
      sector: 'Healthcare',
      contributionToReturn: '10%'
    },
    {
      id: 'd',
      sector: 'China',
      contributionToReturn: '10%'
    },
    {
      id: 'e',
      sector: 'Consumer Discretionary',
      contributionToReturn: '10%'
    }
  ],
  headers: [
    { key: 'sector', header: 'Sector' },
    { key: 'contributionToReturn', header: 'Contribution to Return (%)' }
  ]
};

const marketCapitalizationBreakdownPieChart = {
  heading: 'Market Capitalization Breakdown Pie Chart',
  subHeading: 'Market Cap Allocation',
  data: [
    {
      id: 'a',
      marketCap: 'Large Cap',
      allocation: '60%'
    },
    {
      id: 'b',
      marketCap: 'Mid Cap',
      allocation: '25%'
    },
    {
      id: 'c',
      marketCap: 'Small Cap',
      allocation: '15%'
    }
  ],
  headers: [
    { key: 'marketCap', header: 'Market Cap' },
    { key: 'allocation', header: 'Allocation (%)' }
  ]
};

const peRatioDistributionHistogram = {
  heading: 'P/E Ratio Distribution Histogram',
  subHeading: 'P/E Ratio Distribution',
  data: [
    {
      id: 'a',
      peRatioRange: '0-10',
      frequency: '10%'
    },
    {
      id: 'b',
      peRatioRange: '10-20',
      frequency: '10%'
    },
    {
      id: 'c',
      peRatioRange: '20-30',
      frequency: '10%'
    },
    {
      id: 'd',
      peRatioRange: '40+',
      frequency: '10%'
    }
  ],
  headers: [
    { key: 'peRatioRange', header: 'P/E Ratio Range' },
    { key: 'frequency', header: 'Frequency (%)' }
  ]
};

const dividendYieldComparisonChart = {
  heading: 'Dividend Yield Comparison Chart',
  subHeading: 'Dividend Yield (%) by Sector',
  data: [
    {
      id: 'a',
      sector: 'Portfolio',
      dividendYield: '5.7%'
    },
    {
      id: 'b',
      sector: 'Technology',
      dividendYield: '3.2%'
    },
    {
      id: 'c',
      sector: 'Healthcare',
      dividendYield: '1.6%'
    },
    {
      id: 'd',
      sector: 'Industrials',
      dividendYield: '0.7%'
    }
  ],
  headers: [
    { key: 'sector', header: 'Sector' },
    { key: 'dividendYield', header: 'Dividend Yield (%)' }
  ]
};

const earningsGrowthMomentumChart = {
  heading: 'Earnings Growth Momentum Chart',
  subHeading: 'Growth Rate (%) by Metric',
  data: [
    {
      id: 'a',
      metric: 'Revenue',
      growthRate: '5.7%'
    },
    {
      id: 'b',
      metric: 'Gross Profit',
      growthRate: '3.2%'
    },
    {
      id: 'c',
      metric: 'EBIT',
      growthRate: '1.6%'
    },
    {
      id: 'd',
      metric: 'Operating Income',
      growthRate: '0.7%'
    }
  ],
  headers: [
    { key: 'metric', header: 'Metric' },
    { key: 'growthRate', header: 'Growth Rate (%)' }
  ]
};

// mock data for equity research


const performanceAttribution = {
  heading: "Performace Attribution",
  subHeading: "Sector Performance (Q1 2022 - Q4 2022)",
  data: [
      {
          id: "a",
          country: "USA",
          "Q1 2022": "6.9%",
          "Q2 2022": "-1.6%",
          "Q3 2022": "-0.6%",
          "Q4 2022": "2.7%"
      },
      {
          id: "b",
          country: "China",
          "Q1 2022": "4.8%",
          "Q2 2022": "0.4%",
          "Q3 2022": "3.9%",
          "Q4 2022": "2.9%"
      },
      {
          id: "c",
          country: "Germany",
          "Q1 2022": "-0.3%",
          "Q2 2022": "0.1%",
          "Q3 2022": "0.4%",
          "Q4 2022": "0.3%"
      },
      {
          id: "d",
          country: "India",
          "Q1 2022": "4.1%",
          "Q2 2022": "12.7%",
          "Q3 2022": "6.3%",
          "Q4 2022": "4.4%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Q1 2022", header: "Q1 2022" },
      { key: "Q2 2022", header: "Q2 2022" },
      { key: "Q3 2022", header: "Q3 2022" },
      { key: "Q4 2022", header: "Q4 2022" }
  ]
};

const factorAnalysis = {
  heading: "Factor Analysis",
  subHeading: "Factor Analysis of Portfolio Return (Jan 2022 - Nov 2022)",
  data: [
      {
          id: "a",
          country: "USA",
          Jan: "7.5%",
          Feb: "7.9%",
          Mar: "8.5%",
          Apr: "8.3%",
          May: "8.6%",
          Jun: "9.1%",
          Jul: "8.5%",
          Aug: "8.3%",
          Sep: "8.2%",
          Oct: "7.7%",
          Nov: "7.1%"
      },
      {
          id: "b",
          country: "China",
          Jan: "0.9%",
          Feb: "0.9%",
          Mar: "1.5%",
          Apr: "2.1%",
          May: "2.1%",
          Jun: "2.5%",
          Jul: "2.7%",
          Aug: "2.5%",
          Sep: "2.8%",
          Oct: "2.1%",
          Nov: "1.6%"
      },
      {
          id: "c",
          country: "Germany",
          Jan: "4.9%",
          Feb: "5.1%",
          Mar: "5.9%",
          Apr: "7.4%",
          May: "7.9%",
          Jun: "7.6%",
          Jul: "7.5%",
          Aug: "7.9%",
          Sep: "10.0%",
          Oct: "10.4%",
          Nov: "10.0%"
      },
      {
          id: "d",
          country: "India",
          Jan: "6.0%",
          Feb: "6.1%",
          Mar: "7.0%",
          Apr: "7.8%",
          May: "7.0%",
          Jun: "7.0%",
          Jul: "6.7%",
          Aug: "7.0%",
          Sep: "7.4%",
          Oct: "6.8%",
          Nov: "5.9%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" },
      { key: "Oct", header: "Oct 2022" },
      { key: "Nov", header: "Nov 2022" }
  ]
};

const valueAtRisk = {
  heading: "Value At Risk (VaR)",
  subHeading: "VaR for various portfolios (Jan 2022 - Nov 2022)",
  data: [
      {
          id: "a",
          country: "USA",
          Jan: "4.0%",
          Feb: "3.8%",
          Mar: "3.6%",
          Apr: "3.6%",
          May: "3.6%",
          Jun: "3.6%",
          Jul: "3.5%",
          Aug: "3.7%",
          Sep: "3.5%",
          Oct: "3.7%",
          Nov: "3.6%"
      },
      {
          id: "b",
          country: "China",
          Jan: "5.1%",
          Feb: "5.1%",
          Mar: "5.8%",
          Apr: "6.1%",
          May: "5.9%",
          Jun: "5.5%",
          Jul: "5.4%",
          Aug: "5.3%",
          Sep: "5.5%",
          Oct: "5.5%",
          Nov: "5.7%"
      },
      {
          id: "c",
          country: "Germany",
          Jan: "3.1%",
          Feb: "3.2%",
          Mar: "3.1%",
          Apr: "3.0%",
          May: "2.9%",
          Jun: "2.8%",
          Jul: "2.8%",
          Aug: "2.8%",
          Sep: "2.8%",
          Oct: "2.9%",
          Nov: "2.9%"
      },
      {
          id: "d",
          country: "India",
          Jan: "7.2%",
          Feb: "8.1%",
          Mar: "7.6%",
          Apr: "7.6%",
          May: "7.5%",
          Jun: "7.3%",
          Jul: "7.2%",
          Aug: "7.1%",
          Sep: "7.0%",
          Oct: "7.3%",
          Nov: "7.2%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" },
      { key: "Oct", header: "Oct 2022" },
      { key: "Nov", header: "Nov 2022" }
  ]
};

const alphSepration = {
  heading: "Alpha and Beta Sepration",
  subHeading: "Alpha and Beta Returns (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          country: "USA (Fed)",
          Jan: "0.25%",
          Feb: "0.25%",
          Mar: "0.50%",
          Apr: "0.75%",
          May: "1.00%",
          Jun: "1.50%",
          Jul: "2.25%",
          Aug: "2.50%",
          Sep: "3.25%"
      },
      {
          id: "b",
          country: "Eurozone (ECB)",
          Jan: "0.00%",
          Feb: "0.00%",
          Mar: "0.00%",
          Apr: "0.00%",
          May: "0.00%",
          Jun: "0.00%",
          Jul: "0.00%",
          Aug: "0.50%",
          Sep: "1.25%"
      },
      {
          id: "c",
          country: "UK (BoE)",
          Jan: "0.25%",
          Feb: "0.50%",
          Mar: "0.75%",
          Apr: "1.00%",
          May: "1.25%",
          Jun: "1.50%",
          Jul: "1.75%",
          Aug: "2.00%",
          Sep: "2.25%"
      },
      {
          id: "d",
          country: "Japan (BoJ)",
          Jan: "-0.10%",
          Feb: "-0.10%",
          Mar: "-0.10%",
          Apr: "-0.10%",
          May: "-0.10%",
          Jun: "-0.10%",
          Jul: "-0.10%",
          Aug: "-0.10%",
          Sep: "-0.10%"
      }
  ],
  headers: [
      { key: "country", header: "Country" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};

const sectorWeight = {
  heading: "Sector Weights",
  subHeading: "Sector Weights (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          currencyPair: "USD/EUR",
          Jan: "0.88",
          Feb: "0.89",
          Mar: "0.90",
          Apr: "0.92",
          May: "0.93",
          Jun: "0.95",
          Jul: "0.97",
          Aug: "0.99",
          Sep: "1.01"
      },
      {
          id: "b",
          currencyPair: "USD/JPY",
          Jan: "115.5",
          Feb: "116.0",
          Mar: "120.5",
          Apr: "125.0",
          May: "130.0",
          Jun: "135.0",
          Jul: "140.0",
          Aug: "142.0",
          Sep: "145.0"
      },
      {
          id: "c",
          currencyPair: "USD/GBP",
          Jan: "0.74",
          Feb: "0.75",
          Mar: "0.76",
          Apr: "0.77",
          May: "0.78",
          Jun: "0.79",
          Jul: "0.80",
          Aug: "0.81",
          Sep: "0.82"
      },
      {
          id: "d",
          currencyPair: "USD/CNY",
          Jan: "6.35",
          Feb: "6.40",
          Mar: "6.45",
          Apr: "6.50",
          May: "6.55",
          Jun: "6.60",
          Jul: "6.65",
          Aug: "6.70",
          Sep: "6.75"
      }
  ],
  headers: [
      { key: "currencyPair", header: "Currency Pair" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};

const dvidentAnalysis = {
  heading: "Dividend Yield Analysis",
  subHeading: "Dividend Yield by Sector (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          currencyPair: "USD/EUR",
          Jan: "0.88",
          Feb: "0.89",
          Mar: "0.90",
          Apr: "0.92",
          May: "0.93",
          Jun: "0.95",
          Jul: "0.97",
          Aug: "0.99",
          Sep: "1.01"
      },
      {
          id: "b",
          currencyPair: "USD/JPY",
          Jan: "115.5",
          Feb: "116.0",
          Mar: "120.5",
          Apr: "125.0",
          May: "130.0",
          Jun: "135.0",
          Jul: "140.0",
          Aug: "142.0",
          Sep: "145.0"
      },
      {
          id: "c",
          currencyPair: "USD/GBP",
          Jan: "0.74",
          Feb: "0.75",
          Mar: "0.76",
          Apr: "0.77",
          May: "0.78",
          Jun: "0.79",
          Jul: "0.80",
          Aug: "0.81",
          Sep: "0.82"
      },
      {
          id: "d",
          currencyPair: "USD/CNY",
          Jan: "6.35",
          Feb: "6.40",
          Mar: "6.45",
          Apr: "6.50",
          May: "6.55",
          Jun: "6.60",
          Jul: "6.65",
          Aug: "6.70",
          Sep: "6.75"
      }
  ],
  headers: [
      { key: "currencyPair", header: "Currency Pair" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};

const priceToEarning = {
  heading: "Price to Earning Ratio Analysis",
  subHeading: "Price to Earning (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          currencyPair: "USD/EUR",
          Jan: "0.88",
          Feb: "0.89",
          Mar: "0.90",
          Apr: "0.92",
          May: "0.93",
          Jun: "0.95",
          Jul: "0.97",
          Aug: "0.99",
          Sep: "1.01"
      },
      {
          id: "b",
          currencyPair: "USD/JPY",
          Jan: "115.5",
          Feb: "116.0",
          Mar: "120.5",
          Apr: "125.0",
          May: "130.0",
          Jun: "135.0",
          Jul: "140.0",
          Aug: "142.0",
          Sep: "145.0"
      },
      {
          id: "c",
          currencyPair: "USD/GBP",
          Jan: "0.74",
          Feb: "0.75",
          Mar: "0.76",
          Apr: "0.77",
          May: "0.78",
          Jun: "0.79",
          Jul: "0.80",
          Aug: "0.81",
          Sep: "0.82"
      },
      {
          id: "d",
          currencyPair: "USD/CNY",
          Jan: "6.35",
          Feb: "6.40",
          Mar: "6.45",
          Apr: "6.50",
          May: "6.55",
          Jun: "6.60",
          Jul: "6.65",
          Aug: "6.70",
          Sep: "6.75"
      }
  ],
  headers: [
      { key: "currencyPair", header: "Currency Pair" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};

const earningGrowth = {
  heading: "Earning Growth Analysis",
  subHeading: "Earning Growth by Sector (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          currencyPair: "USD/EUR",
          Jan: "0.88",
          Feb: "0.89",
          Mar: "0.90",
          Apr: "0.92",
          May: "0.93",
          Jun: "0.95",
          Jul: "0.97",
          Aug: "0.99",
          Sep: "1.01"
      },
      {
          id: "b",
          currencyPair: "USD/JPY",
          Jan: "115.5",
          Feb: "116.0",
          Mar: "120.5",
          Apr: "125.0",
          May: "130.0",
          Jun: "135.0",
          Jul: "140.0",
          Aug: "142.0",
          Sep: "145.0"
      },
      {
          id: "c",
          currencyPair: "USD/GBP",
          Jan: "0.74",
          Feb: "0.75",
          Mar: "0.76",
          Apr: "0.77",
          May: "0.78",
          Jun: "0.79",
          Jul: "0.80",
          Aug: "0.81",
          Sep: "0.82"
      },
      {
          id: "d",
          currencyPair: "USD/CNY",
          Jan: "6.35",
          Feb: "6.40",
          Mar: "6.45",
          Apr: "6.50",
          May: "6.55",
          Jun: "6.60",
          Jul: "6.65",
          Aug: "6.70",
          Sep: "6.75"
      }
  ],
  headers: [
      { key: "currencyPair", header: "Currency Pair" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};

const marketCapBreakdown = {
  heading: "Market Capitalization Breakdown",
  subHeading: "Market Cap Breakdown (Jan 2022 - Sep 2022)",
  data: [
      {
          id: "a",
          currencyPair: "USD/EUR",
          Jan: "0.88",
          Feb: "0.89",
          Mar: "0.90",
          Apr: "0.92",
          May: "0.93",
          Jun: "0.95",
          Jul: "0.97",
          Aug: "0.99",
          Sep: "1.01"
      },
      {
          id: "b",
          currencyPair: "USD/JPY",
          Jan: "115.5",
          Feb: "116.0",
          Mar: "120.5",
          Apr: "125.0",
          May: "130.0",
          Jun: "135.0",
          Jul: "140.0",
          Aug: "142.0",
          Sep: "145.0"
      },
      {
          id: "c",
          currencyPair: "USD/GBP",
          Jan: "0.74",
          Feb: "0.75",
          Mar: "0.76",
          Apr: "0.77",
          May: "0.78",
          Jun: "0.79",
          Jul: "0.80",
          Aug: "0.81",
          Sep: "0.82"
      },
      {
          id: "d",
          currencyPair: "USD/CNY",
          Jan: "6.35",
          Feb: "6.40",
          Mar: "6.45",
          Apr: "6.50",
          May: "6.55",
          Jun: "6.60",
          Jul: "6.65",
          Aug: "6.70",
          Sep: "6.75"
      }
  ],
  headers: [
      { key: "currencyPair", header: "Currency Pair" },
      { key: "Jan", header: "Jan 2022" },
      { key: "Feb", header: "Feb 2022" },
      { key: "Mar", header: "Mar 2022" },
      { key: "Apr", header: "Apr 2022" },
      { key: "May", header: "May 2022" },
      { key: "Jun", header: "Jun 2022" },
      { key: "Jul", header: "Jul 2022" },
      { key: "Aug", header: "Aug 2022" },
      { key: "Sep", header: "Sep 2022" }
  ]
};


// ASSET CLASS PAYLOAD

const assetPayload: WidgetSource[] = [
  {
    i: v4(),
    x: 0,
    y: 0,
    w: 6,
    h: 7,       
    key: v4(),
    data: sectorPerformance,
    type: WidgetType.TABLE,
    chartType : "stackedBar"
  },
  {
    i: v4(),
    
    x: 6,
    y: 0,
    w: 6,
    h: 7,       
    key: v4(),
    data: fixedIncomePerformance,
    type: WidgetType.TABLE,
    chartType : "lineChart"
  },
  {
    i: v4(),
    
    x: 0,
    y: 14,
    w: 12,
    h: 7,       
    key: v4(),
    data: votalityIndex,
    type: WidgetType.TABLE,
    chartType : "lineChart"
  },
  {
    i: v4(),
    
    x: 0,
    y: 7,
    w: 6,
    h: 7,       
    key: v4(),
    data: majorEquity,
    type: WidgetType.TABLE,
    chartType : "lineChart"
  },
  {
    i: v4(),
    
    x: 6,
    y: 7,
    w: 6,
    h: 7,       
    key: v4(),
    service : '/research/commodities/all',
    data: commodiyPrice,
    type: WidgetType.TABLE,
    chartType : "barChart"
  },
];

// MACRO RESEARCH PAYLOAD
const macroResearchPayload: WidgetSource[] = [
  {
    i: v4(),
    x: 0,
    y: 0,
    w: 6,
    h: 7,       
    key: v4(),
    data: gdpGrowthRates,
    type: WidgetType.TABLE,
    chartType : "lineChart"
  },
  {
    i: v4(),
    service : "http://localhost:5000/table",
    x: 6,
    y: 0,
    w: 6,
    h: 7,       
    key: v4(),
    data: inflationRates,
    type: WidgetType.TABLE,
    chartType : "lineChart"
  },
  {
    i: v4(),
    service : "http://localhost:5000/table",
    x: 0,
    y: 14,
    w: 12,
    h: 7,       
    key: v4(),
    data: unemploymentRates,
    type: WidgetType.TABLE,
    chartType : "lineChart"
  },
  {
    i: v4(),
    service : "http://localhost:5000/table",
    x: 0,
    y: 7,
    w: 6,
    h: 7,       
    key: v4(),
    data: interestRates,
    type: WidgetType.TABLE,
    chartType : "lineChart"
  },
  {
    i: v4(),
    service : "http://localhost:5000/table",
    x: 6,
    y: 7,
    w: 6,
    h: 7,       
    key: v4(),
    data: exchangeRates,
    type: WidgetType.TABLE,
    chartType : "barChart"
  },
];

// Portfolio Research Payload
const portfolioResearchPayload = [
  {
    i: v4(),
    x: 0,
    y: 0,
    w: 4,
    h: 7,
    key: v4(),
    data: valueAtRiskPortfolio,
    type: WidgetType.TABLE,
    chartType: "barChart" // Updated to bar chart based on the document
  },
  {
    i: v4(),
    x: 4,
    y: 0,
    w: 4,
    h: 7,
    key: v4(),
    data: stressTestingScenarioAnalysis,
    type: WidgetType.TABLE,
    chartType: "stackedBar" 
  },
  {
    i: v4(),
    x: 8,
    y: 0,
    w: 4,
    h: 7,
    key: v4(),
    data: factorAnalysisPortfolio,
    type: WidgetType.TABLE,
    chartType: "lineChart" 
  },
  {
    i: v4(),
    x: 0,
    y: 7,
    w: 4,
    h: 7,
    key: v4(),
    data: alphaAndBetaSeparation,
    type: WidgetType.TABLE,
    chartType: "barChart" 
  },
  {
    i: v4(),
    x: 4,
    y: 7,
    w: 4,
    h: 7,
    key: v4(),
    data: optimizationAlgorithms,
    type: WidgetType.TABLE,
    chartType: "scatterPlot" 
  },
  {
    i: v4(),
    x: 8,
    y: 7,
    w: 4,
  h: 7,
    key: v4(),
    data: optimizationAlgorithms,
    type: WidgetType.TABLE,
    chartType: "lineChart" 
  },
  {
    i: v4(),
    x: 0,
    y: 14,
    w: 4,
    h: 7,
    key: v4(),
    data: top10HoldingsBarChart,
    type: WidgetType.TABLE,
    chartType: "barChart" 
  },
  {
    i: v4(),
    x: 4,
    y: 14,
    w: 4,
    h: 7,
    key: v4(),
    data: portfolioPerformanceVsBenchmark,
    type: WidgetType.TABLE,
    chartType: "lineChart" 
  },
  {
    i: v4(),
    x: 8,
    y: 14,
    w: 4,
    h: 7,
    key: v4(),
    data: riskReturnScatterPlot,
    type: WidgetType.TABLE,
    chartType: "scatterPlot" 
  },
  {
    i: v4(),
    x: 0,
    y: 21,
    w: 4,
    h: 7,
    key: v4(),
    data: attributionAnalysisStackedBarChart,
    type: WidgetType.TABLE,
    chartType: "stackedBar" 
  },
  {
    i: v4(),
    x: 4,
    y: 21,
    w: 4,
    h: 7,
    key: v4(),
    data: marketCapitalizationBreakdownPieChart,
    type: WidgetType.TABLE,
    chartType: "piechart" 
  },
  {
    i: v4(),
    x: 8,
    y: 21,
    w: 4,
    h: 7,
    key: v4(),
    data: peRatioDistributionHistogram,
    type: WidgetType.TABLE,
    chartType: "histogram" 
  },
  {
    i: v4(),
    x: 0,
    y: 28,
    w: 4,
    h: 7,
    key: v4(),
    data: dividendYieldComparisonChart,
    type: WidgetType.TABLE,
    chartType: "barChart" 
  },
  {
    i: v4(),
    x: 4,
    y: 28,
    w: 4,
    h: 7,
    key: v4(),
    data: earningsGrowthMomentumChart,
    type: WidgetType.TABLE,
    chartType: "lineChart" 
  },
  {
    i: v4(),
    x: 8,
    y: 28,
    w: 4,
    h: 7,
    key: v4(),
    data: regionalExposureMap,
    type: WidgetType.TABLE,
    chartType: "map" 
  }
];


// MACRO RESEARCH PAYLOAD
const equityResearchPayload: WidgetSource[] = [
  {
    i: v4(),
    service : "http://localhost:5000/table",
    x: 0,
    y: 0,
    w: 4,
    h: 2,       
    key: v4(),
    data: performanceAttribution,
    type: WidgetType.TAB,
    chartType : "stackedBar"
  },
];



// Payloads
// const portfolioResearchPayload = [
//   {
//     i: v4(),
//     x: 0,
//     y: 0,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: valueAtRiskPortfolio,
//     type: WidgetType.TABLE,
//     chartType: "barChart" // Updated to bar chart based on the document
//   },
//   {
//     i: v4(),
//     x: 6,
//     y: 0,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: stressTestingScenarioAnalysis,
//     type: WidgetType.TABLE,
//     chartType: "stackedBar" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 14,
//     w: 12,
//     h: 7,
//     key: v4(),
//     data: factorAnalysisPortfolio,
//     type: WidgetType.TABLE,
//     chartType: "lineChart" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 7,
//     w: 12,
//     h: 7,
//     key: v4(),
//     data: alphaAndBetaSeparation,
//     type: WidgetType.TABLE,
//     chartType: "barChart" 
//   },
//   {
//     i: v4(),
//     x: 6,
//     y: 7,
//     w: 12,
//     h: 7,
//     key: v4(),
//     data: optimizationAlgorithms,
//     type: WidgetType.TABLE,
//     chartType: "scatterPlot" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 21,
//     w: 12,
//     h: 7,
//     key: v4(),
//     data: top10HoldingsBarChart,
//     type: WidgetType.TABLE,
//     chartType: "barChart" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 28,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: portfolioPerformanceVsBenchmark,
//     type: WidgetType.TABLE,
//     chartType: "lineChart" 
//   },
//   {
//     i: v4(),
//     x: 6,
//     y: 28,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: riskReturnScatterPlot,
//     type: WidgetType.TABLE,
//     chartType: "scatterPlot" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 35,
//     w: 12,
//     h: 7,
//     key: v4(),
//     data: regionalExposureMap,
//     type: WidgetType.TABLE,
//     chartType: "map" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 42,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: attributionAnalysisStackedBarChart,
//     type: WidgetType.TABLE,
//     chartType: "stackedBar" 
//   },
//   {
//     i: v4(),
//     x: 6,
//     y: 42,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: marketCapitalizationBreakdownPieChart,
//     type: WidgetType.TABLE,
//     chartType: "piechart" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 0,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: peRatioDistributionHistogram,
//     type: WidgetType.TABLE,
//     chartType: "histogram" 
//   },
//   {
//     i: v4(),
//     x: 6,
//     y: 0,
//     w: 6,
//     h: 7,
//     key: v4(),
//     data: dividendYieldComparisonChart,
//     type: WidgetType.TABLE,
//     chartType: "barChart" 
//   },
//   {
//     i: v4(),
//     x: 0,
//     y: 7,
//     w: 12,
//     h: 7,
//     key: v4(),
//     data: earningsGrowthMomentumChart,
//     type: WidgetType.TABLE,
//     chartType: "lineChart" 
//   }
// ];




export {
    assetPayload,
    macroResearchPayload,
    equityResearchPayload,
    portfolioResearchPayload
}   