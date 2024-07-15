import React, { useState } from "react";
import { Tabs, Tab, TabList } from "@carbon/react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import TableWidget from "../../research/widgets/table.tsx";
import Control from "./control.tsx";
import { BarChart } from "../../research/widgets/charts/bar.tsx";

interface TableData {
    id: string;
    [key: string]: string;
  }
  

const riskAdjustedMetrics: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
    heading: 'Risk Adjusted Metrics',
    data: [
      {
        id: "1",
        metric: "Sharpe Ratio",
        portfolio: "1.2",
        benchmark: "1.0"
      },
      {
        id: "2",
        metric: "Information Ratio",
        portfolio: "0.8",
        benchmark: "-"
      },
      {
        id: "3",
        metric: "Tracking Error",
        portfolio: "2.5%",
        benchmark: "-"
      }
    ],
    headers: [
      { key: "metric", header: "Metric" },
      { key: "portfolio", header: "Portfolio" },
      { key: "benchmark", header: "Benchmark" }
    ]
  };
  
  // const riskDecomposition: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Risk Decomposition',
  //   data: [
  //     {
  //       id: "1",
  //       riskType: "Systematic Risk",
  //       percentage: "80%"
  //     },
  //     {
  //       id: "2",
  //       riskType: "Idiosyncratic Risk",
  //       percentage: "20%"
  //     }
  //   ],
  //   headers: [
  //     { key: "riskType", header: "Risk Type" },
  //     { key: "percentage", header: "Percentage" }
  //   ]
  // };
  
  // const peerGroupComparison: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Peer Group Comparison',
  //   data: [
  //     {
  //       id: "1",
  //       metric: "Performance",
  //       ranking: "2nd Quartile"
  //     },
  //     {
  //       id: "2",
  //       metric: "Risk Adjusted",
  //       ranking: "1st Quartile"
  //     }
  //   ],
  //   headers: [
  //     { key: "metric", header: "Metric" },
  //     { key: "ranking", header: "Ranking" }
  //   ]
  // };
  
  // const factorAnalysis: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Factor Analysis',
  //   data: [
  //     {
  //       id: "1",
  //       factor: "Market",
  //       exposure: "1.05"
  //     },
  //     {
  //       id: "2",
  //       factor: "Size (SMB)",
  //       exposure: "0.2"
  //     },
  //     {
  //       id: "3",
  //       factor: "Value (HML)",
  //       exposure: "-0.1"
  //     },
  //     {
  //       id: "4",
  //       factor: "Momentum (UMD)",
  //       exposure: "0.3"
  //     }
  //   ],
  //   headers: [
  //     { key: "factor", header: "Factor" },
  //     { key: "exposure", header: "Exposure (Beta)" }
  //   ]
  // };
  
  // const styleAnalysis: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Style Analysis',
  //   data: [
  //     {
  //       id: "1",
  //       styleFactor: "Value",
  //       weight: "35%"
  //     },
  //     {
  //       id: "2",
  //       styleFactor: "Growth",
  //       weight: "40%"
  //     },
  //     {
  //       id: "3",
  //       styleFactor: "Quality",
  //       weight: "15%"
  //     },
  //     {
  //       id: "4",
  //       styleFactor: "Momentum",
  //       weight: "10%"
  //     }
  //   ],
  //   headers: [
  //     { key: "styleFactor", header: "Style Factor" },
  //     { key: "weight", header: "Weight" }
  //   ]
  // };
  
  // const performancePersistence: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Performance Persistence',
  //   data: [
  //     {
  //       id: "1",
  //       timeFrame: "1-year Rolling",
  //       positiveAlpha: "65%"
  //     },
  //     {
  //       id: "2",
  //       timeFrame: "3-year Rolling",
  //       positiveAlpha: "75%"
  //     }
  //   ],
  //   headers: [
  //     { key: "timeFrame", header: "Time Frame" },
  //     { key: "positiveAlpha", header: "Positive Alpha" }
  //   ]
  // };
  
  // const multiFactorAttribution: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Multi-Factor Attribution',
  //   data: [
  //     {
  //       id: "1",
  //       factor: "Market",
  //       contribution: "60%"
  //     },
  //     {
  //       id: "2",
  //       factor: "Size",
  //       contribution: "15%"
  //     },
  //     {
  //       id: "3",
  //       factor: "Value",
  //       contribution: "20%"
  //     },
  //     {
  //       id: "4",
  //       factor: "Momentum",
  //       contribution: "5%"
  //     }
  //   ],
  //   headers: [
  //     { key: "factor", header: "Factor" },
  //     { key: "contribution", header: "Contribution" }
  //   ]
  // };
  
  // const exAnteVsExPostAnalysis: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Ex-ante Vs. Ex Post Analysis',
  //   data: [
  //     {
  //       id: "1",
  //       metric: "Expected Alpha",
  //       value: "1.2%"
  //     },
  //     {
  //       id: "2",
  //       metric: "Realized Alpha",
  //       value: "0.9%"
  //     }
  //   ],
  //   headers: [
  //     { key: "metric", header: "Metric" },
  //     { key: "value", header: "Value" }
  //   ]
  // };
  
  // const topBottomContributions: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Top/Bottom Contributions',
  //   data: [
  //     {
  //       id: "1",
  //       rank: "Top 1",
  //       stock: "Stock A",
  //       contribution: "+0.5%"
  //     },
  //     {
  //       id: "2",
  //       rank: "Top 2",
  //       stock: "Stock B",
  //       contribution: "+0.4%"
  //     },
  //     {
  //       id: "3",
  //       rank: "Top 3",
  //       stock: "Stock C",
  //       contribution: "+0.3%"
  //     },
  //     {
  //       id: "4",
  //       rank: "Bottom 3",
  //       stock: "Stock Z",
  //       contribution: "-0.1%"
  //     },
  //     {
  //       id: "5",
  //       rank: "Bottom 2",
  //       stock: "Stock Y",
  //       contribution: "-1.5%"
  //     },
  //     {
  //       id: "6",
  //       rank: "Bottom 1",
  //       stock: "Stock X",
  //       contribution: "-2.5%"
  //     }
  //   ],
  //   headers: [
  //     { key: "rank", header: "Rank" },
  //     { key: "stock", header: "Stock" },
  //     { key: "contribution", header: "Contribution" }
  //   ]
  // };
  
  // const scenarioAnalysis: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Scenario Analysis',
  //   data: [
  //     {
  //       id: "1",
  //       scenario: "Bull Market",
  //       portfolio: "+12%",
  //       benchmark: "+10%",
  //       difference: "+2%"
  //     },
  //     {
  //       id: "2",
  //       scenario: "Bear Market",
  //       portfolio: "+12%",
  //       benchmark: "+10%",
  //       difference: "+2%"
  //     },
  //     {
  //       id: "3",
  //       scenario: "High Volatility",
  //       portfolio: "+12%",
  //       benchmark: "+10%",
  //       difference: "+2%"
  //     }
  //   ],
  //   headers: [
  //     { key: "scenario", header: "Scenario" },
  //     { key: "portfolio", header: "Portfolio" },
  //     { key: "benchmark", header: "Benchmark" },
  //     { key: "difference", header: "Difference" }
  //   ]
  // };
  
  // const statisticalSignificance: { heading: string; data: TableData[]; headers: { key: string; header: string }[] } = {
  //   heading: 'Statistical Significance',
  //   data: [
  //     {
  //       id: "1",
  //       effect: "Allocation",
  //       confidenceLevel: "95%"
  //     },
  //     {
  //       id: "2",
  //       effect: "Selection",
  //       confidenceLevel: "90%"
  //     }
  //   ],
  //   headers: [
  //     { key: "effect", header: "Effect" },
  //     { key: "confidenceLevel", header: "Confidence Level" }
  //   ]
  // };
  
  

  const RiskAnalytics: React.FC = () => {

    
    // Initialize state to keep track of which tables are toggled
    const [tableStates, setTableStates] = useState(Array(13).fill(false));
    
    const handleTable = (index: number) => {
      // Toggle the specific table state
      const newTableStates = [...tableStates];
      newTableStates[index] = !newTableStates[index];
      setTableStates(newTableStates);
    };
    
    const tabData = [
      'Equities',
      'Fixed Income',
      'Multi-Asset',
    ];
  
    const [currentIndex, setCurrentIndex] = useState<number>(1);
  
    const handleTabChange = (index: number): void => {
      console.log(`Tab changed to index: ${index}`);
      setCurrentIndex(index + 1);
    };
  
    // Frequency dropdown values
    const frequencies = [
      { id: 'Annualy', text: 'Annualy' },
      { id: 'Quaterly', text: 'Quaterly' }
    ];
  
    const renderTables = (count: number) => {
      return (
        <div className="rishtablewrappwr">
          {Array.from({ length: count }).map((_, index) => (
            <div className="table-parent" key={index}>
              <div className="heading-wrapper-block">
                <h3>{riskAdjustedMetrics.heading}</h3>
                <Control handleTable={() => handleTable(index)} state={tableStates[index]} />
              </div>
              {
                tableStates[index] ? <BarChart /> : <TableWidget rows={riskAdjustedMetrics.data} headers={riskAdjustedMetrics.headers} convertType={false} />
              }
            </div>
          ))}
        </div>
      );
    };


    return (
      <div className="custom-table-row-container">
        <div className="research-screen-header">
          <Tabs
            selectedIndex={currentIndex - 1}
            onChange={(tabInfo) => handleTabChange(tabInfo.selectedIndex)}
          >
            <TabList
              aria-label="Financial Data Tabs"
              style={{ alignItems: "center" }}
            >
              {tabData.map((tab, index) => (
                <Tab
                  style={{ margin: "0 0.2rem 0", paddingBottom: "3px" }}
                  key={index}
                >
                  {tab}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
        <h2>Performance & Risk Analytics:</h2>
 {currentIndex === 1 ? renderTables(10) : renderTables(3)}        </div>
    );
  };
  
  export default RiskAnalytics;