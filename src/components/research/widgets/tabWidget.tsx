import React, { useMemo, useState } from "react";
import "../../../styles/multiAssetResearch.scss";
import { useTheme } from "next-themes";
import { Tab, TabList, Tabs } from "@carbon/react";
import BaseWidget from "./BaseWidget.tsx";
import { Theme } from "@carbon/react";

export enum EquityResearchViewENUM {
    MACRO_FACTOR_RESEARCH = "Macro Factor Research",
    MACRO_RESEARCH = "Macro Research",
    MICRO_FACTOR_RESEARCH = "Micro Factor Research",
    MICRO_RESEARCH = "Micro Research",
}

interface EquityResearchProps {
    tabLabels: string[];
}

const TabWidget: React.FC<EquityResearchProps> = ({ tabLabels }) => {
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

    const tabData = [
        EquityResearchViewENUM.MACRO_FACTOR_RESEARCH,
        EquityResearchViewENUM.MACRO_RESEARCH,
        EquityResearchViewENUM.MICRO_FACTOR_RESEARCH,
        EquityResearchViewENUM.MICRO_RESEARCH,
    ];

    console.log(tabLabels, "tablebll");

    return (
        <BaseWidget data={[]}>
            <div className="equity-research-tab">
                <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                    <Tabs
                        selectedIndex={currentIndex}
                        onChange={(tabInfo) => handleTabChange(tabInfo.selectedIndex)}
                    >
                        <TabList aria-label="Financial Data Tabs">
                            {tabLabels.map((label, index) => (
                                <Tab
                                    style={{ margin: "0 0.2rem 1rem", padding: "10px" }}
                                    key={index}
                                >
                                    {label}
                                </Tab>
                            ))}
                        </TabList>
                    </Tabs>
                </Theme>
            </div>
        </BaseWidget>
    );
};

export default TabWidget;
