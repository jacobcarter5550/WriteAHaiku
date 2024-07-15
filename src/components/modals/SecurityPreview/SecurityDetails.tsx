import React, { useEffect, useState } from "react";
import { SecViewOptions, Security } from "./securtityViewTP.tsx";
import { useTheme } from "next-themes";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import { Tab, TabList, Tabs } from "@carbon/react";
import moment from "moment";
import axios from "axios";
import MiniChart from "@semcore/mini-chart";
import { Flex, Box } from "@semcore/flex-box";

const SecurityDetails: React.FC<{
    secDetails: Security;
    selectedTab: SecViewOptions;
    findTabIndex: (currentEnum: SecViewOptions) => number;
    handleTabChange: (selectedIndex: number) => void;
    tabData: SecViewOptions[];
}> = ({ secDetails, selectedTab, findTabIndex, handleTabChange, tabData }) => {
    const nextTheme = useTheme();
    const [data, setData] = useState<number[]>([]);

    useEffect(() => {
        const fetchStockData = async () => {
            const ticker = "CNDT";
            const endDate = moment().format("YYYY-MM-DD");
            const startDate = moment().subtract(1, "month").format("YYYY-MM-DD");
            const apiKey = "QQPIRNCsrC65SlDav1nWlfv1tLA_pkFM";
            // const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&apiKey=${apiKey}`;
            const url =
                "https://api.polygon.io/v2/aggs/ticker/CNDT/range/1/day/2023-01-09/2023-02-14?adjusted=true&sort=asc&apiKey=QQPIRNCsrC65SlDav1nWlfv1tLA_pkFM";

            try {
                const response = await axios.get(url);
                const highPrices = response.data.results.map((result: any) => result.h);
                setData(highPrices);
            } catch (err) {
                console.log("Error fetching data");
            }
        };

        fetchStockData();
    }, []);
    console.log("fetchStockData", data);
    return (
        <section style={{ paddingBottom: ".6rem" }}>
            <section
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <aside
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "55%",
                    }}
                >
                    <div className="title">
                        <aside style={{ display: "flex" }}>
                            <ImageComponent
                                src="replicate.svg"
                                alt="replicate-icon"
                                style={{ marginRight: ".5em", width: "1.7rem" }}
                            />

                            <h1>{secDetails}</h1>
                            {/* <ImageComponent
                                src="chevron--down.svg"
                                alt="chevron--down-icon"
                                style={{
                                    marginRight: ".5em",
                                    width: "1.5rem",
                                    paddingTop: ".5rem",
                                }}
                            /> */}
                        </aside>
                        <p>United States | NYSE Consolidated | Oil & Gas Refining and Marketing </p>
                    </div>
                    <div className="display" style={{ display: "flex" }}>
                        {/* {data.length && <MiniChart.TrendLine data={data} w={"200px"} h={"50px"} />} */}
                        <MiniChart.TrendLine
                            data={[20, 50, 33, 80, 70, 35, 10, 40, 90, 50]}
                            w={"120px"}
                            h={"40px"}
                        />
                        <p style={{ color: "blue" }}>{data[data.length - 1]}</p>
                        <p>USD</p>
                        {/* <p
                            style={{
                                color: nextTheme.theme == "light" ? "#4b4f9d" : "#f4f4f4",
                                backgroundColor: nextTheme.theme == "light" ? "white" : "#161616",
                                padding: ".25rem",
                                fontWeight: "500",
                            }}
                        >
                            CAM 415
                        </p> */}
                    </div>
                </aside>
                <div className="stats">
                    <p style={{ textAlign: "right" }}>
                        Updated : {moment().format("DD-MMM-YYYY HH:mm A")}
                    </p>
                    <p style={{ fontWeight: "700" }}>RATIOS-OVERVIEW RSS RATO</p>
                </div>
            </section>
            <div>
                <Tabs
                    selectedIndex={findTabIndex(selectedTab)}
                    onChange={(tabInfo) => handleTabChange(tabInfo.selectedIndex)}
                >
                    <TabList aria-label="Financial Data Tabs">
                        {tabData.map((tab, index) => (
                            <Tab key={index}>{tab}</Tab>
                        ))}
                    </TabList>
                </Tabs>
            </div>
        </section>
    );
};

export default SecurityDetails;
