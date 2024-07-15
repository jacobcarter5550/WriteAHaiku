import React from "react";
import BarGrouped from "./barGrouped.tsx";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import BarStacked from "./barStacked.tsx";
import LineChartComponent from "./lineChartComponent.tsx";

function AnalysisCharts() {
  const data1 = [
    {
      group: "Dataset 1",
      key: "Qty",
      value: 650,
    },
    {
      group: "Dataset 1",
      key: "More",
      value: -293,
    },
    {
      group: "Dataset 1",
      key: "Sold",
      value: -313,
    },
    {
      group: "Dataset 1",
      key: "Restocking",
      value: 513,
    },
    {
      group: "Dataset 1",
      key: "Misc",
      value: 132,
    },
    {
      group: "Dataset 2",
      key: "Qty",
      value: 332,
    },
    {
      group: "Dataset 2",
      key: "More",
      value: -212,
    },
    {
      group: "Dataset 2",
      key: "Sold",
      value: -566,
    },
    {
      group: "Dataset 2",
      key: "Restocking",
      value: -212,
    },
    {
      group: "Dataset 2",
      key: "Misc",
      value: 334,
    },
    {
      group: "Dataset 3",
      key: "Qty",
      value: -112,
    },
    {
      group: "Dataset 3",
      key: "More",
      value: 232,
    },
    {
      group: "Dataset 3",
      key: "Sold",
      value: 332,
    },
    {
      group: "Dataset 3",
      key: "Restocking",
      value: -112,
    },
    {
      group: "Dataset 3",
      key: "Misc",
      value: -334,
    },
    {
      group: "Dataset 4",
      key: "Qty",
      value: -323,
    },
    {
      group: "Dataset 4",
      key: "More",
      value: 213,
    },
    {
      group: "Dataset 4",
      key: "Sold",
      value: 643,
    },
    {
      group: "Dataset 4",
      key: "Restocking",
      value: 244,
    },
    {
      group: "Dataset 4",
      key: "Misc",
      value: 234,
    },
  ];
  return (
    <div className="analysis-container">
      <div className="bar-grouped-container">
        <div className="header-bar">
          <div className="bar-grouped-title">Factor Analysis</div>
          <CustomDropdown inline items={[]} label={"Value"} />
          <CustomDropdown inline items={[]} label={"Gain/Loss"} />
          <CustomDropdown inline items={[]} label={"2024 Q1"} />
        </div>
        <div className="bar-grouped-text">
          Factors ended Q4 relatively well, as gains in equity factors offset
          losses in macro momentum
        </div>
        <div className="bar-grouped-text-two">
          Exhibit 1: Quantitive solutions long/short factor returns
        </div>
        <BarGrouped data={data1} />
      </div>

      <div className="bar-grouped-container">
        <div className="header-bar">
          <div className="bar-grouped-title">Equity Analysis</div>
          <CustomDropdown
            inline
            items={[]}
            label={"Thesis: multiple expansion"}
          />
          <CustomDropdown inline items={[]} label={"2024 Q1"} />
        </div>
        <div className="bar-grouped-text">
          Multiple expansion was a tailwind in 2023, while fundamentals have
          driven global equity returns since 2019
        </div>
        <div className="bar-grouped-text-two">
          1A: Index return decomposition 2023 & 1B: Index return decompositions
          2020-2023
        </div>
        <div className="bar-stacked-container">
          {" "}
          <BarStacked />
          <BarStacked />
        </div>
      </div>
      <div className="bar-grouped-container">
        <div className="header-bar">
          <div className="bar-grouped-title">Fixed Income Analysis</div>
          <CustomDropdown
            inline
            items={[]}
            label={"Thesis: In cash, Left out"}
          />
          <CustomDropdown inline items={[]} label={"2024 Q1"} />
        </div>
        <div className="bar-grouped-text">
          Index Concentration in the US. is at highest levels since the 1970s,
          driven by the magnificient 7 and AI enthusiasm
        </div>
        <div className="bar-grouped-text-two">
          1A: Index return decomposition 2023 & 1B: Index return decompositions
          2020-2023
        </div>
        <LineChartComponent />
      </div>
    </div>
  );
}

export default AnalysisCharts;
