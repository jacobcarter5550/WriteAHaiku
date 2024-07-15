import React from "react";
import {  WidgetSource, WidgetType } from "./types.ts";
import TableWidget from "./TableWidget.tsx";
import { LineChart } from "./charts/line.tsx";
import { BarChart } from "./charts/bar.tsx";
import { StackBarChart } from "./charts/stackedBar.tsx";
import { PieChart } from "./charts/piechart.tsx";
import TabWidget from "./tabWidget.tsx";
import { HistogramChart } from "./charts/histogram.tsx";
import { ScatterPlot } from "./charts/scatterplot.tsx";
import Map from "./charts/map.tsx";
import { LineChart2 } from "./charts/line2.tsx";



// Define the possible chart types
type ChartType = "lineChart" | "barChart" | "stackedBar" | "piechart" | "histogram" | "scatterPlot" | "map" | "lineChart2";
type ChartData = any;

// Function to get the appropriate chart based on chart type
export const getChart = (chartType: ChartType, data: ChartData): JSX.Element | null => {
    switch (chartType) {
        case "lineChart":
            return <LineChart />;
        case "lineChart2":
            return <LineChart2 />;
        case "barChart":
            return <BarChart />;
        case "stackedBar":
            return <StackBarChart />;
        case "piechart":
            return <PieChart />;
        case "histogram":
            return <HistogramChart/>
        case "scatterPlot":
            return <ScatterPlot/>
        case "map":
            return <Map/>
        default:
            return null;
    }
}




export function returnWidgetType(widget: WidgetSource, widgetData, convert) {
  switch (widget.type) {
    case WidgetType.TABLE:
      return <TableWidget convertType={convert}  {...widget}    data={widgetData} />
    case WidgetType.TAB:
        return <TabWidget tabLabels={['Macro Research','Research','Minor Research','Data Research']} />
    default:
      return null
  }
}
