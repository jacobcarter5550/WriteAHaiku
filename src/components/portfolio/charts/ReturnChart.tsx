import React, { useState, useEffect, useRef } from "react";
import { LineChart, LineChartOptions, StackedAreaChart } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import api from "../../../helpers/serviceTP.ts";
import DynamicTable from "../../../helpers/dynamictableTP.tsx";
import { DatePicker, DatePickerInput, Toggle } from "@carbon/react";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountIdForSummary } from "../../../store/portfolio/selector.ts";
import { useTheme } from "next-themes";
import "../../../styles/charts.scss";
import { ScaleTypes, ToolbarControlTypes } from "@carbon/charts";
import ReactDOM from "react-dom";
import { Theme } from "@carbon/react";
import { useDispatch } from "react-redux";
import { setAbsolute } from "../../../store/nonPerstistant/index.ts";
import { getAbsolute } from "../../../store/nonPerstistant/selectors.ts";
import moment from "moment";
import { toast } from "react-toastify";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import Heading from "../../../ui-elements/headingTP.tsx";

const ReturnChart: React.FC<{}> = ({}) => {
    const dispatch = useDispatch();

    const accountIDforSummary = useAppSelector(getAccountIdForSummary);

    function dispatchAbsolute(val: boolean) {
        dispatch(setAbsolute(val));
    }

    const absolute = useAppSelector(getAbsolute);

    const theme = useTheme();

    const [series, setSeries] = useState<Object[]>([]);

    const [rows, setRows] = useState<JSX.Element[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [state, setState] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>("20230712");
    const [endDate, setEndDate] = useState<string>("20230731");
    const [dateRange, setDateRange] = useState<Date[]>([
        new Date("2023-07-12T00:00:00+0000"),
        new Date("2023-07-31T00:00:00+0000"),
    ]);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const handleCheckboxChange = (event: boolean) => {
        dispatchAbsolute(event);
    };

    const [originalData, setOriginalData] = useState<
        { group: string; date: string; value: number }[]
    >([]);

    useEffect(() => {
        if (originalData?.length > 0) {
            const filteredData = originalData?.filter((item) => {
                const itemDate = new Date(item.date);
                return itemDate >= dateRange[0] && itemDate <= dateRange[1];
            });

            const updatedRows: JSX.Element[] = filteredData?.map((item, index) => (
                <tr key={index}>
                    {Object.keys(item).map((key, keyIndex) => (
                        <td key={keyIndex}>
                            <span className="title">{item[key]}</span>
                        </td>
                    ))}
                </tr>
            ));

            const rows: JSX.Element[] = originalData?.map((item, index) => (
                <tr key={index}>
                    {Object.keys(item).map((key, keyIndex) => (
                        <td key={keyIndex}>
                            <span className="title">{item[key]}</span>
                        </td>
                    ))}
                </tr>
            ));
            if (updatedRows?.length > 0) {
                setSeries(filteredData);
                setRows(updatedRows);
            } else {
                if (startDate == endDate) {
                    toast.info("Invalid dates. Please select the correct dates");
                } else {
                    toast.info("No data in the selected date range");
                }
                setDateRange([
                    new Date("2023-07-12T00:00:00+0000"),
                    new Date("2023-07-31T00:00:00+0000"),
                ]);
                setSeries(originalData);
                setRows(rows);
                setShowDatePicker(false);
            }
        }

        setShowDatePicker(false);
    }, [endDate]);

    const datePickerRef = useRef(null);

    const handleChart = () => {
        setState(!state);
        //@ts-ignore
        divRef.current = null;
    };

    useEffect(() => {
        console.log("triggering", accountIDforSummary);
        if (
            accountIDforSummary !== null &&
            (accountIDforSummary?.length || Object.keys(accountIDforSummary).length > 0)
        ) {
            //   console.log("accountIDforSummary", accountIDforSummary);
            try {
                api.get(`/account/returns/${accountIDforSummary}/${!absolute}`).then((res: any) => {
                    try {
                        const anualised = res.data.annualizedReturnList
                            .map((item: any) => ({
                                group: "Annulized",
                                date: item.date,
                                value: item.returnPercentage * 100,
                            }))
                            .slice(0, 15);
                        const periodic = res.data.periodReturns
                            .map((item: any) => ({
                                group: "Periodic",
                                date: item.startDate,
                                value: item.returnPercentage * 100,
                            }))
                            .slice(1, 15);

                        const combinedData = [...periodic];
                        setSeries(combinedData);
                        setOriginalData(combinedData);

                        const columns = Object.keys(combinedData[0] || []);
                        setColumns(columns);
                        const rows = combinedData.map((item, index) => (
                            <tr key={index}>
                                {Object.keys(item).map((key, keyIndex) => (
                                    <td key={keyIndex}>
                                        <span className="title">{item[key]}</span>
                                    </td>
                                ))}
                            </tr>
                        ));
                        setRows(rows);
                    } catch (error) {
                        console.error("Error occurred while processing return data:", error);
                    }
                });
            } catch (error) {
                console.error("Error occurred while fetching return data:", error);
            }
        }
    }, [accountIDforSummary, absolute]);

    const opts: LineChartOptions = {
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
            loading: series.length == 0,
        },
        theme: theme.theme == "light" ? "white" : "g100",
        curve: "curveMonotoneX",
        height: "30rem",
        width: "100%",
        toolbar: {
            enabled: true,
            controls: [
                {
                    type: ToolbarControlTypes.CUSTOM,
                    title: "customRetChart",
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
            loading: series.length == 0,
        },
        theme: theme.theme == "light" ? "white" : "g100",
        curve: "curveMonotoneX",
        height: "25rem",
        width: "100%",
        toolbar: {
            enabled: false,
        },
    };
    console.log("ser", series);

    let divRef = useRef<HTMLDivElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const toggleDatePicker = () => {
        setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const datePickerInputs = document.getElementsByClassName("cds--date-picker__calendar");

            console.log(datePickerInputs);
            const calendarIcon = document.getElementsByClassName("calendar-icon");
            if (datePickerInputs) {
                console.log(!!datePickerRef.current);
                if (
                    !datePickerRef.current &&
                    !datePickerInputs[0]?.contains(event.target as Node) &&
                    !calendarIcon[0]?.contains(event.target as Node)
                ) {
                    console.log("Inside--->");
                    setShowDatePicker(false);
                }
            } else if (datePickerRef.current) {
                console.log("OutSide--->");
                setShowDatePicker(false);
            }
        };

        document.addEventListener("click", handleClickOutside, true);

        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        const svgid = document.querySelector('[aria-label="customRetChart"]');

        let divElement = document.createElement("div");
        //@ts-ignore
        containerRef.current = divElement;
        divElement.className = "toolbarContainer";

        let firstContainer = document.createElement("div");
        firstContainer.className = "firstContainer";

        let title = document.createElement("h4");
        title.innerText = "Portfolio Return:";
        firstContainer.appendChild(title);
        divElement.appendChild(firstContainer);

        if (series.length > 0) {
            const element = document.createElement("div");

            ReactDOM.render(
                <Toggle
                    onToggle={(e) => {
                        handleCheckboxChange(e);
                    }}
                    size="sm"
                    id="1"
                    labelA="ABS"
                    labelB="REL"
                />,
                element
            );

            firstContainer.appendChild(element);

            divElement.appendChild(firstContainer);

            let img1 = document.createElement("img");
            img1.src = "/calendar.svg";
            img1.alt = "Calendar Icon";
            img1.classList.add("calendar-icon");
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

        if (svgid && series.length > 0 && divRef.current == null) {
            //@ts-ignore
            divRef.current = divElement;
            svgid.replaceWith(divElement);
        }
        console.log(svgid, series, divRef.current);
    }, [state, series, divRef.current]);

    const handleDateChange = (newValue: Date[]) => {
        setDateRange(newValue);
        if (moment(newValue[0])?.format("YYYYMMDD") != startDate) {
            setStartDate(moment(newValue[0])?.format("YYYYMMDD"));
        }
        if (moment(newValue[1])?.format("YYYYMMDD") != endDate) {
            setEndDate(moment(newValue[1])?.format("YYYYMMDD"));
        }
    };

    return (
        <section
            className={
                !state ? "history-overview" : "portfolio-overview portfolio-overview-bottom-padding"
            }
        >
            {!state ? (
                <div
                    className={
                        theme.theme === "light" ? "details-block" : "details-block-dark-mode"
                    }
                >
                    {!state && series.length === 0 ? (
                        <>
                            <Heading
                                variant={"h4"}
                                text={"Portfolio Return:"}
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
                            <StackedAreaChart options={opts} data={series as any} />
                        </Theme>
                    )}

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
                            text={"Portfolio Return:"}
                            style={{ whiteSpace: "nowrap", fontWeight: 600 }}
                        />
                        <span style={{ display: "flex", gap: "1rem", paddingRight: ".5rem" }}>
                            <ImageComponent
                                src="mic.svg"
                                alt="Microphone-icon"
                                style={{ width: "1.8rem", cursor: "pointer" }}
                                onClick={handleChart}
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

export default ReturnChart;
