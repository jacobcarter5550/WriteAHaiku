import "@carbon/charts/styles.css";
import { HeatmapChart } from "@carbon/charts";
import React, { useEffect, useRef } from "react";
import { Height } from "@mui/icons-material";

let data = [
  {
    letter: "A",
    month: "RCD",
    value: 41,
  },
  {
    letter: "B",
    month: "RCD",
    value: 7,
  },
  {
    letter: "C",
    month: "RCD",
    value: 66,
  },
  {
    letter: "D",
    month: "RCD",
    value: 85,
  },
  {
    letter: "E",
    month: "RCD",
    value: 70,
  },
  {
    letter: "F",
    month: "RCD",
    value: 98,
  },
  {
    letter: "G",
    month: "RCD",
    value: 90,
  },
  {
    letter: "H",
    month: "RCD",
    value: 66,
  },
  {
    letter: "I",
    month: "RCD",
    value: 0,
  },
  {
    letter: "J",
    month: "RCD",
    value: 13,
  },
  {
    letter: "A",
    month: "RYH",
    value: 16,
  },
  {
    letter: "B",
    month: "RYH",
    value: 5,
  },
  {
    letter: "C",
    month: "RYH",
    value: 6,
  },
  {
    letter: "D",
    month: "RYH",
    value: 48,
  },
  {
    letter: "E",
    month: "RYH",
    value: 72,
  },
  {
    letter: "F",
    month: "RYH",
    value: 26,
  },
  {
    letter: "G",
    month: "RYH",
    value: 70,
  },
  {
    letter: "H",
    month: "RYH",
    value: 99,
  },
  {
    letter: "I",
    month: "RYH",
    value: 79,
  },
  {
    letter: "J",
    month: "RYH",
    value: 83,
  },
  {
    letter: "A",
    month: "RYT",
    value: 62,
  },
  {
    letter: "B",
    month: "RYT",
    value: 57,
  },
  {
    letter: "C",
    month: "RYT",
    value: 90,
  },
  {
    letter: "D",
    month: "RYT",
    value: 68,
  },
  {
    letter: "E",
    month: "RYT",
    value: 84,
  },
  {
    letter: "F",
    month: "RYT",
    value: 21,
  },
  {
    letter: "G",
    month: "RYT",
    value: 54,
  },
  {
    letter: "H",
    month: "RYT",
    value: 25,
  },
  {
    letter: "I",
    month: "RYT",
    value: 42,
  },
  {
    letter: "J",
    month: "RYT",
    value: 62,
  },
  {
    letter: "A",
    month: "RGI",
    value: 15,
  },
  {
    letter: "B",
    month: "RGI",
    value: 52,
  },
  {
    letter: "C",
    month: "RGI",
    value: 15,
  },
  {
    letter: "D",
    month: "RGI",
    value: 22,
  },
  {
    letter: "E",
    month: "RGI",
    value: 59,
  },
  {
    letter: "F",
    month: "RGI",
    value: 36,
  },
  {
    letter: "G",
    month: "RGI",
    value: 5,
  },
  {
    letter: "H",
    month: "RGI",
    value: 18,
  },
  {
    letter: "I",
    month: "RGI",
    value: 42,
  },
  {
    letter: "J",
    month: "RGI",
    value: 72,
  },
  {
    letter: "A",
    month: "RHS",
    value: 30,
  },
  {
    letter: "B",
    month: "RHS",
    value: 39,
  },
  {
    letter: "C",
    month: "RHS",
    value: 69,
  },
  {
    letter: "D",
    month: "RHS",
    value: 73,
  },
  {
    letter: "E",
    month: "RHS",
    value: 2,
  },
  {
    letter: "F",
    month: "RHS",
    value: 15,
  },
  {
    letter: "G",
    month: "RHS",
    value: 86,
  },
  {
    letter: "H",
    month: "RHS",
    value: 23,
  },
  {
    letter: "I",
    month: "RHS",
    value: 65,
  },
  {
    letter: "J",
    month: "RHS",
    value: 0,
  },
  {
    letter: "A",
    month: "RTM",
    value: 51,
  },
  {
    letter: "B",
    month: "RTM",
    value: 30,
  },
  {
    letter: "C",
    month: "RTM",
    value: 7,
  },
  {
    letter: "D",
    month: "RTM",
    value: 74,
  },
  {
    letter: "E",
    month: "RTM",
    value: 44,
  },
  {
    letter: "F",
    month: "RTM",
    value: 62,
  },
  {
    letter: "G",
    month: "RTM",
    value: 65,
  },
  {
    letter: "H",
    month: "RTM",
    value: 35,
  },
  {
    letter: "I",
    month: "RTM",
    value: 95,
  },
  {
    letter: "J",
    month: "RTM",
    value: 59,
  },
  {
    letter: "A",
    month: "RYF",
    value: 89,
  },
  {
    letter: "B",
    month: "RYF",
    value: 50,
  },
  {
    letter: "C",
    month: "RYF",
    value: 35,
  },
  {
    letter: "D",
    month: "RYF",
    value: 45,
  },
  {
    letter: "E",
    month: "RYF",
    value: 93,
  },
  {
    letter: "F",
    month: "RYF",
    value: 19,
  },
  {
    letter: "G",
    month: "RYF",
    value: 52,
  },
  {
    letter: "H",
    month: "RYF",
    value: 81,
  },
  {
    letter: "I",
    month: "RYF",
    value: 72,
  },
  {
    letter: "J",
    month: "RYF",
    value: 99,
  },
  {
    letter: "A",
    month: "RSP",
    value: 54,
  },
  {
    letter: "B",
    month: "RSP",
    value: 41,
  },
  {
    letter: "C",
    month: "RSP",
    value: 75,
  },
  {
    letter: "D",
    month: "RSP",
    value: 10,
  },
  {
    letter: "E",
    month: "RSP",
    value: 0,
  },
  {
    letter: "F",
    month: "RSP",
    value: 93,
  },
  {
    letter: "G",
    month: "RSP",
    value: 3,
  },
  {
    letter: "H",
    month: "RSP",
    value: 80,
  },
  {
    letter: "I",
    month: "RSP",
    value: 88,
  },
  {
    letter: "J",
    month: "RSP",
    value: 27,
  },
  {
    letter: "A",
    month: "RYE",
    value: 81,
  },
  {
    letter: "B",
    month: "RYE",
    value: 36,
  },
  {
    letter: "C",
    month: "RYE",
    value: 77,
  },
  {
    letter: "D",
    month: "RYE",
    value: 1,
  },
  {
    letter: "E",
    month: "RYE",
    value: 45,
  },
  {
    letter: "F",
    month: "RYE",
    value: 23,
  },
  {
    letter: "G",
    month: "RYE",
    value: 1,
  },
  {
    letter: "H",
    month: "RYE",
    value: 13,
  },
  {
    letter: "I",
    month: "RYE",
    value: 61,
  },
  {
    letter: "J",
    month: "RYE",
    value: 87,
  },
  {
    letter: "A",
    month: "EQAL",
    value: 5,
  },
  {
    letter: "B",
    month: "EQAL",
    value: 29,
  },
  {
    letter: "C",
    month: "EQAL",
    value: 49,
  },
  {
    letter: "D",
    month: "EQAL",
    value: 81,
  },
  {
    letter: "E",
    month: "EQAL",
    value: 5,
  },
  {
    letter: "F",
    month: "EQAL",
    value: 6,
  },
  {
    letter: "G",
    month: "EQAL",
    value: 3,
  },
  {
    letter: "H",
    month: "EQAL",
    value: 72,
  },
  {
    letter: "I",
    month: "EQAL",
    value: 27,
  },
  {
    letter: "J",
    month: "EQAL",
    value: 99,
  },
  {
    letter: "A",
    month: "EWRE",
    value: 25,
  },
  {
    letter: "B",
    month: "EWRE",
    value: 11,
  },
  {
    letter: "C",
    month: "EWRE",
    value: 54,
  },
  {
    letter: "D",
    month: "EWRE",
    value: 90,
  },
  {
    letter: "E",
    month: "EWRE",
    value: 21,
  },
  {
    letter: "F",
    month: "EWRE",
    value: 5,
  },
  {
    letter: "G",
    month: "EWRE",
    value: 41,
  },
  {
    letter: "H",
    month: "EWRE",
    value: 4,
  },
  {
    letter: "I",
    month: "EWRE",
    value: 31,
  },
  {
    letter: "J",
    month: "EWRE",
    value: 22,
  },
  {
    letter: "A",
    month: "QQEW",
    value: 99,
  },
  {
    letter: "B",
    month: "QQEW",
    value: 54,
  },
  {
    letter: "C",
    month: "QQEW",
    value: 85,
  },
  {
    letter: "D",
    month: "QQEW",
    value: 39,
  },
  {
    letter: "E",
    month: "QQEW",
    value: 45,
  },
  {
    letter: "F",
    month: "QQEW",
    value: 24,
  },
  {
    letter: "G",
    month: "QQEW",
    value: 87,
  },
  {
    letter: "H",
    month: "QQEW",
    value: 69,
  },
  {
    letter: "I",
    month: "QQEW",
    value: 59,
  },
  {
    letter: "J",
    month: "QQEW",
    value: 44,
  },

  {
    letter: "A",
    month: "TLT",
    value: 99,
  },
  {
    letter: "B",
    month: "TLT",
    value: 54,
  },
  {
    letter: "C",
    month: "TLT",
    value: 85,
  },
  {
    letter: "D",
    month: "TLT",
    value: 39,
  },
  {
    letter: "E",
    month: "TLT",
    value: 45,
  },
  {
    letter: "F",
    month: "TLT",
    value: 24,
  },
  {
    letter: "G",
    month: "TLT",
    value: 87,
  },
  {
    letter: "H",
    month: "TLT",
    value: 69,
  },
  {
    letter: "I",
    month: "TLT",
    value: 59,
  },
  {
    letter: "J",
    month: "TLT",
    value: 44,
  },
  {
    letter: "A",
    month: "EMLC",
    value: 99,
  },
  {
    letter: "B",
    month: "EMLC",
    value: 54,
  },
  {
    letter: "C",
    month: "EMLC",
    value: 85,
  },
  {
    letter: "D",
    month: "EMLC",
    value: 39,
  },
  {
    letter: "E",
    month: "EMLC",
    value: 45,
  },
  {
    letter: "F",
    month: "EMLC",
    value: 24,
  },
  {
    letter: "G",
    month: "EMLC",
    value: 87,
  },
  {
    letter: "H",
    month: "EMLC",
    value: 69,
  },
  {
    letter: "I",
    month: "EMLC",
    value: 59,
  },
  {
    letter: "J",
    month: "EMLC",
    value: 44,
  },
  {
    letter: "A",
    month: "EEM",
    value: 99,
  },
  {
    letter: "B",
    month: "EEM",
    value: 54,
  },
  {
    letter: "C",
    month: "EEM",
    value: 85,
  },
  {
    letter: "D",
    month: "EEM",
    value: 39,
  },
  {
    letter: "E",
    month: "EEM",
    value: 45,
  },
  {
    letter: "F",
    month: "EEM",
    value: 24,
  },
  {
    letter: "G",
    month: "EEM",
    value: 87,
  },
  {
    letter: "H",
    month: "EEM",
    value: 69,
  },
  {
    letter: "I",
    month: "EEM",
    value: 59,
  },
  {
    letter: "J",
    month: "EEM",
    value: 44,
  },
];

const options = {
  title: "",
  axes: {
    top: {
      title: "",
      mapsTo: "letter",
      scaleType: "labels",
    },
    left: {
      title: "",
      mapsTo: "month",
      scaleType: "labels",
    },
  },
  heatmap: {
    colorLegend: { title: "" },
  },
  Height: "55rem",
};

// const heatmapDomainOptions = {
// 	title: 'Heatmap (Axis order option)',
// 	axes: {
// 		bottom: {
// 			title: 'Letters',
// 			mapsTo: 'letter',
// 			scaleType: 'labels',
// 		},
// 		left: {
// 			title: 'Months',
// 			mapsTo: 'month',
// 			scaleType: 'labels',
// 			domain: [
// 				'RCD',
// 				'RYH',
// 				'RYT',
// 				'RGI',
// 				'RHS',
// 				'RTM',
// 				'RYF',
// 				'RSP',
// 				'RYE',
// 				'EQAL',
// 				'EWRE',
// 				'QQEW',
// 			],
// 		},
// 	},
// 	legend: {
// 		colorLegend: { title: 'Legend title' },
// 	},
// };

// Grab chart holder HTML element and initialize the chart

// Button click
function HeatMap() {
  const chartHolderRef = useRef(null);

  useEffect(() => {
    if (chartHolderRef.current) {
      new HeatmapChart(chartHolderRef.current, {
        data,
        options,
      });
    }
  }, []);
  return (
    <div className="heat-map-container">
      <div className="heat-map-title">Heat Map</div>
      <div id="app" ref={chartHolderRef} style={{ width: "100%" }} />
    </div>
  );
}

export default HeatMap;
