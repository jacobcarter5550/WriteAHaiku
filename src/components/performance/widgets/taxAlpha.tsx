import React, { useState } from "react";
import { Tabs, Tab, TabList } from "@carbon/react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import TableWidget from "../../research/widgets/table.tsx";
import Control from "./control.tsx";
import { BarChart } from "./charts/bar.tsx";


const performanceTaxAlpha = {
    heading: 'Performance (Tax Alpha)',
    data: [
      {
        id: "1",
        metric: "Pre-Tax Return",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "2",
        metric: "After-Tax Return",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "3",
        metric: "Tax Cost",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "4",
        metric: "Tax Efficiency Ratio",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "5",
        metric: "Realized Capital Gains",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "6",
        metric: "-Short-Term Gains",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "7",
        metric: "-Long-Term Gains",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "8",
        metric: "Dividend Income",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "9",
        metric: "Interest Income",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "10",
        metric: "Tax Loss Harvesting Benefit",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "11",
        metric: "Asset Location Benefit",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "12",
        metric: "Turnover",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "13",
        metric: "Tracking error vs. Benchmark",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "14",
        metric: "Risk Adjusted after Tax Return",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      },
      {
        id: "15",
        metric: "Tax Alpha/Active Risk",
        baselinePortfolio: "10.0%",
        taxSmartPortfolio: "10.0%",
        taxAlpha: "10.0%"
      }
    ],
    headers: [
      { key: "metric", header: "Metric" },
      { key: "baselinePortfolio", header: "Baseline Portfolio (%)" },
      { key: "taxSmartPortfolio", header: "Tax-Smart Portfolio (%)" },
      { key: "taxAlpha", header: "Tax Alpha (%)" }
    ]
  };

  
  

const TaxAlpha: React.FC = () => {


  const [tableStates, setTableStates] = useState(false);


    return (
        <div className="custom-table-row-container">
            <div className="table-parent">
                <div className="heading-wrapper-block">
                    <h3>{performanceTaxAlpha.heading}</h3>
                    <Control handleTable={() => setTableStates(!tableStates)} state={tableStates} />
                </div>
                {
                    tableStates? <BarChart/> : <TableWidget rows={performanceTaxAlpha.data} headers={performanceTaxAlpha.headers} convertType={false} />

                  } 
              </div>
        </div>
    );
};

export default TaxAlpha;
