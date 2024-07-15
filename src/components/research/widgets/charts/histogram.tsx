import React, { useRef } from 'react';
import {
    IgrDataChart,
    IgrCategoryXAxis,
    IgrNumericXAxis,
    IgrNumericYAxis,
    IgrColumnSeries,
    IgrScatterSeries,
    IgrLegend,
} from 'igniteui-react-charts';
import {
    IgrDataChartCoreModule,
    IgrDataChartCategoryModule,
    IgrDataChartStackedModule,
    IgrDataChartScatterModule,
    IgrDataChartInteractivityModule,
} from 'igniteui-react-charts';
import { IgrPieChartModule, IgrLegendModule } from 'igniteui-react-charts';

// Register the Ignite UI chart modules
IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartStackedModule.register();
IgrDataChartScatterModule.register();
IgrDataChartInteractivityModule.register();
IgrPieChartModule.register();
IgrLegendModule.register();

// Function to bin data
const binData = (data, binSize) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const bins = Math.ceil((max - min) / binSize);

    const histogramData = Array.from({ length: bins }, (_, index) => ({
        Bin: min + index * binSize,
        Count: 0
    }));

    data.forEach(value => {
        const binIndex = Math.floor((value - min) / binSize);
        histogramData[binIndex].Count++;
    });

    return histogramData;
};

const dataValues = [
    -8.9, -3.2, -1.7, -2.1, -20.1, -5.7, -17.5, -10.7, -5.4, -3.0, 2.0, -1.5, 4.7, 5.8, 8.6, 3.2
];

const histogramData = binData(dataValues, 5);


// Histogram Component
export const HistogramChart = () => {
    const legendRef = useRef(null);

    return (
        <div>
            <IgrDataChart dataSource={histogramData} legend={legendRef.current} width="100%" height="20vh">
                <IgrCategoryXAxis name="xAxis" label="Bin" />
                <IgrNumericYAxis name="yAxis" />
                <IgrColumnSeries
                    name="histogramSeries"
                    xAxisName="xAxis"
                    yAxisName="yAxis"
                    valueMemberPath="Count"
                    title="Frequency"
                    outline="transparent"
                    brush="#5AD358"
                />
            </IgrDataChart>
            <IgrLegend orientation="Horizontal" ref={legendRef} />
        </div>
    );
};
