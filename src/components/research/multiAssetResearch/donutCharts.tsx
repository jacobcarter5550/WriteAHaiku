import React from "react";
import { DonutChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";

const DonutCharts = ({ data, legendColors, title }) => {
  const options = {
    title: "Donut",
    resizable: true,
    donut: {
      // center: {
      //   label: title,
      // },
      alignment: "end",
    },

    axes: {
      left: {
        mapsTo: "value",
      },
      bottom: {
        mapsTo: "group",
        scaleType: "labels",
      },
    },
    legend: {
      order: [`${data[0].group}`, `${data[1].group}`],
    },

    label: {},
    color: {
      pairing: {
        option: 2,
      },
      scale: {
        [`${data[0].group}`]: `${legendColors[0]}`,
        [`${data[1].group}`]: `${legendColors[1]}`,
      },
    },
  };

  return (
    <div className="donut-container">
      <DonutChart data={data} options={options} />
      <p className="title">{title}</p>
    </div>
  );
};

export default DonutCharts;
