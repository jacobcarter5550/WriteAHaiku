import React from "react";
import { BarChartOptions, GroupedBarChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";

function BarGrouped({ data }) {
  const options = {
    title: "",
    axes: {
      left: {
        mapsTo: "value",
      },
      bottom: {
        scaleType: "labels",
        mapsTo: "key",
      },
    },
    height: "400px",
  };
  return (
    <div>
      <GroupedBarChart data={data} options={options}></GroupedBarChart>
    </div>
  );
}

export default BarGrouped;
