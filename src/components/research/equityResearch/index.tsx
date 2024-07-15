import React, { useMemo, useState } from "react";
import "../../../styles/multiAssetResearch.scss";
import { useTheme } from "next-themes";
import { Tab, TabList, Tabs } from "@carbon/react";
import MacroFactorResearch from "./macroFactorResearch.tsx";
import MacroResearch from "./macroResearch.tsx";
import MicroFactorResearch from "./microFactorResearch.tsx";
import MicroResearch from "./microResearch.tsx";
import Status from "../../portfolio/misc/statusTP.tsx";
import { Theme } from "@carbon/react";

export enum EquityResearchViewENUM {
    MACRO_FACTOR_RESEARCH = "Macro Factor Research",
    MACRO_RESEARCH = "Macro Research",
    MICRO_FACTOR_RESEARCH = "Micro Factor Research",
    MICRO_RESEARCH = "Micro Research",
}

const tabData = [
    EquityResearchViewENUM.MACRO_FACTOR_RESEARCH,
    EquityResearchViewENUM.MACRO_RESEARCH,
    EquityResearchViewENUM.MICRO_FACTOR_RESEARCH,
    EquityResearchViewENUM.MICRO_RESEARCH,
];

const EquityResearch = () => {
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedView, setSelectedView] = useState<EquityResearchViewENUM>(
        EquityResearchViewENUM.MACRO_FACTOR_RESEARCH
    );

    const handleTabChange = (index: number): void => {
        console.log(`Tab changed to index: ${index}`);
        setCurrentIndex(index);
        setSelectedView(tabData[index]);
    };

    return (
        <div className="equity-research-container">
            <div className="left-side-container">
                <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                    <Tabs
                        selectedIndex={currentIndex}
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
                </Theme>
                {selectedView === EquityResearchViewENUM.MACRO_FACTOR_RESEARCH ? (
                    <div className="left-block">
                        <MacroFactorResearch />
                    </div>
                ) : selectedView === EquityResearchViewENUM.MACRO_RESEARCH ? (
                    <div className="left-block">
                        <MacroResearch />
                    </div>
                ) : selectedView === EquityResearchViewENUM.MICRO_FACTOR_RESEARCH ? (
                    <div className="left-block">
                        <MicroFactorResearch />
                    </div>
                ) : (
                    <div className="left-block">
                        <MicroResearch />
                    </div>
                )}
            </div>
            <Status />
        </div>
    );
};

export default EquityResearch;
