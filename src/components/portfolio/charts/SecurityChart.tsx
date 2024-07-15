import React, { useState, useEffect, useRef } from "react";
import { LineChart, LineChartOptions } from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import api from "../../../helpers/serviceTP.ts";

import { DatePicker, DatePickerInput } from "@carbon/react";
import DynamicTable from "../../../helpers/dynamictableTP.tsx";

import moment from "moment";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountDetails } from "../../../store/portfolio/selector.ts";

import { useTheme } from "next-themes";
import "../../../styles/charts.scss";
import { ScaleTypes, ToolbarControlTypes } from "@carbon/charts";
import { Theme } from "@carbon/react";
import { toast } from "react-toastify";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import Heading from "../../../ui-elements/headingTP.tsx";

interface Props {
  setSecurityComparisonView: React.Dispatch<React.SetStateAction<boolean>>;
  comparedDataSecurity: any;
  setComparisonType: React.Dispatch<React.SetStateAction<string>>;
}

const SecurityChart: React.FC<Props> = ({
  setSecurityComparisonView,
  comparedDataSecurity,
  setComparisonType,
}) => {
  const accountDetails = useAppSelector(getAccountDetails);
  const theme = useTheme();
  const [rows, setRows] = useState<JSX.Element[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [state, setState] = useState(false);
  const [securityData, setSecurityData] =
    useState<{ group: stringw; date: string; value: number }[]>();
  const [showControlBar, setShowControlBar] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("20221001");
  const [endDate, setEndDate] = useState<string>("20221101");
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date("2022-10-01T00:00:00+0000"),
    new Date("2022-11-01T00:00:00+0000"),
  ]);
  const datePickerRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const [series, setSeries] = useState<Object[]>([
    {
      data: [],
    },
  ]);

  useEffect(() => {
    const transformedData: any = [];

    if (comparedDataSecurity?.securityAttributeValue) {
      Object.keys(comparedDataSecurity?.securityAttributeValue).forEach(
        (key) => {
          const entries = comparedDataSecurity.securityAttributeValue[key];
          console.log(key, "transformedData");
          entries.forEach((entry) => {
            transformedData.push({
              date: entry.date,
              group: key.replace(/([A-Z])/g, " $1").toLowerCase(),
              value: entry.attributeValue,
            });
          });
        }
      );

      console.log(transformedData, "transformedData");
      setTestState((prev) => [...prev, ...transformedData]);
    }
    // Process Diluted EPS
  }, [comparedDataSecurity]);

  const handleChart = () => {
    setState(!state);
    //@ts-ignore
    divRef.current = null;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const datePickerInputs = document.getElementsByClassName(
        "cds--date-picker__calendar"
      );

      const calendarIcon = document.getElementsByClassName(
        "calendar-icon-security"
      );
      if (datePickerInputs) {
        if (
          !datePickerRef.current &&
          !datePickerInputs[0]?.contains(event.target as Node) &&
          !calendarIcon[0]?.contains(event.target as Node)
        ) {
          // console.log("Inside--->");
          setShowDatePicker(false);
        }
      } else if (datePickerRef.current) {
        // console.log("OutSide--->");
        setShowDatePicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const [testState, setTestState] = useState<any>([]);

  useEffect(() => {
    if (
      accountDetails &&
      accountDetails.securityId &&
      Object.keys(comparedDataSecurity).length == 0
    ) {
      try {
        api
          .get(
            `/security/returns/${accountDetails.securityId}/${startDate}/${endDate}`
          )
          .then((res: any) => {
            console.log("res", res.data);
            const formatted = res.data.dailyReturns?.map((item) => {
              return {
                date: item.date,
                value: item.returns,
                group: "Portfolio Characteristics",
              };
            });
            if (formatted?.length > 0) {
              setTestState(formatted);
            } else {
              if (startDate == endDate) {
                toast.info("Invalid dates. Please select the correct dates");
              } else {
                toast.info("No data in the selected date range");
              }
              setDateRange([
                new Date("2022-10-01T00:00:00+0000"),
                new Date("2022-11-01T00:00:00+0000"),
              ]);
              setStartDate("20221001");
              setEndDate("20221101");
            }
            try {
              const data = res.data.dailyReturns?.map((item: any) => ({
                group: "Return",
                date: item.date,
                value: item.returns,
              }));
              setSecurityData(data);
              if (data != undefined) {
                const columns = Object.keys(data[0] || []);
                setColumns(columns);
                const rows = data?.map((item, index) => (
                  <tr key={index}>
                    {Object.keys(item).map((key, keyIndex) => (
                      <td key={keyIndex}>
                        <span className="title">{item[key]}</span>
                      </td>
                    ))}
                  </tr>
                ));
                setRows(rows);

                console.log(data);
                setSeries([
                  {
                    data: data.map((data) => data.value.toFixed(2)),
                  },
                ]);
              }
            } catch (error) {
              console.error(
                "Error occurred while processing response data:",
                error
              );
            }
          });
      } catch (error) {
        console.error("Error occurred while fetching security returns:", error);
      }
    }
    setShowDatePicker(false);
  }, [accountDetails, endDate, comparedDataSecurity]);

  useEffect(() => {
    securityData && securityData?.length > 0 && setShowControlBar(true);
  }, [securityData]);
  const toggleDatePicker = () => {
    setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
  };

  const handleDateChange = (newValue: Date[]) => {
    setDateRange(newValue);
    if (moment(newValue[0])?.format("YYYYMMDD") != startDate) {
      setStartDate(moment(newValue[0])?.format("YYYYMMDD"));
    }
    if (moment(newValue[1])?.format("YYYYMMDD") != endDate) {
      setEndDate(moment(newValue[1])?.format("YYYYMMDD"));
    }
  };
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
      loading: testState?.length == 0,
    },

    theme: theme.theme == "light" ? "white" : "g100",
    curve: "curveMonotoneX",
    height: !state && testState.length === 0 ? "25rem" : "30rem",
    width: "100%",
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
      loading: testState?.length == 0,
    },

    theme: theme.theme == "light" ? "white" : "g100",
    curve: "curveMonotoneX",
    height: "25rem",
    width: "100%",
    toolbar: {
      enabled: false,
    },
  };

  let divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svgid = document.querySelector('[aria-label="customSecChart"]');

    let divElement = document.createElement("div");
    divElement.className = "toolbarContainer";

    let firstContainer = document.createElement("div");
    firstContainer.className = "firstContainer";

    let title = document.createElement("h4");
    title.innerText = "Security Characs:";
    firstContainer.appendChild(title);

    let button = document.createElement("div");
    button.onclick = () => {
      setComparisonType("security");
      setSecurityComparisonView((e) => !e);
    };
    button.innerText = "Compare";
    button.className = "custom-icon compare-button widthHelper";
    firstContainer.appendChild(button);

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

    if (svgid && testState.length > 0 && divRef.current == null) {
      // @ts-ignore
      divRef.current = divElement;
      svgid.replaceWith(divElement);
    }
  }, [state, testState]);

  console.log("testState-->", testState, state);

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
            theme.theme === "light"
              ? "details-block"
              : "details-block-dark-mode"
          }
        >
          {!state && testState.length === 0 ? (
            <>
              <Heading
                variant={"h4"}
                text={"Security Characs:"}
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  paddingLeft: "1rem",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              />

              <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                <LineChart options={opts1} data={[]} />
              </Theme>
            </>
          ) : (
            <Theme theme={theme.theme == "light" ? "white" : "g100"}>
              <LineChart options={opts} data={testState as any} />
            </Theme>
          )}

          {showControlBar && (
            <div className="control-bar">
              <ImageComponent
                src="calendar.svg"
                alt="calendar-icon"
                style={{ width: "1.4rem" }}
                onClick={toggleDatePicker}
                title="Calender"
              />
              <ImageComponent src="mic.svg" alt="Microphone-icon" title="Mic" />
              <ImageComponent
                src="convert.svg"
                alt="convert-icon"
                style={{ width: "1.5rem", cursor: "pointer" }}
                onClick={handleChart}
                title="Convert"
              />
            </div>
          )}
          {showDatePicker && (
            <div className="date-range-selector" ref={datePickerRef}>
              <DatePicker
                datePickerType="range"
                closeOnSelect={true}
                onChange={(newValue) => handleDateChange(newValue)}
                value={dateRange}
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
              text={"Security Characs:"}
              style={{
                whiteSpace: "nowrap",
                fontWeight: 600,
                paddingLeft: "1rem",
              }}
            />
            <span
              style={{ display: "flex", gap: "1rem", paddingRight: ".5rem" }}
            >
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

export default SecurityChart;
