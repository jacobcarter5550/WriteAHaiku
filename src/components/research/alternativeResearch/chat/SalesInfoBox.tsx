import React, { useState, useEffect } from "react";
import { Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import { SalesInfo } from "./types.ts";
import { DonutChart } from "@carbon/charts-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
);

interface SalesInfoBoxProps {
  salesInfo: SalesInfo;
}

const generateRandomColor = () =>
  "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");

const SalesInfoBox: React.FC<SalesInfoBoxProps> = ({ salesInfo }) => {
  const [showPieChart, setShowPieChart] = useState(true);
  const [pieChartColors, setPieChartColors] = useState<string[]>([]);
  const [lineChartColors, setLineChartColors] = useState<{
    [category: string]: string;
  }>({});

  const categoryRevenue: { [category: string]: number } = {};

  useEffect(() => {
    const categories = new Set<string>();

    // Collect categories for random color generation
    salesInfo.data.forEach((salesData) => {
      Object.values(salesData).forEach((data) => {
        Object.keys(data).forEach((category) => {
          categories.add(category);
        });
      });
    });

    const newPieChartColors = Array.from(categories).map(() =>
      generateRandomColor()
    );
    setPieChartColors(newPieChartColors);

    const newLineChartColors: { [category: string]: string } = {};
    Array.from(categories).forEach((category) => {
      newLineChartColors[category] = generateRandomColor();
    });
    setLineChartColors(newLineChartColors);
  }, [salesInfo]);

  const toggleToPieChart = () => setShowPieChart(true);
  const toggleToLineChart = () => setShowPieChart(false);

  // Extracting data for Pie Chart
  salesInfo.data.forEach((salesData) => {
    Object.entries(salesData).forEach(([date, data]) => {
      Object.entries(data).forEach(([category, value]) => {
        if (!categoryRevenue[category]) {
          categoryRevenue[category] = 0;
        }
        categoryRevenue[category] += value;
      });
    });
  });

  const pieData = {
    labels: Object.keys(categoryRevenue),
    datasets: [
      {
        data: Object.values(categoryRevenue),
        backgroundColor: pieChartColors,
      },
    ],
  };

  // Extracting and ensuring data consistency for Line Chart
  const lineLabels: string[] = [];
  const categoryData: { [category: string]: number[] } = {};
  const allCategories = new Set<string>();

  // Collect all data points and categories
  salesInfo.data.forEach((salesData) => {
    Object.entries(salesData).forEach(([date, data]) => {
      lineLabels.push(date);
      Object.keys(data).forEach((category) => {
        allCategories.add(category);
        if (!(category in categoryData)) {
          categoryData[category] = Array(lineLabels.length - 1).fill(0); // Fill previous dates with zero
        }
        categoryData[category].push(data[category]);
      });

      // Fill other categories with zero for the current date
      allCategories.forEach((category) => {
        if (!(category in data)) {
          if (!(category in categoryData)) {
            categoryData[category] = Array(lineLabels.length - 1).fill(0);
          }
          categoryData[category].push(0);
        }
      });
    });
  });

  // Reverse the labels and data for the line chart
  lineLabels.reverse();
  Object.keys(categoryData).forEach((category) => {
    categoryData[category].reverse();
  });

  const lineData = {
    labels: lineLabels,
    datasets: Object.entries(categoryData).map(([category, data]) => ({
      label: category,
      data,
      fill: true,
      backgroundColor: lineChartColors[category],
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Set this to false to let the chart fill the container's height
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: function (value: number) {
            return value.toLocaleString();
          },
        },
      },
    },
  };
  const carbOptions = {
    title: `${salesInfo.ticker} Revenue Breakdown`,

    pie: {
      labels: {
        enabled: false,
      },
      valueMapsTo: "count",
    },
    legend: {
      alignment: "center",
    },
    donut: {
      center: {
        label: `${salesInfo.ticker} Revenue`,
      },
      alignment: "center",
    },
    height: "400px",
    width: "400px",
    marginRight: "auto",
    marginLeft: "auto",
  };

  // const carbData = categoryRevenue.map((item)=>{
  //   return {
  //     group:
  //   }
  // })
  console.log(categoryRevenue, pieData);

  function convertChartData(data: ChartData): ConvertedData {
    if (
      !data.datasets.length ||
      data.labels.length !== data.datasets[0].data.length
    ) {
      throw new Error("Data structure mismatch or empty datasets");
    }

    return data.labels.map((label, index) => ({
      group: label,
      count: data.datasets[0].data[index],
    }));
  }

  const carbPieData = convertChartData(pieData);
  console.log(carbPieData);
  return (
    <div className="info-box">
      <div className="chart-toggle-buttons">
        <button
          className={showPieChart ? "active" : ""}
          onClick={toggleToPieChart}
        >
          Latest
        </button>
        <button
          className={!showPieChart ? "active" : ""}
          onClick={toggleToLineChart}
        >
          Historical
        </button>
      </div>
      <div className="chart-container">
        {showPieChart ? (
          <div className="pie-chart-wrapper">
            {/* <Doughnut data={pieData} /> */}
            <DonutChart data={carbPieData} options={carbOptions} />
          </div>
        ) : (
          <Line data={lineData} options={options} height={"100%"} />
        )}
      </div>
    </div>
  );
};

export default SalesInfoBox;
