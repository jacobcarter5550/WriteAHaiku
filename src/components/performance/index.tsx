import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab, TabList } from "@carbon/react";
import api from "../../helpers/serviceTP.ts";
import { useAppSelector } from "../../store/index.ts";
import { WidgetSource, BaseWidgetData } from "./widgets/types.ts";
import { getResearchState } from "../../store/research/selectors.ts";
import { returnWidgetType } from "./widgets/lib.tsx";
import { Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import AddWidget from "../modals/research/addNewWidget.tsx";
import WidgetData from "../modals/research/addWidgetData.tsx";
import { useDispatch } from "react-redux";
import {
  updateAssetClassWidgets,
  updateEquityResearchWidgets,
  updateFixedIncomeResearchWidgets,
  updateMacroClassWidgets,
  updatePortfolioResearchWidgets,
} from "../../store/research/index.ts";
import {
  performanceContribution,
  performanceTaxAlpha,
  performanceRiskAlpha,
} from "./mockData.ts";

const ResponsiveGridLayout = WidthProvider(Responsive);

export enum ResearchViewENUM {
  PERFORMANCE_CONTRIBUTION = "Performance Contribution and Attribution",
  PERFORMANCE_RISK = "Performance and Risk Analytics",
  PERFORMANCE_ALPHA = "Performance - Tax Alpha",
}

type Layout = {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
  moved: boolean;
  static: boolean;
};

const tabData = [
  ResearchViewENUM.PERFORMANCE_CONTRIBUTION,
  ResearchViewENUM.PERFORMANCE_RISK,
  ResearchViewENUM.PERFORMANCE_ALPHA,
];


const ResearchView: React.FC = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [selectedView, setSelectedView] = useState<ResearchViewENUM>();
  const [addWidget, setAddWidget] = useState<boolean>(false);
  const [widgetData, setWidgetData] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<WidgetSource[]>(performanceContribution);


  const [convert, setConvert] = useState<boolean>(true);


  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});


  /**
   * Fetches widgets for a given type.
   * @param type - The type of research view.
   */
  const fetchWidgets = async (type: number): Promise<void> => {
    console.log(`Fetching widgets for type: ${type}`);
    try {
      const response = await api.get<WidgetSource[]>(
        `http://localhost:3001/widgets/type/${type}`
      );
      console.log("Fetched widgets:", response);
      setWidgets(response.data);
    } catch (error) {
      console.error("Error fetching widgets:", error);
    }
  };

  /**
   * Fetch widgets whenever the current index changes.
   */
  // useEffect(() => {
  //   fetchWidgets(currentIndex);
  // }, [currentIndex]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     updateHeights();
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [widgets]);


  console.log(performanceContribution, 'performance')

  useEffect(() => {
    switch (selectedView) {
      case ResearchViewENUM.PERFORMANCE_CONTRIBUTION:
        dispatch(updateAssetClassWidgets(performanceContribution));
        setWidgets(performanceContribution);
        break;
      case ResearchViewENUM.PERFORMANCE_ALPHA: 
        dispatch(updateMacroClassWidgets(performanceTaxAlpha));
        setWidgets(performanceTaxAlpha);
        break;
      case ResearchViewENUM.PERFORMANCE_RISK:
        dispatch(updateEquityResearchWidgets(performanceRiskAlpha));
        setWidgets(performanceRiskAlpha);
        break;
    }
  }, [selectedView]);

  /**
   * Finds the index of the current research view enum.
   * @param currentEnum - The current research view enum.
   * @returns The index of the current research view enum.
   */
  const findTabIndex = (currentEnum: ResearchViewENUM): number => {
    return tabData.indexOf(currentEnum);
  };

  /**
   * Handles tab change event.
   * @param index - The index of the selected tab.
   */
  const handleTabChange = (index: number): void => {
    console.log(`Tab changed to index: ${index}`);
    setCurrentIndex(index + 1);
    setSelectedView(tabData[index]);
  };

  /**
   * Updates widget layouts based on new layout information.
   * @param widgets - The current widget sources.
   * @param layouts - The new layout information.
   * @returns An array of updated widget sources.
   */
  const updateWidgetLayouts = (
    widgets: WidgetSource[],
    layouts: Layout[]
  ): WidgetSource[] => {
    const layoutDict = layouts.reduce<Record<string, Layout>>((acc, layout) => {
      acc[layout.i] = layout;
      return acc;
    }, {});
    return widgets.reduce<WidgetSource[]>((updatedWidgets, widget) => {
      const layout = layoutDict[widget.i];
      if (
        layout &&
        (widget.x !== layout.x ||
          widget.y !== layout.y ||
          widget.w !== layout.w ||
          widget.h !== layout.h)
      ) {
        updatedWidgets.push({
          ...widget,
          x: layout.x,
          y: layout.y,
          w: layout.w,
          h: layout.h,
        });
      }
      return updatedWidgets;
    }, []);
  };

  const handleOpenAddWidget = () => {
    setAddWidget(true);
  };


  const convertTables = () => {
    setConvert(!convert)
  }

  const handleWidgetData = () => {
    setWidgetData(true);
  };

  /**
   * Handles layout change event.
   * @param layout - The new layout information.
   */
  const handleLayoutChange = async (layout: Layout[]): Promise<void> => {
    console.log(layout,'skandmishra')
    const updatedWidgets = updateWidgetLayouts(widgets, layout);
    const previousWidgets = [...widgets]; // Save the current state
    if (updatedWidgets.length > 0) {
      try {
        await api.put("http://localhost:3001/widgets", updatedWidgets); // Adjust the URL and method as needed
        console.log("Updated widgets:", updatedWidgets);
      } catch (error) {
        console.error("Error updating widgets:", error);
        setWidgets(previousWidgets);
      }
    }
  };

  return (
    <div className="research-view-wrapper performance-wrapper">
      <div className="research-screen-header">
        <Tabs
          selectedIndex={currentIndex - 1}
          onChange={(tabInfo) => handleTabChange(tabInfo.selectedIndex)}
        >
          <TabList
            aria-label="Financial Data Tabs"
            style={{ alignItems: "center" }}
          >
            {tabData.map((tab, index) => (
              <Tab
                style={{ margin: "0 0.2rem 0", paddingBottom: "3px" }}
                key={index}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </div>
          <div style={{ height: "100%", width: "100%" }}>
            <ResponsiveGridLayout
              className="layout"
              layout={widgets.map((widget) => ({
                i: widget.i,
                x: widget.x,
                y: widget.y,
                w: widget.w,
                h: widget.h,
              }))}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              onResizeStop={handleLayoutChange}
              margin={[10, 10]}
              onDragStop={handleLayoutChange}
              width={1200}
            >
              {widgets.map((widget,index) => (
                <div
                  className={widget.static ? "static"  : ""}
                  key={index}
                  data-grid={{
                    x: widget.x,
                    y: widget.y,
                    w: widget.w,
                    h: widget.h,
                  }}
                >
                  <div ref={(el) => (contentRefs.current[widget.i] = el)}>
                    {returnWidgetType(widget, widget.data, convert)}
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
            <AddWidget flag={addWidget} updateFlag={() => setAddWidget(false)} /> 
            <WidgetData
              flag={widgetData}
              updateFlag={() => setWidgetData(false)}
            />
          </div>
    </div>
  );
};

export default ResearchView;
