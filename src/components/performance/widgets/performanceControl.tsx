import React, { useState } from "react";
import { Tabs, Tab, TabList } from "@carbon/react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import TableWidget from "../../research/widgets/table.tsx";
import { DatePicker, Theme } from "@carbon/react";
import { DatePickerInput } from "@carbon/react";
import Control from "./control.tsx";
import { BarChart } from "../../research/widgets/charts/bar.tsx";


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

  

const PerformanceControl: React.FC = () => {

    const tabData = [
        'Equities',
        'Fixed Income',
        'Multi-Asset',
    ];

    const [tableStates, setTableStates] = useState(false);


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
                <h2>Performance Contribution and Attribution:</h2>
                <div className="dropdown-flex-wrapper">
                    {
                        currentIndex == 2 || currentIndex == 3 ?
                        <>
                            <div className="parent-block">
                                <CustomDropdown inline items={frequencies} label={"Benchmark"} />
                                 <img src="/move.svg"/>
                            </div>
                            <div className="parent-block">
                                <CustomDropdown inline items={frequencies} label={"Asset Class"} />
                                <img src="/move.svg"/>
                            </div>
                    </>
                     : 
                     <>
                        <div className="parent-block">
                            <CustomDropdown inline items={frequencies} label={"Benchmark"} />
                            <img src="/move.svg"/>

                        </div>
                        <div className="parent-block">
                            <CustomDropdown inline items={frequencies} label={"Sector Model"} />
                            <img src="/move.svg"/>

                        </div>
                        <div className="parent-block">
                            <CustomDropdown inline items={frequencies} label={"Style Analysis"} />
                            <img src="/move.svg"/>

                        </div>
                        <div className="parent-block">
                            <CustomDropdown inline items={frequencies} label={"Factor Model"} />
                            <img src="/move.svg"/>

                        </div>  
                     </>
                    }
            </div>
            <div className="table-parent">
                  <div className="heading-wrapper-block">
                    <h3>{portfolioData.heading}</h3>
                    <Control handleTable={() => setTableStates(!tableStates)} state={tableStates} />
                  </div>
                  {
                    tableStates? <BarChart/> : <TableWidget rows={portfolioData.data} headers={portfolioData.headers} convertType={false} />

                  } 
              </div>
        </div>
    );
};

export default PerformanceControl;
