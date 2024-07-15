import React, { useEffect, useState } from "react";
import CustomSelect from "../../../../ui-elements/selectTP.tsx";
import { useTheme } from "next-themes";
import {
    GroupedBarChart,
    LineChart,
    ScaleTypes,
    ToolbarControlTypes,
    SimpleBarChart,
} from "@carbon/charts-react";
import ImageComponent from "../../../../ui-elements/ImageComponent.tsx";
import api from "../../../../helpers/serviceTP.ts";
import { PerShareData, SecurityDataType } from "../types.ts";
import { Security } from "../securtityViewTP.tsx";
import { formatNumber } from "../../../portfolio/charts/utils.ts";

type Props = {
    individualSecurity: Security | null;
};

const transformData = (data: { [key: string]: any }) => {
    return Object.keys(data).map((key) => ({
        group: "Dataset 1",
        key: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        value: data[key],
    }));
};

const RatiosOverviewComp = ({ individualSecurity }: Props) => {
    const theme = useTheme();
    const [options, setOptions] = useState({
        fill: [{ value: "filled in", label: "filled in" }],
    });
    const [selected, setSelected] = useState({
        fill: [{ value: "filled in", label: "Stock_001" }],
    });

    const [priceVolumeData, setPriceVolumeData] = useState<any>({
        title: "PRICE",
        rows: [
            { label: "Close", value: null },
            { label: "52 Wk High", value: null },
            { label: "52 Wk Low", value: null },
            { label: "1-Day % Change", value: null },
            { label: "1M % Change", value: null },
            { label: "3M % Change", value: null },
            { label: "6M % Change", value: null },
            { label: "1Y % Change", value: null },
            { label: "YTD % Change", value: null },
            { label: "Daily Vol", value: null },
            { label: "Avg Daily Vol (M)", value: null },
            { label: "Beta", value: null },
        ],
    });

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
                scaleType: "labels",
                mapsTo: "key",
            },
        },
        legend: { enabled: false },
        toolbar: false,
        theme: theme.theme === "light" ? "white" : "g100",
        height: "86%",
        width: "96%",
    };

    const [securityData, setSecurityData] = useState<SecurityDataType>({
        data: [],
        options: defOptions,
        options2: defOptions,
    });
    const [profitabilityData, setProfitabilityData] = useState<SecurityDataType>({
        data: [],
        options: defOptions,
        options2: defOptions,
    });

    const [perShareData, setPerShareData] = useState<PerShareData>({
        title: "PER SHARE",
        rows: [
            { label: "Revenue/Shr", value1: null, value2: null, value3: null },
            { label: "EPS", value1: null, value2: null, value3: null },
            { label: "EPS Diluted", value1: null, value2: null, value3: null },
            { label: "Div/Shr", value1: null, value2: null, value3: null },
            { label: "Cash/Shr", value1: null, value2: null, value3: null },
            { label: "Operating CF/Shr", value1: null, value2: null, value3: null },
            { label: "Bk Val/Shr", value1: null, value2: null, value3: null },
            {
                label: "Tangible Bk Value/Shr",
                value1: null,
                value2: null,
                value3: null,
            },
        ],
    });
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minWidth: "5vw",
            maxWidth: "17rem",
            width: "17rem", // Set your desired width here
            borderRadius: "0",
            fontSize: "1.2rem",
            minHeight: "1.5rem",
            height: "2.55rem",
            border: theme.theme == "light" ? "1px solid #8d8d8d" : "1px solid #383a3e",
            borderWidth: "0px",
            cursor: "pointer",
            backgroundColor: theme.theme == "light" ? "#f4f4f4" : "#0D0D0D",
            position: "unset",
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "0px",
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            padding: "0px",
            height: "-webkit-fill-available",
        }),
    };

    const incomeData = {
        title: "INCOME",
        rows: [
            {
                label: "BEF Tax Normalized, LFY:",
                value: "74, 187.00",
            },
            {
                label: "Aft Tax, Normalized, LFY:",
                value: "13,906.00",
            },
            {
                label: "Avail Comm, Normalized, LFY:",
                value: "13,768.00",
            },
        ],
    };
    const profitData = {
        title: "PROFITABIITY RATIOS (%)",
        rows: [
            {
                fieldName: "Gross Profit% Margin:",
                LFI: "31.43%",
                LTM: "31.43%",
                LFY: "31.43%",
            },
            {
                fieldName: "EBITDA % Margin:",
                LFI: "33.2%",
                LTM: "33.2%",
                LFY: "33.2%",
            },
            {
                fieldName: "Oper Income % Margin:",
                LFI: "31.55%",
                LTM: "31.55%",
                LFY: "31.55%",
            },
        ],
    };
    const valuationData = {
        title: "VALUATION RATIOS (USD)",
        rows: [
            {
                fieldName: "Curr Price/ Rev/ Shr:",
                Anul1: "1.01",
                Anul2: "",
                Anul3: "1.15",
                Anul4: "1.27",
            },
            {
                fieldName: "Curr P/E Excl Extra, LTM:",
                Anul1: "",
                Anul2: "1.17",
                Anul3: "",
                Anul4: "",
            },
            {
                fieldName: "P/E Exci. Extra Items:",
                Anul1: "1.01",
                Anul2: "",
                Anul3: "1.15",
                Anul4: "1.27",
            },
            {
                fieldName: "Curr P/E Normalized, LFY:",
                Anul1: "",
                Anul2: "",
                Anul3: "1.15",
                Anul4: "",
            },
            {
                fieldName: "Curr Price/CF/Shr:",
                Anul1: "1.01",
                Anul2: "",
                Anul3: "1.15",
                Anul4: "1.27",
            },
        ],
    };
    const valuationData2 = {
        rows: [
            {
                fieldName: "Current Mkt Cap (M):",
                value: "301,262.00",
            },
            {
                fieldName: "(+) Tot Debt Cap, LFY (m):",
                value: "46,503.00",
            },
            {
                fieldName: "(-) Cash & Equiv, LFY (m):",
                value: "5.669.00",
            },
            {
                fieldName: "(=) Curr EV, LFY (m):",
                value: "342,450.42",
            },
        ],
    };
    const getOverviewData = async () => {
        try {
            const response = await api.get(
                `${process.env.REACT_APP_HOST_IP_ADDRESS}/api/security/financials/${individualSecurity?.securityId}`
            );
            const result = await response.data;

            setPriceVolumeData((prevState) => ({
                ...prevState,
                rows: prevState.rows.map((row) => {
                    const getValue = (value) => (value === null ? "-" : value);

                    switch (row.label) {
                        case "Close":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.previousClose
                                ),
                            };
                        case "52 Wk High":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.yearHigh
                                ),
                            };
                        case "52 Wk Low":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.yearLow
                                ),
                            };
                        case "1-Day % Change":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.oneDayChange
                                ),
                            };
                        case "1M % Change":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.oneMonthChange
                                ),
                            };
                        case "3M % Change":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.threeMonthChange
                                ),
                            };
                        case "6M % Change":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.sixMonthChange
                                ),
                            };
                        case "1Y % Change":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.oneYearChange
                                ),
                            };
                        case "YTD % Change":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.ytdChange
                                ),
                            };
                        case "Daily Vol":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.volume
                                ),
                            };
                        case "Avg Daily Vol (M)":
                            return {
                                ...row,
                                value: getValue(
                                    response?.data?.securityFinancialPriceVolume?.avgVolume
                                ),
                            };
                        case "Beta":
                            return {
                                ...row,
                                value: getValue(response?.data?.securityFinancialPriceVolume?.beta),
                            };
                        default:
                            return row;
                    }
                }),
            }));

            const transformedSecurityData = transformData(
                response?.data?.securityFinancialIncomeStatement
            );
            setSecurityData((prevState) => ({
                ...prevState,
                data: transformedSecurityData,
            }));

            const transformedProfitabilityData = transformData(
                response?.data?.securityFinancialProfitabilityRatios
            );
            console.log("transformedProfitabilityData", transformedProfitabilityData);
            setProfitabilityData((prevState) => ({
                ...prevState,
                data: transformedProfitabilityData,
            }));

            const updatePerShareData = (res) => {
                const updatedRows = perShareData.rows.map((row) => {
                    const label = row.label;
                    let value1, value2, value3;

                    switch (label) {
                        case "Revenue/Shr":
                            value1 = res.revenue || null;
                            value2 = res.revenue || null;
                            value3 = res.revenue || null;
                            break;
                        case "EPS":
                            value1 = res.eps || null;
                            value2 = res.eps || null;
                            value3 = res.eps || null;
                            break;
                        case "EPS Diluted":
                            value1 = res.epsDiluted || null;
                            value2 = res.epsDiluted || null;
                            value3 = res.epsDiluted || null;
                            break;
                        case "Div/Shr":
                            value1 = res.dividendPerShareTTM || null;
                            value2 = res.dividendPerShareTTM || null;
                            value3 = res.dividendPerShareTTM || null;
                            break;
                        case "Cash/Shr":
                            value1 = res.cashPerShareTTM || null;
                            value2 = res.cashPerShareTTM || null;
                            value3 = res.cashPerShareTTM || null;
                            break;
                        case "Operating CF/Shr":
                            value1 = res.operatingCashFlowPerShareTTM || null;
                            value2 = res.operatingCashFlowPerShareTTM || null;
                            value3 = res.operatingCashFlowPerShareTTM || null;
                            break;
                        case "Bk Val/Shr":
                            value1 = res.bookValuePerShareTTM || null;
                            value2 = res.bookValuePerShareTTM || null;
                            value3 = res.bookValuePerShareTTM || null;
                            break;
                        case "Tangible Bk Value/Shr":
                            value1 = res.tangibleBookValuePerShareTTM || null;
                            value2 = res.tangibleBookValuePerShareTTM || null;
                            value3 = res.tangibleBookValuePerShareTTM || null;
                            break;
                        default:
                            value1 = null;
                            value2 = null;
                            value3 = null;
                    }

                    return {
                        ...row,
                        value1,
                        value2,
                        value3,
                    };
                });

                setPerShareData((prevState) => ({
                    ...prevState,
                    rows: updatedRows,
                }));
            };

            updatePerShareData(response.data.securityFinancialPerShare);

            console.log("result", result);
        } catch (err) {
            console.log("Error", err.message);
        }
    };
    useEffect(() => {
        getOverviewData();
    }, []);

    useEffect(() => {
        getOverviewData();
    }, [individualSecurity]);
    return (
        <section className="ratios-overview-container">
            <header className="ratios-overview-header">
                <div className="ratios-overview-header-left">
                    <h1>RATIOS-OVERVIEW</h1>
                    <img src="./subtract--alt.svg" alt="subtract" style={{ width: "1.5rem" }} />
                    <h4>United States (XOM)</h4>
                </div>
                <div className="right-section-container">
                    <div className="fill-container">
                        <span>Filled in</span>
                        <CustomSelect
                            options={options.fill}
                            placeholder="Stock_001"
                            customWidth="17rem"
                            // value={selected.fill}
                            onChange={(selectedOption) => {
                                setSelected({
                                    ...selected,
                                    fill: selectedOption,
                                });
                            }}
                            styles={customStyles}
                        />
                    </div>
                    <div className="excel-file">
                        <img src="./excel-file.svg" alt="Excel File" style={{ width: "2.2rem" }} />
                    </div>
                </div>
            </header>
            <div className="divider"></div>
            <div>RATIOS AND ANALYTICS (LFI: 3O SEP- 2018)</div>
            <aside className="ratios-overview-graph-container">
                <section className="ratios-overview-graph-container-item item1">
                    <div className="price-and-volume-section section-common">
                        <div className="header-icon-container">
                            <h4>PRICE & VOLUME(USD)</h4>
                            <div className="icon-containers">
                                <ImageComponent
                                    src="calendar.svg"
                                    alt="calendar-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="mic.svg"
                                    alt="mic-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="menu.svg"
                                    alt="menu-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="export.svg"
                                    alt="export-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="maximize 1.svg"
                                    alt="maximize 1-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                            </div>
                        </div>
                        <div className="price-and-volume-table-container">
                            <p>Price & Volume (USD)</p>
                            <table className="price-and-volume-table">
                                {priceVolumeData.rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.label}</td>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                    <div className="price-and-volume-section section-common">
                        <div className="header-icon-container">
                            <h4>PER SHARE</h4>
                            <div className="icon-containers">
                                <ImageComponent
                                    src="calendar.svg"
                                    alt="calendar-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="mic.svg"
                                    alt="mic-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="menu.svg"
                                    alt="menu-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="export.svg"
                                    alt="export-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="maximize 1.svg"
                                    alt="maximize 1-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                            </div>
                        </div>
                        <div className="price-and-volume-table-container">
                            <p>Per Share</p>
                            <table className="price-and-volume-table">
                                <tr>
                                    <th></th>
                                    <th>LFI</th>
                                    <th>LTM</th>
                                    <th>LFY</th>
                                </tr>
                                {perShareData.rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.label}</td>
                                        <td>{row.value1}</td>
                                        <td>{row.value2}</td>
                                        <td>{row.value3}</td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                </section>
                <section className="ratios-overview-graph-container-item">
                    <div className="price-and-volume-section section-common">
                        <div className="header-icon-container">
                            <h4>INCOME STATEMENT</h4>
                            <div className="icon-containers">
                                <ImageComponent
                                    src="calendar.svg"
                                    alt="calendar-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="mic.svg"
                                    alt="mic-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="menu.svg"
                                    alt="menu-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="export.svg"
                                    alt="export-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="maximize 1.svg"
                                    alt="maximize 1-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                            </div>
                        </div>

                        <div style={{ maxWidth: "550px", margin: "auto", height: "17.6rem" }}>
                            <p style={{ padding: ".3rem 0" }}>Income Statement (USD, M)</p>
                            <SimpleBarChart
                                data={securityData.data.map((d) => ({
                                    ...d,
                                    key: d.key.substring(0, 4) + "...",
                                }))}
                                // data={securityData.data}
                                options={securityData.options}
                            />
                        </div>
                        {/* <div className="price-and-volume-table-container">
                            <p>INCOME</p>
                            <table className="price-and-volume-table">
                                <tr>
                                    <th></th>
                                    <th>LFI</th>
                                    <th>LTM</th>
                                    <th>LFY</th>
                                </tr>
                                {incomeData.rows.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: "700" }}>{row.label}</td>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </table>
                        </div> */}
                    </div>
                    <div className="price-and-volume-section section-common">
                        <div className="header-icon-container">
                            <h4>PROFITABILITY RATIOS</h4>
                            <div className="icon-containers">
                                <ImageComponent
                                    src="calendar.svg"
                                    alt="calendar-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="mic.svg"
                                    alt="mic-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="menu.svg"
                                    alt="menu-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="export.svg"
                                    alt="export-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="maximize 1.svg"
                                    alt="maximize 1-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                            </div>
                        </div>
                        <div style={{ maxWidth: "550px", margin: "auto", height: "17.6rem" }}>
                            <p style={{ padding: ".3rem 0" }}>Profitability Ratios (%)</p>
                            <SimpleBarChart
                                // data={profitabilityData.data}
                                data={profitabilityData.data.map((d) => ({
                                    ...d,
                                    key: d.key.substring(0, 4) + "...",
                                }))}
                                options={profitabilityData.options}
                            />
                        </div>
                        {/* <div className="price-and-volume-table-container">
                            <table className="price-and-volume-table" style={{ margin: "2rem 0" }}>
                                <tr>
                                    <th></th>
                                    <th>LFI</th>
                                    <th>LTM</th>
                                    <th>LFY</th>
                                </tr>
                                {profitData.rows.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: "700" }}>{row.fieldName}</td>
                                        <td>{row.LFI}</td>
                                        <td>{row.LTM}</td>
                                        <td>{row.LFY}</td>
                                    </tr>
                                ))}
                            </table>
                        </div> */}
                    </div>
                    <div className="price-and-volume-section section-common">
                        <div className="header-icon-container">
                            <h4>GROWTH RATES</h4>
                            <div className="icon-containers">
                                <ImageComponent
                                    src="calendar.svg"
                                    alt="calendar-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="mic.svg"
                                    alt="mic-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="menu.svg"
                                    alt="menu-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="export.svg"
                                    alt="export-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="maximize 1.svg"
                                    alt="maximize 1-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                            </div>
                        </div>

                        <div style={{ maxWidth: "550px", margin: "auto", height: "17.6rem" }}>
                            <p style={{ padding: ".3rem 0" }}>Growth Rates</p>
                            <SimpleBarChart
                                // data={securityData.data}
                                data={securityData.data.map((d) => ({
                                    ...d,
                                    key: d.key.substring(0, 4) + "...",
                                }))}
                                options={securityData.options}
                            />
                        </div>
                    </div>
                </section>
                <section className="ratios-overview-graph-container-item">
                    <div className="price-and-volume-section section-common">
                        <div className="header-icon-container">
                            <h4>VALUATION RATIOS</h4>
                            <div className="icon-containers">
                                <ImageComponent
                                    src="calendar.svg"
                                    alt="calendar-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="mic.svg"
                                    alt="mic-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="menu.svg"
                                    alt="menu-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="export.svg"
                                    alt="export-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="maximize 1.svg"
                                    alt="maximize 1-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                            </div>
                        </div>
                        <div className="price-and-volume-table-container">
                            <p>Valuation Ratios (USD)</p>
                            <table className="price-and-volume-table">
                                <tr>
                                    <th></th>
                                    <th>Anul1</th>
                                    <th>Anul2</th>
                                    <th>Anul3</th>
                                    <th>Anul4</th>
                                </tr>
                                {valuationData.rows.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: "700" }}>{row.fieldName}</td>
                                        <td>{row.Anul1}</td>
                                        <td>{row.Anul2}</td>
                                        <td>{row.Anul3}</td>
                                        <td>{row.Anul4}</td>
                                    </tr>
                                ))}
                                {valuationData2.rows.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: "700" }}>{row.fieldName}</td>
                                        <td colSpan={4}>{row.value}</td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>
                    <div className="price-and-volume-section section-common">
                        <div className="header-icon-container">
                            <h4>FINANCIAL STRENGTH</h4>
                            <div className="icon-containers">
                                <ImageComponent
                                    src="calendar.svg"
                                    alt="calendar-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="mic.svg"
                                    alt="mic-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="menu.svg"
                                    alt="menu-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="export.svg"
                                    alt="export-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                                <ImageComponent
                                    src="maximize 1.svg"
                                    alt="maximize 1-icon"
                                    style={{ marginRight: ".5em", width: "1.6rem" }}
                                />
                            </div>
                        </div>
                        <div style={{ maxWidth: "550px", margin: "auto", height: "23.2rem" }}>
                            <p style={{ padding: ".3rem 0" }}>Financial Strength</p>
                            <SimpleBarChart
                                // data={securityData.data}
                                data={securityData.data.map((d) => ({
                                    ...d,
                                    key: d.key.substring(0, 4) + "...",
                                }))}
                                options={securityData.options2}
                            ></SimpleBarChart>
                        </div>
                    </div>
                </section>
            </aside>
        </section>
    );
};

export default RatiosOverviewComp;
