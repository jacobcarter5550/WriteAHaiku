import React , { useState } from 'react';
import {
    IgrPieChart,
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


export const PieChart = () => {
    const data = [
        { Category: 'Technology', Value: 90 },
        { Category: 'Healthcare', Value: 40 },
        { Category: 'Financials', Value: 60 },
        { Category: 'Consumer Goods', Value: 50 },
    ];

    return (
        <div>
            <IgrLegend orientation="Horizontal" />
            <IgrPieChart
                dataSource={data}
                labelMemberPath="Category"
                valueMemberPath="Value"
                width="100%"
               height="20vh"
                labelsPosition="OutsideEnd"
                legendLabelMemberPath="Category"
                legendLabelVisibility="Visible"
                isSurfaceInteractionDisabled={false}
                isHighlightingEnabled={true}
                isTransitionInEnabled={true}
            />
        </div>
    );
};
