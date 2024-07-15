import React, { useEffect, useRef, useState } from "react";
import Heading from "../../../ui-elements/headingTP.tsx";
import {
    BarChartOptions,
    ScaleTypes,
    SimpleBarChart,
    StackedAreaChart,
    LineChartOptions,
} from "@carbon/charts-react";
import { ToolbarControlTypes } from "@carbon/charts";
import api from "../../../helpers/serviceTP.ts";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountIdForSummary } from "../../../store/portfolio/selector.ts";
import { getCurrentOpen } from "../../../store/nonPerstistant/selectors.ts";
import { setCurrentOpen } from "../../../store/nonPerstistant/index.ts";
import { useTheme } from "next-themes";
import { Theme } from "@carbon/react";
import "../../../styles/charts.scss";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";

type SummaryChartProps = {
    inheritedTableData: any;
};

const SummaryChart: React.FC<SummaryChartProps> = ({ inheritedTableData }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const currentOpen = useAppSelector(getCurrentOpen);
    const accountIDforSummary = useAppSelector(getAccountIdForSummary);
    const [portfolioSummary, setPortfolioSummary] = useState<any>([]);
    const [state, setState] = useState<boolean>(false);
    const [barData, setBarData] = useState<{ group: string; value: number }[]>([]);

    let divRef = useRef<HTMLDivElement>(null);

    const {
        preOptExpectedReturn,
        postOptExpectedReturn,
        preOptExpectedVolatility,
        postOptExpectedVolatility,
        postOptTransactionCost,
        preOptTrackingError,
        postOptTrackingError,
        postOptTaxCost,
    } = portfolioSummary;

    const opts: BarChartOptions = {
        title: "Vertical simple bar (discrete)",
        axes: {
            left: {
                mapsTo: "value",
            },
            bottom: {
                mapsTo: "group",
                scaleType: "labels",
            },
        },
        height: "30rem",
        width: "100%",
        legend: {
            enabled: false,
        },
        data: {
            loading: barData?.length == 0,
        },
        theme: theme.theme == "light" ? "white" : "g100",
        toolbar: {
            enabled: true,
            controls: [
                {
                    type: ToolbarControlTypes.CUSTOM,
                    title: "customSecChart",
                    text: "Custom",
                    id: "custom-1",
                    iconSVG: { content: "" },
                },
                {
                    type: ToolbarControlTypes.MAKE_FULLSCREEN,
                },
                {
                    type: ToolbarControlTypes.EXPORT_CSV,
                },
                {
                    type: ToolbarControlTypes.EXPORT_PNG,
                },
                {
                    type: ToolbarControlTypes.EXPORT_JPG,
                },
            ],
        },
    };
    const opts1: LineChartOptions = {
        axes: {
            left: {
                stacked: true,
                scaleType: ScaleTypes.LINEAR,
                mapsTo: "value",
            },
            bottom: {
                scaleType: ScaleTypes.TIME,
                mapsTo: "date",
            },
        },
        legend: {
            enabled: false,
        },
        data: {
            loading: barData.length == 0,
        },
        theme: theme.theme == "light" ? "white" : "g100",
        curve: "curveMonotoneX",
        height: "11rem",
        width: "100%",
        toolbar: {
            enabled: false,
        },
    };

    const handleChart = () => {
        setState(!state);
        divRef.current = null;
    };

    function dispatchCurrentOpen(val: boolean) {
        dispatch(setCurrentOpen(val));
    }

    useEffect(() => {
        if (
            accountIDforSummary !== null &&
            (accountIDforSummary?.length || Object.keys(accountIDforSummary).length > 0)
        ) {
            try {
                api.get(`/optevent/summary/${accountIDforSummary}`)
                    .then((res: any) => {
                        try {
                            setPortfolioSummary(res.data);
                            const dataArray = Object.entries(res.data).map(([key, value]) => ({
                                group: "Dataset",
                                key: key,
                                value: value ? value : 0,
                            }));

                            const filteredData = dataArray
                                ?.filter(
                                    (item) =>
                                        !Number.isNaN(Number(item.value)) &&
                                        Number(item.value) !== 0
                                )
                                .map((item) => ({
                                    group: item.key,
                                    value: Number(item.value),
                                }));

                            setBarData(filteredData);
                        } catch (error) {
                            console.error("Error occurred while processing response data:", error);
                        }
                    })
                    .catch((error) => {
                        console.error("Error occurred while fetching portfolio summary:", error);
                    });
            } catch (error) {
                console.error("Error occurred while fetching portfolio summary:", error);
            }
        }
    }, [accountIDforSummary]);

    useEffect(() => {
        if (inheritedTableData !== null) {
            setPortfolioSummary(inheritedTableData);
        }
    }, [inheritedTableData]);

    useEffect(() => {
        if (state) {
            const svgid = document.querySelector('[aria-label="customSecChart"]');

            let divElement = document.createElement("div");
            divElement.className = "toolbarContainer";

            let firstContainer = document.createElement("div");
            firstContainer.className = "firstContainer";

            let title = document.createElement("h4");
            title.innerText = "Portfolio Summary:";
            firstContainer.appendChild(title);

            divElement.appendChild(firstContainer);

            // let button = document.createElement("div");
            // button.onclick = () => setSecurityComparisonView((e) => !e);
            // button.innerText = "Compare";
            // button.className = "custom-icon compare-button widthHelper";
            // firstContainer.appendChild(button);
            if (barData.length > 0) {
                divElement.appendChild(firstContainer);

                let img1 = document.createElement("img");
                img1.src = "/calendar.svg";
                img1.alt = "Calendar Icon";
                img1.classList.add("calendar-icon-charact");
                // img1.addEventListener("click", toggleDatePicker);
                divElement.appendChild(img1);

                let img2 = document.createElement("img");
                img2.src = "/mic.svg";
                img2.alt = "Mic Icon";
                divElement.appendChild(img2);

                let img3 = document.createElement("img");
                img3.src = "/convert.svg";
                img3.alt = "Convert Icon";
                img3.addEventListener("click", handleChart);
                divElement.appendChild(img3);
            }

            if (svgid && divRef.current == null) {
                // @ts-ignore
                divRef.current = divElement;
                svgid.replaceWith(divElement);
            }
        }
    }, [state, barData]);

    console.log("inheritedTableData-->", inheritedTableData);
    console.log("portfolioSummary-->", portfolioSummary);

    return (
        <>
            <section className={state ? "toggled portfolio-overview" : "portfolio-overview"}>
                <div
                    className={
                        theme.theme === "light" ? "details-block" : "details-block-dark-mode"
                    }
                    style={{
                        paddingBottom: !state ? "1rem" : "",
                        paddingLeft: !state ? ".8rem" : "",
                    }}
                >
                    {state ? (
                        <>
                            {barData.length === 0 ? (
                                <>
                                    <Heading
                                        variant={"h4"}
                                        text={"Portfolio Summary:"}
                                        style={{
                                            whiteSpace: "nowrap",
                                            fontWeight: 600,
                                            paddingLeft: "1rem",
                                            paddingTop: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                    />

                                    <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                                        <StackedAreaChart options={opts1} data={[]} />
                                    </Theme>
                                </>
                            ) : (
                                <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                                    <SimpleBarChart options={opts} data={barData as any} />
                                </Theme>
                            )}
                        </>
                    ) : (
                        <>
                            <span
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "-webkit-fit-available",
                                    padding: "1rem 0",
                                }}
                            >
                                <aside
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: ".5rem",
                                    }}
                                >
                                    <Heading
                                        variant={"h4"}
                                        text={"Portfolio Summary:"}
                                        style={{ whiteSpace: "nowrap", fontWeight: 600 }}
                                    />
                                    <span style={{ display: "flex", gap: ".5rem" }}>
                                        <ImageComponent
                                            src="sideCollapse.svg"
                                            alt="sideCollapse-icon"
                                            style={{ height: "1.5rem", cursor: "pointer" }}
                                            onClick={(e) => {
                                                dispatchCurrentOpen(!currentOpen);
                                            }}
                                            title="Side collapse"
                                        />
                                    </span>
                                </aside>
                                <span style={{ display: "flex", gap: "1rem" }}>
                                    <ImageComponent
                                        src="mic.svg"
                                        alt="Microphone-icon"
                                        style={{ width: "1.8rem" }}
                                        title="Mic"
                                    />
                                    <ImageComponent
                                        src="convert.svg"
                                        alt="convert-icon"
                                        style={{ width: "1.8rem", cursor: "pointer" }}
                                        onClick={handleChart}
                                        title="Convert"
                                    />
                                </span>
                            </span>
                            <table
                                style={{ fontSize: "1.2rem" }}
                                className="table-overview"
                                cellPadding={0}
                                cellSpacing={0}
                            >
                                <thead>
                                    <tr>
                                        <th className="title">Analytics</th>
                                        <th style={{ paddingRight: "2.2rem" }} className="title">
                                            Current Wt
                                        </th>
                                        <th style={{ paddingRight: "2.2rem" }} className="title">
                                            Post-Override
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span className="title">Expected Alpha</span>
                                        </td>
                                        <td>
                                            <span className="quant">{preOptExpectedReturn}</span>
                                        </td>
                                        <td>
                                            <span className="quant">{postOptExpectedReturn}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="title">Expected Tracking Error</span>
                                        </td>
                                        <td>
                                            <span className="quant">{preOptTrackingError}</span>
                                        </td>
                                        <td>
                                            <span className="quant">{postOptTrackingError}</span>
                                        </td>
                                    </tr>{" "}
                                    <tr>
                                        <td>
                                            <span className="title">Expected Volatility</span>
                                        </td>
                                        <td>
                                            <span className="quant">
                                                {preOptExpectedVolatility}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="quant">
                                                {postOptExpectedVolatility}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default SummaryChart;
