import { ScaleTypes, StackedBarChartOptions } from "@carbon/charts";
import { StackedBarChart } from "@carbon/charts-react";
import React from "react";

function BarStacked() {
  const data = [
    {
      group: "Valuation Change",
      key: "MSCI USA",
      value: 650,
    },
    {
      group: "Valuation Change",
      key: "MSCI EAFE",
      value: 223,
    },
    {
      group: "Valuation Change",
      key: "MSCI EM",
      value: 313,
    },
    {
      group: "Valuation Change",
      key: "MSCI Japan",
      value: 513,
    },

    {
      group: "Currency",
      key: "MSCI USA",
      value: 332,
    },
    {
      group: "Currency",
      key: "MSCI EAFE",
      value: 212,
    },
    {
      group: "Currency",
      key: "MSCI EM",
      value: 556,
    },
    {
      group: "Currency",
      key: "MSCI Japan",
      value: 212,
    },

    {
      group: "EPS Growth",
      key: "MSCI USA",
      value: 122,
    },
    {
      group: "EPS Growth",
      key: "MSCI EAFE",
      value: 232,
    },
    {
      group: "EPS Growth",
      key: "MSCI EM",
      value: 342,
    },
    {
      group: "EPS Growth",
      key: "MSCI Japan",
      value: 122,
    },

    {
      group: "MSCI Japan",
      key: "MSCI USA",
      value: -323,
    },
    {
      group: "MSCI Japan",
      key: "MSCI EAFE",
      value: -213,
    },
    {
      group: "MSCI Japan",
      key: "MSCI EM",
      value: -643,
    },
    {
      group: "MSCI Japan",
      key: "MSCI Japan",
      value: -234,
    },
  ];

  const options: StackedBarChartOptions = {
    title: "",
    axes: {
      left: {
        mapsTo: "value",
        stacked: true,
      },
      bottom: {
        mapsTo: "key",
        scaleType: ScaleTypes.LABELS,
      },
    },
    legend: {},

    height: "25 rem",
  };
  return (
    <div>
      <StackedBarChart data={data} options={options}></StackedBarChart>
    </div>
  );
}

export default BarStacked;
