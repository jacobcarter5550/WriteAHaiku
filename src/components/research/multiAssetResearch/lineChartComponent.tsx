import React from "react";
import ReactDOM from "react-dom/client";
import { LineChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";

function LineChartComponent() {
  const data = [
    {
      group: "Dataset 1",
      key: "1995",
      value: 34200,
    },
    {
      group: "Dataset 1",
      key: "1996",
      value: 23500,
    },
    {
      group: "Dataset 1",
      key: "1997",
      value: 53100,
    },
    {
      group: "Dataset 1",
      key: "1998",
      value: 42300,
    },
    {
      group: "Dataset 1",
      key: "1999",
      value: 12300,
    },

    {
      group: "Dataset 1",
      key: "2000",
      value: 34200,
    },
    {
      group: "Dataset 1",
      key: "2001",
      value: 23500,
    },
    {
      group: "Dataset 1",
      key: "2002",
      value: 53100,
    },
    {
      group: "Dataset 1",
      key: "2003",
      value: 42300,
    },
    {
      group: "Dataset 1",
      key: "2004",
      value: 12300,
    },

    {
      group: "Dataset 1",
      key: "2005",
      value: 34200,
    },
    {
      group: "Dataset 1",
      key: "2006",
      value: 23500,
    },
    {
      group: "Dataset 1",
      key: "2007",
      value: 53100,
    },
    {
      group: "Dataset 1",
      key: "2008",
      value: 42300,
    },
    {
      group: "Dataset 1",
      key: "2009",
      value: 12300,
    },
    {
      group: "Dataset 2",
      key: "1995",
      value: 69400,
    },
    {
      group: "Dataset 2",
      key: "1996",
      value: 77700,
    },
    {
      group: "Dataset 2",
      key: "1997",
      value: 96400,
    },
    {
      group: "Dataset 2",
      key: "1998",
      value: 74700,
    },
    {
      group: "Dataset 2",
      key: "1999",
      value: 52300,
    },
    {
      group: "Dataset 2",
      key: "2000",
      value: 69400,
    },
    {
      group: "Dataset 2",
      key: "2001",
      value: 77700,
    },
    {
      group: "Dataset 2",
      key: "2002",
      value: 96400,
    },
    {
      group: "Dataset 2",
      key: "2003",
      value: 74700,
    },
    {
      group: "Dataset 2",
      key: "2004",
      value: 62300,
    },
    {
      group: "Dataset 2",
      key: "2005",
      value: 69400,
    },
    {
      group: "Dataset 2",
      key: "2006",
      value: 77700,
    },
    {
      group: "Dataset 2",
      key: "2007",
      value: 96400,
    },
    {
      group: "Dataset 2",
      key: "2008",
      value: 74700,
    },
    {
      group: "Dataset 2",
      key: "2009",
      value: 22300,
    },
  ];

  const options = {
    title: "",
    axes: {
      bottom: {
        title: "2019 Annual Sales Figures",
        mapsTo: "key",
        scaleType: "labels",
      },
      left: {
        mapsTo: "value",
        title: "Conversion rate",
        scaleType: "labels",
      },
    },
    height: "300px",
  };
  return (
    <div>
      {" "}
      <LineChart data={data} options={options} />
    </div>
  );
}

export default LineChartComponent;
