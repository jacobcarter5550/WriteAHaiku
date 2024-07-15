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

const getRandomValue = (min, max) => Math.random() * (max - min) + min;


// LineChart Component
export const LineChart = ({
    
}) => {


const [data] = useState([
    { Category: 'Q1 2022', Technology: getRandomValue(-20, 10), Healthcare: getRandomValue(-10, 10), Financials: getRandomValue(-20, 10), ConsumerGoods: getRandomValue(-15, 10) },
    { Category: 'Q2 2022', Technology: getRandomValue(-20, 10), Healthcare: getRandomValue(-10, 10), Financials: getRandomValue(-20, 10), ConsumerGoods: getRandomValue(-15, 10) },
    { Category: 'Q3 2022', Technology: getRandomValue(-20, 10), Healthcare: getRandomValue(-10, 10), Financials: getRandomValue(-20, 10), ConsumerGoods: getRandomValue(-15, 10) },
    { Category: 'Q4 2022', Technology: getRandomValue(-20, 10), Healthcare: getRandomValue(-10, 10), Financials: getRandomValue(-20, 10), ConsumerGoods: getRandomValue(-15, 10) },
]);
    const legendRef = useRef(null);


    return (
        <div>
            <IgrDataChart dataSource={data} width="100%"                 legend={legendRef.current} height="20vh">
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
                    markerBrush="#EF548C"
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
                    markerBrush="#7285F0"
                     outline='transparent'
                    brush="#F1C21B"
                />
            </IgrDataChart>
            <IgrLegend orientation="Horizontal" ref={legendRef}/>
        </div>
    );
};



// import React, { useState, useMemo, useRef } from 'react';
// import {
//     IgrCategoryChart,
//     IgrLegend,
//     IgrCategoryChartModule,
// } from 'igniteui-react-charts';

// // Register the Ignite UI chart modules
// IgrCategoryChartModule.register();

// // LineChart Component
// export const LineChart = () => {


//     const [data] = useState([
//         { Category: 'Q1 2022', Technology: -8.9, Healthcare: -3.2, Financials: -1.7, ConsumerGoods: -2.1 },
//         { Category: 'Q2 2022', Technology: -20.1, Healthcare: -5.7, Financials: -17.5, ConsumerGoods: -10.7 },
//         { Category: 'Q3 2022', Technology: -5.4, Healthcare: -3.0, Financials: 2.0, ConsumerGoods: -1.5 },
//         { Category: 'Q4 2022', Technology: 4.7, Healthcare: 5.8, Financials: 8.6, ConsumerGoods: 3.2 },
//     ]);

//     const memoizedData = useMemo(() => data, [data]);

//     const legendRef = useRef(null);

//     return (
//         <div>
//             <IgrCategoryChart
//                 dataSource={memoizedData}
//                 width="100%"
//                 height="400px"
//                 chartType="Line"
//                 xAxisLabel="Category"
//                 yAxisLabel="Value"
//                 includedProperties={["Category", "Technology", "Healthcare", "Financials", "ConsumerGoods"]}
//                 transitionInDuration={1000}
//                 transitionInMode="accordionFromBottom"
//                 isTransitionInEnabled={true}
//                 brushes={["#EF548C", "#7285F0", "#7285F0", "#F1C21B"]}
//                 outlines={["#EF548C", "#7285F0", "#7285F0", "#F1C21B"]}
//                 markerTypes={["circle", "triangle", "square", "diamond"]}
//                 legend={legendRef.current}
//             />
//             <IgrLegend orientation="Horizontal" ref={legendRef} />
//         </div>
//     );
// };
