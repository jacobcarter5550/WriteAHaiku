import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab, TabList } from "@carbon/react";
import Research from "./alternativeResearch/research.tsx";
import api from "../../helpers/serviceTP.ts";
import { useAppSelector } from "../../store/index.ts";
import { WidgetSource, BaseWidgetData } from "./widgets/types.ts";
import { getResearchState } from "../../store/research/selectors.ts";
import { returnWidgetType } from "./widgets/lib.tsx";
import { Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import AddWidget from "../modals/research/addNewWidget.tsx";
import MultiAssetResearch from "./multiAssetResearch/multiAssetResearch.tsx";
import EquityReseach from "./equityResearch/index.tsx";
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
  assetPayload,
  macroResearchPayload,
  equityResearchPayload,
  portfolioResearchPayload,
} from "./mockData.ts";
import { useLocation } from 'react-router-dom';
import PropResearch from "./alternativeResearch/propResearch.tsx";

const ResponsiveGridLayout = WidthProvider(Responsive);

export enum ResearchViewENUM {
  AI = "Alternative Research (AI)",
  ASSET_CLASS = "Asset Classes & Risk",
  MACRO_RESEARCH = "Macro Research",
  EQUITY = "Equity Research",
  FIXED_INCOME = "Fixed Income Research",
  PORTFOLIO = "Portfolio Research",
  MULTI_ASSET_RESEARCH = "Multi-Asset Research",
  AGENTIC_RESEARCH = "Agentic Research",
  FORMAL = "FORMAL (Pilot)",
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
  ResearchViewENUM.AGENTIC_RESEARCH,
  ResearchViewENUM.AI,
  ResearchViewENUM.PORTFOLIO,
  ResearchViewENUM.ASSET_CLASS,
  ResearchViewENUM.MACRO_RESEARCH,
  ResearchViewENUM.EQUITY,
  ResearchViewENUM.FIXED_INCOME,
  ResearchViewENUM.MULTI_ASSET_RESEARCH,
];

const ResearchView: React.FC = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [selectedView, setSelectedView] = useState<ResearchViewENUM>(
    ResearchViewENUM.AGENTIC_RESEARCH
  );
  const [addWidget, setAddWidget] = useState<boolean>(false);
  const [widgetData, setWidgetData] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<WidgetSource[]>(assetPayload);

  const [convert, setConvert] = useState<boolean>(false);

  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});


  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'portfolio') {
      setCurrentIndex(3)
      setSelectedView(ResearchViewENUM.PORTFOLIO);
    }
  }, [location.search]);


const updateHeights = () => {
  const newWidgets = widgets.map((widget) => {
    const contentRef = contentRefs.current[widget.i];
    if (!contentRef) {
      console.warn(`Content ref for widget ${widget.i} not found.`);
      return widget;
    }
    
    const contentHeight = contentRef.offsetHeight || 0;
    const gridHeight = Math.ceil((contentHeight - 100) / 30); // Adjust as necessary
    
    console.log(`Widget ${widget.i} - Content height: ${contentHeight}, Grid height: ${gridHeight}`);
    
    return { ...widget, h: gridHeight };
  });
  
  setWidgets(newWidgets);
};


  useEffect(() => {
    updateHeights();
  }, []);
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

  // const fetchData = async (service: string) => {
  //     try {
  //         const response = await api.get(service);
  //         return response.data;
  //     } catch (error) {
  //         console.error(`Error fetching data from ${service}:`, error);
  //         return null;
  //     }
  // };

  // useEffect(() => {
  //     const updateWidgetData = async (widgets) => {
  //         const updatedWidgets = await Promise.all(
  //             widgets.map(async (widget) => {
  //                 if (widget.service) {
  //                     const data = await fetchData(widget.service);
  //                     if (data) {
  //                         return { ...widget, data };
  //                     }
  //                 }
  //                 return widget;
  //             })
  //         );

  //         return updatedWidgets;
  //     };

  //     const handleViewChange = async () => {
  //         let payload;
  //         switch (selectedView) {
  //             case ResearchViewENUM.ASSET_CLASS:
  //                 payload = await updateWidgetData(assetPayload);
  //                 dispatch(updateAssetClassWidgets(payload));
  //                 setWidgets(payload);
  //                 break;
  //             case ResearchViewENUM.MACRO_RESEARCH:
  //                 payload = await updateWidgetData(macroResearchPayload);
  //                 dispatch(updateMacroClassWidgets(payload));
  //                 setWidgets(payload);
  //                 console.log(payload, "testubg");
  //                 break;
  //             case ResearchViewENUM.EQUITY:
  //                 payload = await updateWidgetData(equityResearchPayload);
  //                 dispatch(updateEquityResearchWidgets(payload));
  //                 setWidgets(payload);
  //                 break;
  //             case ResearchViewENUM.PORTFOLIO:
  //                 payload = await updateWidgetData(portfolioResearchPayload);
  //                 dispatch(updatePortfolioResearchWidgets(payload));
  //                 setWidgets(payload);
  //                 break;
  //             default:
  //                 break;
  //         }
  //     };

  //     handleViewChange();
  // }, [selectedView, dispatch]);

  useEffect(() => {
    switch (selectedView) {
      case ResearchViewENUM.ASSET_CLASS:
        dispatch(updateAssetClassWidgets(assetPayload));
        setWidgets(assetPayload);
        break;
      case ResearchViewENUM.MACRO_RESEARCH:
        dispatch(updateMacroClassWidgets(macroResearchPayload));
        setWidgets(macroResearchPayload);
        break;
      case ResearchViewENUM.EQUITY:
        dispatch(updateEquityResearchWidgets(equityResearchPayload));
        setWidgets(equityResearchPayload);
        break;
      // case ResearchViewENUM.FIXED_INCOME:
      //   dispatch(updateFixedIncomeResearchWidgets(fixedIncomePayload));
      //   setWidgets(fixedIncomePayload);
      //   break;
      case ResearchViewENUM.PORTFOLIO:
        dispatch(updatePortfolioResearchWidgets(portfolioResearchPayload));
        setWidgets(portfolioResearchPayload);
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



  // render ressearch iframe
  const renderIframe = () => {
    return <div className="fullscreen-container">
              <iframe
                className="fullscreen-iframe2"
                src="http://localhost:5174"
                title="Research"
              ></iframe>
          </div>
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
    setConvert(!convert);
  };

  const handleWidgetData = () => {
    setWidgetData(true);
  };

  /**
   * Handles layout change event.
   * @param layout - The new layout information.
   */
  const handleLayoutChange = async (layout: Layout[]): Promise<void> => {
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
    <div className="research-view-wrapper">
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
        <div className="add-btns">
          <button onClick={handleOpenAddWidget} className="add-btn disabled">
            <img src="/addWidget.svg" />
          </button>
          <button onClick={handleWidgetData} className="add-btn">
            <img src="/searchFolder.svg" />
          </button>
          <img
            onClick={convertTables}
            src="dark-convert.svg"
            alt="Microphone-icon"
            title="Mic"
            style={{
              height: "3rem",
              backgroundColor: "#383c93",
              padding: ".5rem",
              marginLeft: "1rem",
            }}
          />
        </div>
      </div>
      {selectedView === ResearchViewENUM.AGENTIC_RESEARCH ? (
        <>
          {renderIframe()}
        </>
        ) : selectedView === ResearchViewENUM.AI ? (
            <Research />
            
        ) :
        selectedView === ResearchViewENUM.FORMAL ? (
            <>
            <PropResearch />
        </>
      ) 
      : selectedView === ResearchViewENUM.MULTI_ASSET_RESEARCH ? (
        <MultiAssetResearch />
      ) : selectedView == ResearchViewENUM.EQUITY ? (
        <EquityReseach />
      ) : (
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
            draggableHandle=".drag-handle"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onResizeStop={handleLayoutChange}
            margin={[10, 10]}
            onDragStop={handleLayoutChange}
            width={1200}
          >
            {widgets.map((widget, index) => (
              <div
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
      )}
    </div>
  );
};

export default ResearchView;
