import React , { useRef } from 'react';
import {
    IgrDataChart,
    IgrCategoryXAxis,
    IgrNumericYAxis,
    IgrColumnSeries,
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


// BarChart Component
export const BarChart = () => {
    const data = [
        { Category: 'Q1 2022', Technology: 8.9, Healthcare: 3.2, Financials: 1.7, ConsumerGoods: 2.1 },
        { Category: 'Q2 2022', Technology: 20.1, Healthcare: 5.7, Financials: 17.5, ConsumerGoods: 10.7 },
        { Category: 'Q3 2022', Technology: 5.4, Healthcare: 3.0, Financials: 2.0, ConsumerGoods: 1.5 },
        { Category: 'Q4 2022', Technology: 4.7, Healthcare: 5.8, Financials: 8.6, ConsumerGoods: 3.2 },
    ];

    const legendRef = useRef(null);


    return (
        <div>
            <IgrDataChart dataSource={data}   legend={legendRef.current}  width="100%" height="400px">
                <IgrCategoryXAxis name="xAxis" label="Category" />
                <IgrNumericYAxis name="yAxis" />
                <IgrColumnSeries
                    name="technologySeries"
                    xAxisName="xAxis"
                    yAxisName="yAxis"
                    transitionInDuration={1000} transitionInMode="accordionFromBottom"
                    valueMemberPath="Technology"
                    title="Technology"
                    outline='transparent'
                    brush="#D739A1"
                />
                <IgrColumnSeries
                    name="healthcareSeries"
                    xAxisName="xAxis"
                    yAxisName="yAxis"
                    valueMemberPath="Healthcare"
                    transitionInDuration={1000} transitionInMode="accordionFromBottom"
                    title="Healthcare"
                     outline='transparent'
                    brush="#F1C21B"
                />
                <IgrColumnSeries
                    name="financialsSeries"
                    xAxisName="xAxis"
                    transitionInDuration={1000} transitionInMode="accordionFromBottom"
                    yAxisName="yAxis"
                    valueMemberPath="Financials"
                    title="Financials"
                     outline='transparent'
                    brush="#7E5537"
                />
                <IgrColumnSeries
                    name="consumerGoodsSeries"
                    xAxisName="xAxis"
                    transitionInDuration={1000} transitionInMode="accordionFromBottom"
                    yAxisName="yAxis"
                     outline='transparent'
                    valueMemberPath="ConsumerGoods"
                    title="Consumer Goods"
                    brush="#0E6027"
                />
            </IgrDataChart>
            <IgrLegend orientation="Horizontal"  ref={legendRef}/>
        </div>
    );
};



// import React, { useMemo } from 'react';
// import {
//     IgrCategoryChart,
//     IgrLegend,
//     IgrCategoryChartModule,
// } from 'igniteui-react-charts';

// // Register the Ignite UI chart modules
// IgrCategoryChartModule.register();

// // BarChart Component
// export const BarChart = () => {

//     const data = useMemo(() => [
//         { Category: 'Q1 2022', Technology: -8.9, Healthcare: -3.2, Financials: -1.7, ConsumerGoods: -2.1 },
//         { Category: 'Q2 2022', Technology: -20.1, Healthcare: -5.7, Financials: -17.5, ConsumerGoods: -10.7 },
//         { Category: 'Q3 2022', Technology: -5.4, Healthcare: -3.0, Financials: 2.0, ConsumerGoods: -1.5 },
//         { Category: 'Q4 2022', Technology: 4.7, Healthcare: 5.8, Financials: 8.6, ConsumerGoods: 3.2 },
//         { Category: 'Q1 2023', Technology: 6.5, Healthcare: 4.3, Financials: 7.1, ConsumerGoods: 5.4 },
//         { Category: 'Q2 2023', Technology: 10.2, Healthcare: 8.7, Financials: 12.4, ConsumerGoods: 9.3 },
//     ], []);

//     return (
//         <div>
//             <IgrCategoryChart
//                 dataSource={data}
//                 width="100%"
//                 height="400px"
//                 chartType="Column"
//                 xAxisLabel="Category"
//                 yAxisLabel="Value"
//                 includedProperties={["Category", "Technology", "Healthcare", "Financials", "ConsumerGoods"]}
//                 transitionInDuration={500}
//                 transitionInMode="accordionFromBottom"
//                 isTransitionInEnabled={true}
//                 brushes={["#5AD358", "#F1C21B", "#FA4D56", "#0F62FE"]}
//                 outlines={["#5AD358", "#F1C21B", "#FA4D56", "#0F62FE"]}
//             />
//             <IgrLegend orientation="Horizontal" />
//         </div>
//     );
// };
