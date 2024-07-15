import React, { useMemo, useState } from "react";
import "../../../styles/multiAssetResearch.scss";
import Button from "../../../ui-elements/buttonTP.tsx";
import { useTheme } from "next-themes";
import RightBlockMultiAssetResearch from "./rightBlockMultiAssetResearch.tsx";
import TacticalAssetAllocation from "./tacticalAssetAllocation.tsx";
import RightBlockModels from "./rightBlockModels.tsx";
import { Tab, TabList, Tabs } from "@carbon/react";
import StrategicAssetAllocation from "./strategicAssetAllocation.tsx";
import MacroRotationPrediction from "./macroRotationPrediction.tsx";
import AnalysisCharts from "./analysisCharts.tsx";

export enum MultiAssetViewENUM {
  STRATEGIC_ASSET_ALLOCATION = "Strategic Asset Allocation",
  TACTICAL_ASSET_ALLOCATION = "Tactical Asset Allocation",
  MACRO_ROTATION_PREDICTION = "Macro Rotation Prediction",
}
const MultiAssetResearch = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [selectedView, setSelectedView] = useState<MultiAssetViewENUM>(
    MultiAssetViewENUM.STRATEGIC_ASSET_ALLOCATION
  );

  const handleTabChange = (index: number): void => {
    console.log(`Tab changed to index: ${index}`);
    setCurrentIndex(index + 1);
    setSelectedView(tabData[index]);
  };

  const tabData = [
    MultiAssetViewENUM.STRATEGIC_ASSET_ALLOCATION,
    MultiAssetViewENUM.TACTICAL_ASSET_ALLOCATION,
    MultiAssetViewENUM.MACRO_ROTATION_PREDICTION,
  ];

  return (
    <div className="multi-asset-research-container">
      {/* <div className="top-buttons">
            <Button
              label={"Strategic Asset Allocation"}
              className={theme.theme == "light" ? "light" : "dark"}
              //   onClick={}
            />
            <Button
              label={"Tactical Asset Allocation"}
              className={theme.theme == "light" ? "light de-selected" : "dark"}
              //   onClick={}
            />
            <Button
              label={"Macro Rotation Prediction"}
              className={theme.theme == "light" ? "light de-selected" : "dark"}
              //   onClick={}
            />
          </div> */}
      <div
        className="left-side-container"
        style={{
          width:
            selectedView === MultiAssetViewENUM.MACRO_ROTATION_PREDICTION
              ? "100%"
              : "65%",
        }}
      >
        <Tabs
          selectedIndex={currentIndex - 1}
          onChange={(tabInfo) => handleTabChange(tabInfo.selectedIndex)}
        >
          <TabList aria-label="Financial Data Tabs">
            {tabData.map((tab, index) => (
              <Tab
                style={{ margin: "0 0.2rem 1rem", padding: "10px" }}
                key={index}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        {selectedView === MultiAssetViewENUM.STRATEGIC_ASSET_ALLOCATION ? (
          <div className="left-block">
            <StrategicAssetAllocation />
          </div>
        ) : selectedView === MultiAssetViewENUM.TACTICAL_ASSET_ALLOCATION ? (
          <div className="left-block">
            <TacticalAssetAllocation />
          </div>
        ) : (
          <></>
        )}

        {selectedView === MultiAssetViewENUM.MACRO_ROTATION_PREDICTION && (
          <div className="macro-rotation-container">
            <MacroRotationPrediction />
          </div>
        )}
      </div>

      {selectedView === MultiAssetViewENUM.STRATEGIC_ASSET_ALLOCATION ? (
        <div className="right-block">
          <AnalysisCharts />
        </div>
      ) : selectedView === MultiAssetViewENUM.TACTICAL_ASSET_ALLOCATION ? (
        <div className="right-block">
          <RightBlockModels />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MultiAssetResearch;
