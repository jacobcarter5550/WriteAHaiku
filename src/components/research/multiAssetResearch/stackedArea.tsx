import React from "react";

import { StackedAreaChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";

function StackedArea({ title }) {
  const data = [
    {
      group: "Dataset 1",
      date: new Date(2019, 0, 1),
      value: 10000,
    },
    {
      group: "Dataset 1",
      date: new Date(2019, 0, 8),
      value: 10000,
    },
    {
      group: "Dataset 1",
      date: new Date(2019, 0, 13),
      value: 49213,
    },
    {
      group: "Dataset 1",
      date: new Date(2019, 0, 17),
      value: 51213,
    },
    {
      group: "Dataset 2",
      date: new Date(2019, 0, 5),
      value: 25000,
    },
    {
      group: "Dataset 2",
      date: new Date(2019, 0, 8),
      value: 60000,
    },
    {
      group: "Dataset 2",
      date: new Date(2019, 0, 17),
      value: 55213,
    },
    {
      group: "Dataset 3",
      date: new Date(2019, 0, 1),
      value: 30000,
    },
    {
      group: "Dataset 3",
      date: new Date(2019, 0, 5),
      value: 20000,
    },
    {
      group: "Dataset 3",
      date: new Date(2019, 0, 8),
      value: 40000,
    },
    {
      group: "Dataset 3",
      date: new Date(2019, 0, 13),
      value: 60213,
    },
    {
      group: "Dataset 3",
      date: new Date(2019, 0, 17),
      value: 25213,
    },
  ];
  const options = {
    title: "Representative 60-40 model",
    axes: {
      left: {
        stacked: true,
      },
      bottom: {
        scaleType: "time",
        mapsTo: "date",
      },
    },
    curve: "curveMonotoneX",
    height: "400px",
  };
  return (
    <>
      <div className="stacked-chart-title">{title}</div>
      <StackedAreaChart data={data} options={options} />
    </>
  );
}

export default StackedArea;
