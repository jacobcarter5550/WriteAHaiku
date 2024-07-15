import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

import Heading from "../../../ui-elements/headingTP.tsx";
import { ComboChart, LineChart, LineChartOptions, StackedAreaChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import api from "../../../helpers/serviceTP.ts";
import DynamicTable from "../../../helpers/dynamictableTP.tsx";
import { DatePicker, DatePickerInput, Toggle } from "@carbon/react";
import moment from "moment";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountDetails, getAccountIdForSummary } from "../../../store/portfolio/selector.ts";
import { useTheme } from "next-themes";
import ReactDOM from "react-dom";
import "../../../styles/charts.scss";
import { ComboChartOptions, ScaleTypes, ToolbarControlTypes } from "@carbon/charts";
import { Theme } from "@carbon/react";
import {
    getAbsolute,
    getAbsoluteCharacter,
    getAbsoluteCharacterReturn,
} from "../../../store/nonPerstistant/selectors.ts";
import {
    setAbsoluteCharacter,
    setAbsoluteCharacterReturn,
} from "../../../store/nonPerstistant/index.ts";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import {
    ChartTypeEnum,
    convertArrayToDates,
    extractGroupTitles,
    formatAttributeData,
    formatNumber,
    sortByDate,
} from "./utils.ts";

type ComparisonDictionary = {
    [key: string]: {
        attributeValue: number;
        date: string;
    }[];
};

type comparisonData = {
    securityAttributeValue: ComparisonDictionary;
    securityId: string;
};

const ChartType: React.FC<{
    chartType: ChartTypeEnum;
    comparedDataPortfolio: comparisonData | null;
    setSecurityComparisonView: React.Dispatch<React.SetStateAction<boolean>>;
    setComparisonType: React.Dispatch<React.SetStateAction<string>>;
}> = ({ chartType, comparedDataPortfolio, setComparisonType, setSecurityComparisonView }) => {
    const dispatch = useDispatch();
    console.log("testme", comparedDataPortfolio);
    const accountDetails = useAppSelector(getAccountDetails);
    const absoluteCharacter = useAppSelector(getAbsoluteCharacter);
    const absoluteCharacterReturn = useAppSelector(getAbsoluteCharacterReturn);
    const [toggled, setToggled] = useState<boolean>(false);

    const accountIDforSummary = useAppSelector(getAccountIdForSummary);

    function dispatchAbsoluteCharacter(val: boolean) {
        setToggled(true);
        if (chartType === ChartTypeEnum.RETURN) {
            dispatch(setAbsoluteCharacterReturn(val));
        } else {
            dispatch(setAbsoluteCharacter(val));
        }
    }

    console.log(comparedDataPortfolio, "skandmishra");

    const theme = useTheme();

    const [chart, setChartDetails] = useState<any[]>([]);
    const [comboChartData, setComboChartData] = useState<any[]>([]);
    const [rows, setRows] = useState<JSX.Element[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [state, setState] = useState<boolean>(chartType === ChartTypeEnum.SUMMARY ? true : false);
    const [startDate, setStartDate] = useState<string>("20221001");
    const [endDate, setEndDate] = useState<string>("20221101");
    const [dateRange, setDateRange] = useState<Date[]>([
        new Date("2020-10-01T00:00:00+0000"),
        new Date("2024-05-10T00:00:00+0000"),
    ]);

    console.log(chart);

    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const datePickerRef = useRef(null);

    const [series, setSeries] = useState<Object[]>([
        {
            data: [],
        },
    ]);

    const chartData = (type: ChartTypeEnum) => {
        switch (type) {
            case ChartTypeEnum.SUMMARY:
                return {
                    title: "Portfolio Summary:",
                    url: `/optevent/summary/${accountIDforSummary}`,
                };
            case ChartTypeEnum.PORTFOLIOCHAR:
                return {
                    title: "Portfolio Characs:",
                    url: `/account/holding/trend/${accountIDforSummary}/20201001/20240510/${!absoluteCharacter}`,
                };
            case ChartTypeEnum.SECURITYCHAR:
                return {
                    title: "Security Characs:",
                    url: `/security/returns/${accountDetails?.securityId}/${startDate}/${endDate}`,
                };
            case ChartTypeEnum.RETURN:
                return {
                    title: "Portfolio Return:",
                    url: `/account/returns/${accountIDforSummary}/${!absoluteCharacterReturn}`,
                };
        }
    };

    const toggleDatePicker = () => {
        setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
    };

    let divRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const defOptions = {
        axes: {
            left: {
                scaleType: ScaleTypes.LINEAR,
                mapsTo: "value",
                ticks: {
                    formatter: (e) => {
                        if (typeof e == "number") {
                            return formatNumber(e);
                        } else {
                            return JSON.stringify(e);
                        }
                    },
                },
            },
            bottom: {
                scaleType: ScaleTypes.TIME,
                mapsTo: "date",
            },
            right: {
                scaleType: ScaleTypes.LINEAR,
                mapsTo: "addValue",
                correspondingDatasets: ["new"],
            },
        },
        legend: {
            enabled: false,
        },
        data: {
            loading: true,
        },
        theme: theme.theme === "light" ? "white" : "g100",
        curve: "curveNatural",
        timeScale: {
            addSpaceOnEdges: 0,
        },
        height: "30rem",
        width: "100%",

        toolbar: {
            enabled: true,
            controls: [
                {
                    type: ToolbarControlTypes.CUSTOM,
                    title: `${chartData(chartType).title} ToolBar`,

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

    const [options, setOptions] = useState<ComboChartOptions>(defOptions);

    useEffect(() => {
        if (chart.length == 0 && comboChartData.length == 0) {
            setLoading(true);
            defOptions.data.loading = true;
            setOptions(defOptions);
        } else {
            setLoading(false);
            defOptions.data.loading = false;
            setOptions(defOptions);
        }
    }, [chart, comboChartData]);

    useEffect(() => {
        const svgID = document.querySelector(
            `[aria-label="${chartData(chartType).title} ToolBar"]`
        );

        // Check if adjacent element with className 'toolbarContainer' exists and has children
        const adjacentToolbarContainer = svgID?.previousElementSibling;

        if (
            adjacentToolbarContainer &&
            adjacentToolbarContainer.classList.contains("toolbarContainer") &&
            adjacentToolbarContainer.children.length > 0
        ) {
            return;
        }

        let divElement = document.createElement("div");
        divElement.className = "toolbarContainer";

        let firstContainer = document.createElement("div");
        firstContainer.className = "firstContainer";

        let title = document.createElement("h4");
        title.innerText = chartData(chartType).title;

        firstContainer.appendChild(title);
        divElement.appendChild(firstContainer);

        if (series.length > 0 || comboChartData.length > 0) {
            let button = document.createElement("div");
            button.onclick = () => {
                if (chartType === ChartTypeEnum.PORTFOLIOCHAR) {
                    setComparisonType("characteristic");
                } else {
                    setComparisonType("security");
                }
                setSecurityComparisonView((e) => !e);
            };
            button.innerText = "Compare";
            button.className = "custom-icon compare-button widthHelper";

            // –—— Add button

            if (
                chartType === ChartTypeEnum.PORTFOLIOCHAR ||
                chartType === ChartTypeEnum.SECURITYCHAR
            ) {
                firstContainer.appendChild(button);
            }

            const element = document.createElement("div");

            ReactDOM.render(
                <Toggle
                    onToggle={(e) => {
                        dispatchAbsoluteCharacter(e);
                    }}
                    size="sm"
                    id="1"
                    labelA="ABS"
                    labelB="REL"
                />,
                element
            );

            // ——— Add toggle

            if (chartType === ChartTypeEnum.PORTFOLIOCHAR || chartType === ChartTypeEnum.RETURN) {
                firstContainer.appendChild(element);
            }

            divElement.appendChild(firstContainer);

            let img1 = document.createElement("img");
            img1.src = "/calendar.svg";
            img1.alt = "Calendar Icon";
            img1.classList.add("calendar-icon-charact");
            img1.addEventListener("click", toggleDatePicker);
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

        if (
            (svgID && divRef.current == null) ||
            (svgID && comboChartData.length !== 0 && chartType !== ChartTypeEnum.RETURN) ||
            (svgID && chart.length !== 0 && chartType !== ChartTypeEnum.RETURN)
        ) {
            //@ts-ignore
            divRef.current = divElement;
            svgID.replaceWith(divElement);
        }
    }, [state, series, comboChartData, options, divRef, toggled]);

    const handleDateChange = (newValue: Date[]) => {
        setDateRange(newValue);
        if (moment(newValue[0])?.format("YYYYMMDD") != startDate) {
            setStartDate(moment(newValue[0])?.format("YYYYMMDD"));
        }
        if (moment(newValue[1])?.format("YYYYMMDD") != endDate) {
            setEndDate(moment(newValue[1])?.format("YYYYMMDD"));
        }
    };

    const handleChart = () => {
        setState(!state);
        // @ts-ignore
        divRef.current = null;
    };

    console.log(chart);

    useEffect(() => {
        if (accountIDforSummary !== null && accountIDforSummary?.length) {
            try {
                api.get(chartData(chartType).url).then((res: any) => {
                    console.log(chartType);
                    switch (chartType) {
                        case ChartTypeEnum.RETURN:
                            const periodic = res.data.periodReturns
                                .map((item: any) => ({
                                    group: "Periodic",
                                    date: item.startDate,
                                    value: item.returnPercentage * 100,
                                }))
                                .slice(1, 15);
                            setChartDetails(sortByDate(periodic));
                            const returnColumns = Object.keys(periodic[0] || []);
                            setColumns(returnColumns);
                            setRows(periodic);
                            break;
                        case ChartTypeEnum.PORTFOLIOCHAR:
                            const pCharDetails = convertArrayToDates(res.data.marketValueTrend);

                            setChartDetails(sortByDate(pCharDetails));
                            const pCharColumns = Object.keys(pCharDetails[0] || []);
                            setColumns(pCharColumns);
                            setRows(pCharDetails);
                            break;
                        case ChartTypeEnum.SECURITYCHAR:
                            const sCharData = res.data.dailyReturns?.map((item: any) => ({
                                group: "Return",
                                date: item.date,
                                value: item.returns,
                            }));
                            if (sCharData) {
                                console.log(sCharData);
                                setChartDetails(sortByDate(sCharData));
                                const sCharColumns = Object.keys(sCharData[0] || []);
                                setColumns(sCharColumns);
                                setRows(sCharData);
                            }
                            break;
                        case ChartTypeEnum.SUMMARY:
                            console.log("bro");
                            const dataArray = Object.entries(res.data).map(([key, value]) => ({
                                group: "value",
                                key: key,
                                value: value ? value : 0,
                            }));

                            setSeries([
                                {
                                    name: "Data",
                                    data: dataArray.map((data) => data.value),
                                },
                            ]);
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
                            console.log(filteredData);
                            setChartDetails(filteredData);
                            setRows(filteredData);
                    }

                    setShowDatePicker(false);
                });
            } catch (error) {
                console.error("Error occurred while fetching data:", error);
            }
        }
        setShowDatePicker(false);
    }, [
        accountIDforSummary,
        accountDetails,
        endDate,
        absoluteCharacter,
        comparedDataPortfolio,
        absoluteCharacterReturn,
    ]);

    useEffect(() => {
        console.log(comparedDataPortfolio, "skand");

        if (comparedDataPortfolio && Object.keys(comparedDataPortfolio).length > 0) {
            const formattedSeries = formatAttributeData(
                comparedDataPortfolio
            );

            setComboChartData(sortByDate(formattedSeries));

            console.log(formattedSeries, "skanmd");

            const seriesTitles = extractGroupTitles(formattedSeries);

            const altOptions: ComboChartOptions = {
                axes: {
                    left: {
                        mapsTo: "value",
                        main: true,
                        correspondingDatasets: [seriesTitles[0]],
                        ticks: {
                            formatter: (e) => {
                                if (typeof e == "number") {
                                    return formatNumber(e);
                                } else {
                                    return JSON.stringify(e);
                                }
                            },
                        },
                    },
                    bottom: {
                        scaleType: ScaleTypes.TIME,
                        mapsTo: "date",
                    },
                    right: {
                        ticks: {
                            formatter: (e) => {
                                if (typeof e == "number") {
                                    return formatNumber(e);
                                } else {
                                    return JSON.stringify(e);
                                }
                            },
                        },
                        scaleType: ScaleTypes.LINEAR,
                        mapsTo: `addValue`,
                        correspondingDatasets: [seriesTitles[1]],
                    },
                },
                data: {
                    loading: loading,
                },
                theme: theme.theme === "light" ? "white" : "g100",
                timeScale: {
                    addSpaceOnEdges: 0,
                },
                height: "30rem",
                width: "100%",
                toolbar: {
                    enabled: true,
                    controls: [
                        {
                            type: ToolbarControlTypes.CUSTOM,
                            title: `${chartData(chartType).title} ToolBar`,
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
                comboChartTypes: [
                    {
                        type: "line",
                        correspondingDatasets: seriesTitles,
                    },
                ],
            };

            setOptions(altOptions);
        } else {
            setOptions(defOptions);
            setComboChartData([]);
        }
    }, [comparedDataPortfolio]);

    useEffect(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            theme: theme.theme === "light" ? "white" : "g100",
        }));
    }, [theme]);
console.log("Range",dateRange)
    return (
        <section
            className={
                !state
                    ? "security-overview"
                    : "portfolio-overview portfolio-overview-bottom-padding"
            }
        >
            {!state ? (
                <div
                    className={
                        theme.theme === "light" ? "details-block" : "details-block-dark-mode"
                    }
                >
                    <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                        {!(comboChartData?.length > 0) ? (
                            <LineChart data={chart} options={options} />
                        ) : (
                            <ComboChart data={comboChartData} options={options} />
                        )}
                    </Theme>
                    {showDatePicker && (
                        <div className="date-range-selector" ref={datePickerRef}>
                  
                                <DatePicker
                                    datePickerType="range"
                                    onChange={(newValue) => handleDateChange(newValue)}
                                    value={dateRange}
                                    closeOnSelect={true}
                                    dateFormat="d/m/Y"
                                    
                                >
                                    <DatePickerInput
                                        id="date-picker-input-id-start"
                                        placeholder="dd/mm/yyyy"
                                        labelText="Start date"
                                        size="md"
                                    />
                                    <DatePickerInput
                                        id="date-picker-input-id-finish"
                                        placeholder="dd/mm/yyyy"
                                        labelText="End date"
                                        size="md"
                                    />
                                </DatePicker>
                        
                        </div>
                    )}
                </div>
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
                        <Heading
                            variant={"h4"}
                            text={chartData(chartType).title}
                            style={{
                                whiteSpace: "nowrap",
                                fontWeight: 600,
                                paddingLeft: "1rem",
                            }}
                        />
                        <span style={{ display: "flex", gap: "1rem", paddingRight: ".5rem" }}>
                            <ImageComponent
                                src="mic.svg"
                                alt="Microphone-icon"
                                style={{ width: "1.8rem", cursor: "pointer" }}
                                onClick={handleChart}
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
                    <div className="table-block-container">
                        <DynamicTable columns={columns} rows={rows} />
                    </div>
                </>
            )}
        </section>
    );
};

export default ChartType;
