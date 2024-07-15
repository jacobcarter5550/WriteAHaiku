import React, { useState, useEffect, useRef } from "react";

import Heading from "../../../ui-elements/headingTP.tsx";
import {
  ComboChart,
  LineChart,
  LineChartOptions,
  StackedAreaChart,
} from "@carbon/charts-react";
import "@carbon/charts-react/styles.css";
import api from "../../../helpers/serviceTP.ts";
import DynamicTable from "../../../helpers/dynamictableTP.tsx";
import { DatePicker, DatePickerInput, Toggle } from "@carbon/react";
import moment from "moment";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountIdForSummary } from "../../../store/portfolio/selector.ts";
import { useTheme } from "next-themes";
import ReactDOM from "react-dom";
import "../../../styles/charts.scss";
import {
  ComboChartOptions,
  ScaleTypes,
  ToolbarControlTypes,
} from "@carbon/charts";
import { Theme } from "@carbon/react";
import { getAbsoluteCharacter } from "../../../store/nonPerstistant/selectors.ts";
import { setAbsoluteCharacter } from "../../../store/nonPerstistant/index.ts";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";

interface DataItem {
  group: string;
  date: string;
  value: number;
}

function sortByDate(data: DataItem[]): DataItem[] {
  return data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

type CharacterChartProps = {
  setSecurityComparisonView: React.Dispatch<React.SetStateAction<boolean>>;
  comparedDataPortfolio: any;
  setComparisonType: React.Dispatch<React.SetStateAction<string>>;
};

const CharacteristicsChart: React.FC<CharacterChartProps> = ({
  setSecurityComparisonView,
  setComparisonType,
  comparedDataPortfolio,
}) => {
  const accountIDforSummary = useAppSelector(getAccountIdForSummary);
  const dispatch = useDispatch();
  const absoluteCharacter = useAppSelector(getAbsoluteCharacter);

  function dispatchAbsoluteCharacter(val: boolean) {
    dispatch(setAbsoluteCharacter(val));
  }

  const theme = useTheme();
  function convertArrayToDates(array: any[]) {
    return array.map((item) => {
      return {
        group: "Market Value",
        date: item.date,
        value: Math.floor(item.totalMarketValue),
      };
    });
  }

  const [chart, setChartDetails] = useState<any[]>([]);
  const [comboChartData, setComboChartData] = useState<any[]>([]);
  const [rows, setRows] = useState<JSX.Element[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [state, setState] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("20201001");
  const [endDate, setEndDate] = useState<string>("20240510");
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date("2020-10-01T00:00:00+0000"),
    new Date("2024-05-10T00:00:00+0000"),
  ]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const datePickerRef = useRef(null);

  const [series, setSeries] = useState<Object[]>([
    {
      data: [],
    },
  ]);

  const [options, setOptions] = useState<ComboChartOptions>({
    axes: {
      left: {
        scaleType: ScaleTypes.LINEAR,
        mapsTo: "value",
      },
      bottom: {
        scaleType: ScaleTypes.TIME,
        mapsTo: "date",
      },
      right: {
        scaleType: ScaleTypes.LINEAR,
        mapsTo: "value2",
        correspondingDatasets: ["new"],
      },
    },
    legend: {
      enabled: false,
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
          title: "Custom Combo",
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
        correspondingDatasets: ["Market Value"],
      },
      {
        type: "line",
        options: {
          points: {
            radius: 5,
          },
        },
        correspondingDatasets: ["Otherunder Preferred Stock Dividend"],
      },
    ],
  });

  useEffect(() => {
    console.log(options, opts2);
  }, [options]);


  const opts2: ComboChartOptions = {
    axes: {
      left: {
        title: "Score",
        mapsTo: "addedValue",
        main: true,
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
        mapsTo: `value`,
        correspondingDatasets: [
          "OtherunderPreferredStockDividend",
        ],
      },
    },
    legend: {
      //   enabled: false,
    },
    data: {
      loading: chart.length === 0 && comboChartData.length === 0,
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
          title: "Custom Combo",
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
        correspondingDatasets: [
          "OtherunderPreferredStockDividend",
          "DilutedEPS",
          "Market Value",
        ],
      },
    ],
  };
  useEffect(() => {
    const transformedData: any = [];

    if (comparedDataPortfolio?.securityAttributeValue) {
      console.log(
        comparedDataPortfolio?.securityAttributeValue,
        "comparedDataPortfolio"
      );
      Object.keys(comparedDataPortfolio?.securityAttributeValue).forEach(
        (key, upindex) => {
          const entries = comparedDataPortfolio.securityAttributeValue[key];
          entries.forEach((entry, index) => {
            console.log(entry, "transformedData", key);
            let obj = {
              group: key,
              date: entry.date,
            };
            const field = upindex === 0 ? "value" : "addedValue";
            obj[field] = entry.attributeValue;
            transformedData.push(obj);
          });
        }
      );

      updateCorrespondingDatasets(
        1,
        Object.keys(comparedDataPortfolio?.securityAttributeValue)
      );

      opts2.comboChartTypes[0].correspondingDatasets = Object.keys(
        comparedDataPortfolio?.securityAttributeValue
      );

      if (opts2 && opts2.axes && opts2.axes.right) {
        opts2.axes.right.correspondingDatasets = Object.keys(
          comparedDataPortfolio?.securityAttributeValue || {}
        );
      }

      console.log(transformedData, "transformedData");
      // setChartDetails((prev) => [...prev, ...transformedData]);
      setComboChartData((prev) => [...chart, ...transformedData]);

      let rows: JSX.Element[];
      if (transformedData?.length > 0) {
        rows = transformedData?.map((item, index) => (
          <tr key={index}>
            {Object.keys(item).map((key, keyIndex) => (
              <td key={keyIndex}>
                <span className="title">{item[key]}</span>
              </td>
            ))}
          </tr>
        ));
        setRows((prev) => [...prev, ...rows]);

        const seriesData = series[0]?.data;
        console.log(transformedData);
        transformedData?.map((item) => {
          seriesData.push(item?.value2);
        });

        setSeries([
          {
            data: seriesData,
          },
        ]);
      }
    }
  }, [comparedDataPortfolio]);

  const updateCorrespondingDatasets = (index, newDatasets) => {
    setOptions((prevOptions) => {
      const updatedComboChartTypes = [...prevOptions.comboChartTypes];
      updatedComboChartTypes[index] = {
        ...updatedComboChartTypes[index],
        correspondingDatasets: newDatasets,
      };
      return {
        ...prevOptions,
        comboChartTypes: updatedComboChartTypes,
      };
    });
  };
  const handleChart = () => {
    setState(!state);
    // @ts-ignore
    divRef.current = null;
  };

  useEffect(() => {
    console.log(comboChartData, "comboChartData");
  }, [comboChartData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const datePickerInputs = document.getElementsByClassName(
        "cds--date-picker__calendar"
      );

      const calendarIcon = document.getElementsByClassName(
        "calendar-icon-charact"
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
  useEffect(() => {
    // console.log("triggering", accountIDforSummary);
    if (
      accountIDforSummary !== null &&
      (accountIDforSummary?.length ||
        Object.keys(accountIDforSummary).length > 0) &&
      Object.keys(comparedDataPortfolio).length == 0
    ) {
      try {
        api
          .get(
            `/account/holding/trend/${accountIDforSummary}/${startDate}/${endDate}/${!absoluteCharacter}`
          )
          .then((res: any) => {
            console.log(res.data.marketValueTrend);
            let details = convertArrayToDates(res.data.marketValueTrend);

            setChartDetails(sortByDate(details));
            const columns = Object.keys(details[0] || []);
            setColumns(columns);

            let rows: JSX.Element[];
            if (details?.length > 0) {
              rows = details?.map((item, index) => (
                <tr key={index}>
                  {Object.keys(item).map((key, keyIndex) => (
                    <td key={keyIndex}>
                      <span className="title">{item[key]}</span>
                    </td>
                  ))}
                </tr>
              ));
              setRows(rows);
              setSeries([
                {
                  data: details.map((data) => data.value),
                },
              ]);
            } else {
              if (startDate == endDate) {
                toast.info("Invalid dates. Please select the correct dates");
              } else {
                toast.info("No data in the selected date range");
              }
              setDateRange([
                new Date("2020-10-01T00:00:00+0000"),
                new Date("2024-05-10T00:00:00+0000"),
              ]);
              setStartDate("20201001");
              setEndDate("20240510");
            }

            setShowDatePicker(false);
          });
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    }
    setShowDatePicker(false);
  }, [accountIDforSummary, endDate, absoluteCharacter, comparedDataPortfolio]);

  const toggleDatePicker = () => {
    setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
  };

  let divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svgid = document.querySelector('[aria-label="Custom Bro"]');

    let divElement = document.createElement("div");
    divElement.className = "toolbarContainer";

    let firstContainer = document.createElement("div");
    firstContainer.className = "firstContainer";

    let title = document.createElement("h4");
    title.innerText = "Portfolio Characs:";

    firstContainer.appendChild(title);
    divElement.appendChild(firstContainer);

    if (series.length > 0) {
      let button = document.createElement("div");
      button.onclick = () => {
        setComparisonType("characteristic");
        setSecurityComparisonView((e) => !e);
      };
      button.innerText = "Compare";
      button.className = "custom-icon compare-button widthHelper";
      firstContainer.appendChild(button);

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

      firstContainer.appendChild(element);

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

    if (svgid && series.length > 0 && divRef.current == null) {
      //@ts-ignore
      divRef.current = divElement;
      svgid.replaceWith(divElement);
    }
  }, [state, series]);

  const handleDateChange = (newValue: Date[]) => {
    setDateRange(newValue);
    if (moment(newValue[0])?.format("YYYYMMDD") != startDate) {
      setStartDate(moment(newValue[0])?.format("YYYYMMDD"));
    }
    if (moment(newValue[1])?.format("YYYYMMDD") != endDate) {
      setEndDate(moment(newValue[1])?.format("YYYYMMDD"));
    }
  };

  function formatNumber(num: number): string {
    if (Math.abs(num) >= 1e12) {
      return (num / 1e12).toFixed(3).replace(/\.?0+$/, "") + "t";
    } else if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toFixed(3).replace(/\.?0+$/, "") + "b";
    } else if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(3).replace(/\.?0+$/, "") + "m";
    } else if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(3).replace(/\.?0+$/, "") + "k";
    } else {
      return num.toString();
    }
  }

  const opts: LineChartOptions = {
    axes: {
      left: {
        ticks: {
          formatter: (e) => {
            if (typeof e == "number") {
              return formatNumber(e);
            } else {
              return JSON.stringify(e);
            }
          },
        },
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
      loading: chart.length == 0,
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
          title: "Custom Bro",
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
          <Theme theme={theme.theme == "light" ? "white" : "g100"}>
            {!(comboChartData?.length > 0) ? (
              <LineChart data={chart} options={opts} />
            ) : (
              <ComboChart data={comboChartData} options={opts2} />
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
              text={"Portfolio Characs:"}
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

export default CharacteristicsChart;
