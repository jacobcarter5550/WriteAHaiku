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


// Scatter Plot Component
export const ScatterPlot = () => {


 const data = [
        { Category: 'Q1 2022', Technology: -8.9, Healthcare: -3.2 },
        { Category: 'Q2 2022', Technology: -20.1, Healthcare: -5.7 },
        { Category: 'Q3 2022', Technology: -5.4, Healthcare: -3.0 },
        { Category: 'Q4 2022', Technology: 4.7, Healthcare: 5.8 },
        { Category: 'Q1 2023', Technology: 6.3, Healthcare: 7.1 },
        { Category: 'Q2 2023', Technology: 2.5, Healthcare: 3.4 },
        { Category: 'Q3 2023', Technology: -1.2, Healthcare: 1.0 },
        { Category: 'Q4 2023', Technology: 3.8, Healthcare: 4.5 },
    ];

    const legendRef = useRef(null);

    return (
        <div>
            <IgrDataChart dataSource={data} legend={legendRef.current} width="100%" height="20vh">
                <IgrNumericXAxis name="xAxis" />
                <IgrNumericYAxis name="yAxis" />
                <IgrScatterSeries
                    name="scatterSeries"
                    xAxisName="xAxis"
                    yAxisName="yAxis"
                    xMemberPath="Technology"
                    yMemberPath="Healthcare"
                    title="Tech vs Healthcare"
                    markerType="Circle"
                    brush="#5AD358"
                />
            </IgrDataChart>
            <IgrLegend orientation="Horizontal" ref={legendRef} />
        </div>
    );
};
