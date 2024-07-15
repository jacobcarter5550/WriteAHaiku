import React from "react";
import DonutCharts from "./donutCharts.tsx";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import RightBlockModels from "./rightBlockModels.tsx";

export default function TacticalAssetAllocation() {
  const data = [
    [
      {
        group: "YEL48 Q6XK YEL48",
        value: 7800,
      },
      {
        group: "Misc",
        value: 2200,
      },
    ],
  ];
  return (
    <div>
      <div className="donut-chart">
        <CustomDropdown inline items={[]} label={"Styles"} />

        <div className="donut-row">
          <DonutCharts
            data={data[0]}
            legendColors={["#F0E94A", "#3C42CF"]}
            title="Value vs Growth"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#F1C21B", "#B03678"]}
            title="Growth vs Value"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#0F62FE", "#F1C21B"]}
            title="Growth vs Momentum"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#24A148", "#3C42CF"]}
            title="Momentum vs Value"
          />
        </div>

        <CustomDropdown inline items={[]} label={"Cap Sizes"} />

        <div className="donut-row">
          <DonutCharts
            data={data[0]}
            legendColors={["#FFC2C5", "#9F1853"]}
            title="Large vs Mid"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#005D5D", "#0E6027"]}
            title="Large vs Mid"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#65AC59", "#FA4D56"]}
            title="Mid vs Small"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#EE6E74", "#B82028"]}
            title="Small vs Large"
          />
        </div>

        <CustomDropdown inline items={[]} label={"Factors"} />

        <div className="donut-row">
          <DonutCharts
            data={data[0]}
            legendColors={["#D746AE", "#F1C21B"]}
            title="Size non-linear vs Yield"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#20BF4EB2", "#383C93"]}
            title="Size vs Yield"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#E195CC", "#CA1D51"]}
            title="Liquidity vs Volatility"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#05B656", "#F1C21B"]}
            title="Volatility vs Yield"
          />
        </div>

        <CustomDropdown inline items={[]} label={"Sectors"} />

        <div className="donut-row">
          <DonutCharts
            data={data[0]}
            legendColors={["#005D5D", "#57E5E5"]}
            title="Tech vs Cyclical Consumer"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#9747FF", "#FFC2C5"]}
            title="Manufacture vs Transportation"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#FA4D56", "#F1C21B"]}
            title="Tech Vs Automobile"
          />
          <DonutCharts
            data={data[0]}
            legendColors={["#383C93", "#05B656"]}
            title="Tech vs Pharms"
          />
        </div>
      </div>
    </div>
  );
}
