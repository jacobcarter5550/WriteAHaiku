import React , { useState, useRef } from 'react';
import {
    IgrDataChart,
    IgrCategoryXAxis,
    IgrNumericYAxis,
    IgrLineSeries,
    IgrLegend,
} from 'igniteui-react-charts';
import {
    IgrDataChartCoreModule,
    IgrDataChartCategoryModule,
    IgrDataChartStackedModule,
    IgrDataChartInteractivityModule,
} from 'igniteui-react-charts';
import { IgrPieChartModule, IgrLegendModule } from 'igniteui-react-charts';


// Register the Ignite UI chart modules
IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartStackedModule.register();
IgrDataChartInteractivityModule.register();

IgrPieChartModule.register();
IgrLegendModule.register();


// LineChart Component
export const LineChart2 = ({
    
}) => {
    const [data] = useState([
        { Category: 'Q1 2022', Technology: -8.9, Healthcare: -3.2, Financials: -1.7, ConsumerGoods: -2.1 },
        { Category: 'Q2 2022', Technology: -20.1, Healthcare: -5.7, Financials: -17.5, ConsumerGoods: -10.7 },
        { Category: 'Q3 2022', Technology: -5.4, Healthcare: -3.0, Financials: 2.0, ConsumerGoods: -1.5 },
        { Category: 'Q4 2022', Technology: 4.7, Healthcare: 5.8, Financials: 8.6, ConsumerGoods: 3.2 },
    ]);

    const legendRef = useRef(null);


    return (
        <div className='line-chart-block'>
            <IgrDataChart dataSource={data} width="100%" legend={legendRef.current} height="100%">
                <IgrCategoryXAxis name="xAxis" label="Category" />
                <IgrNumericYAxis name="yAxis" />
                <IgrLineSeries
                    name="technologySeries"
                    xAxisName="xAxis"
                    yAxisName="yAxis"
                    valueMemberPath="Technology"
                    title="Technology"
                    showInLegend="true"
                    markerType="circle"
                     outline='transparent'
                    markerBrush="#0F62FE"
                    brush="#0F62FE"
                />
                <IgrLineSeries
                    name="healthcareSeries"
                    xAxisName="xAxis"
                    yAxisName="yAxis"
                    valueMemberPath="Healthcare"
                    title="Healthcare"
                    showInLegend="true"
                    markerType="triangle"
                    markerBrush="#23AE00"
                     outline='transparent'
                    brush="#23AE00"
                />
            </IgrDataChart>
            <IgrLegend orientation="Horizontal" ref={legendRef}/>
        </div>
    );
};


