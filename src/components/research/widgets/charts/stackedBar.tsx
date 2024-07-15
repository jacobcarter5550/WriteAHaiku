import React, { useMemo, useRef } from 'react';
import {
    IgrDataChart,
    IgrCategoryXAxis,
    IgrNumericYAxis,
    IgrStackedFragmentSeries,
    IgrStackedColumnSeries,
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

// StackBarChart Component
export const StackBarChart = () => {
    const legendRef = useRef(null);

    const data = useMemo(() => [
        { Category: 'Q1 2022', Technology: 30, Healthcare: 20, Financials: 50, ConsumerGoods: 40 },
        { Category: 'Q2 2022', Technology: 70, Healthcare: 80, Financials: 20, ConsumerGoods: 60 },
        { Category: 'Q3 2022', Technology: 50, Healthcare: 60, Financials: 70, ConsumerGoods: 30 },
        { Category: 'Q4 2022', Technology: 90, Healthcare: 40, Financials: 60, ConsumerGoods: 50 },
    ], []);

    return (
        <div>
            <IgrDataChart
                dataSource={data}
                width="100%"
               height="20vh"
                isHorizontalZoomEnabled={true}
                isVerticalZoomEnabled={true}
                legend={legendRef.current}
            >
                <IgrCategoryXAxis name="xAxis" label="Category" />
                <IgrNumericYAxis name="yAxis" />
                <IgrStackedColumnSeries name="stackedColumnSeries" xAxisName="xAxis" yAxisName="yAxis">
                    <IgrStackedFragmentSeries
                        outline="transparent"
                        transitionInDuration={1000}
                        transitionInMode="accordionFromBottom"
                        name="technologyFragment"
                        valueMemberPath="Technology"
                        title="Technology"
                        brush="#FA4D56"
                    />
                    <IgrStackedFragmentSeries
                        transitionInDuration={1000}
                        outline="transparent"
                        transitionInMode="accordionFromBottom"
                        name="healthcareFragment"
                        valueMemberPath="Healthcare"
                        title="Healthcare"
                        brush="#F1C21B"
                    />
                    <IgrStackedFragmentSeries
                        transitionInDuration={1000}
                        outline="transparent"
                        transitionInMode="accordionFromBottom"
                        name="financialsFragment"
                        valueMemberPath="Financials"
                        title="Financials"
                        brush="#23AE00"
                    />
                    <IgrStackedFragmentSeries
                        transitionInDuration={1000}
                        outline="transparent"
                        transitionInMode="accordionFromBottom"
                        name="consumerGoodsFragment"
                        valueMemberPath="ConsumerGoods"
                        title="Consumer Goods"
                        brush="#0F62FE"
                    />
                </IgrStackedColumnSeries>
            </IgrDataChart>
            <IgrLegend orientation="Horizontal" ref={legendRef}/>
        </div>
    );
};
