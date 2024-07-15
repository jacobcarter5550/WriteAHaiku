/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import Heading from "../../ui-elements/headingTP.tsx";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import api, { getLocalAccessToken } from "../../helpers/serviceTP.ts";
import ImageComponent from "../../ui-elements/ImageComponent.tsx";
import axios from "axios";

type SeriesData = {
  x: string;
  y: number[];
  fillColor: string;
  rangeName: string;
};

type WashSaleData = {
  washSaleId: number;
  accountId: number;
  securityId: string;
  securityCd: string;
  securityName: string;
  saleDate: string;
  salePrice: number;
  daysAfterSale: number;
  buybackPrice: number;
};

const Visualisation: React.FC<{
  accountId: number | null;
  isWashSaleOpen: boolean;
  setIsWashSaleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ accountId, isWashSaleOpen, setIsWashSaleOpen }) => {
  const location = useLocation();

  const [sellingPrice, setSellingPrice] = useState<
    { name: string; price: number }[] | null
  >(null);

  const [currnetPrice, setCurrentPrice] = useState<
    { name: string; price: number }[] | null
  >(null);

  const [series, setSeries] = useState<{ data: SeriesData[] }[] | null>(null);

  function convertToSecurityIds(array) {
    let result = "";
    array?.forEach((item, index) => {
      result += `securityIds=${item.name}`;
      if (index < array.length - 1) {
        result += "&";
      }
    });
    return result;
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function convertDataToSeriesFormat(data): { data: SeriesData[] }[] {
    const mapped = [
      {
        data: data.map((item) => ({
          x: item.securityName,
          y: [
            new Date(item.saleDate).getTime(),
            new Date(item.saleDate).getTime() + 30 * 24 * 60 * 60 * 1000,
          ],
          fillColor: getRandomColor(),
        })),
      },
    ];
    return mapped;
  }

  useEffect(() => {
    if (accountId) {
      api
        .get<WashSaleData[]>(
          `${process.env.REACT_APP_TAX_ADVISOR}/api/washSales/getWashSalesDetails?accountId=${accountId}`
        )
        .then((res) => {
          console.log(res.data);
          const priceData = res.data.map((item) => {
            return {
              name: item.securityCd,
              price: item.salePrice,
            };
          });
          const createdSeries = convertDataToSeriesFormat(res.data);
          console.log(createdSeries);
          setSeries(createdSeries);
          setSellingPrice(priceData);
        });
    }
  }, [accountId]);

  function updatePrice() {
    if (sellingPrice && sellingPrice.length > 0) {
      console.log(sellingPrice);
      //   api
      //     .get(
      //       `${
      //         process.env.REACT_APP_TAX_ADVISOR
      //       }/api/washSales/getSecurityPrice?${convertToSecurityIds(
      //         sellingPrice
      //       )}`
      //     )
      //     .then((res) => {
      //       console.log(res);
      //       const currentPriceData = res.data.map((item) => {
      //         return {
      //           name: item.securityCd,
      //           price: item.price,
      //         };
      //       });
      //       setCurrentPrice(currentPriceData);
      //     });
      const authToken = getLocalAccessToken();

      axios
        .get(
          `${
            process.env.REACT_APP_TAX_ADVISOR
          }/api/washSales/getSecurityPrice?${convertToSecurityIds(
            sellingPrice
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((res) => {
          const currentPriceData = res.data.data.map((item) => ({
            name: item.securityCd,
            price: item.price,
          }));
          setCurrentPrice(currentPriceData);
        })
        .catch((error) => {
          console.error("Error fetching security prices:", error);
        });
    }
  }

  useEffect(() => {
    if (location.pathname === "/tax") {
      updatePrice();
      const intervalId = setInterval(() => {
        updatePrice();
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [location.pathname, sellingPrice]);

  const theme = useTheme();

  const [options, setOptions] = useState<ApexCharts.ApexOptions>({
    chart: {
      width: 500,
      type: "rangeBar", // Moved type to options
    },
    annotations: {
      xaxis: [
        {
          x: new Date().getTime(),
          strokeDashArray: 0,
          borderColor: "#775DD0",
          label: {
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: "Today",
          },
        },
      ],
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
        barHeight: "40%", // Adjust the height of the bars here
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: any, opts: any) {
        var label = opts.w.globals.labels[opts.dataPointIndex];
        var a = moment(val[0]);
        var b = moment(val[1]);
        var diff = b.diff(a, "days");
        return label + ": " + diff + (diff > 1 ? " days" : " day");
      },
      style: {
        colors: ["#f3f4f5", "#fff"],
      },
    },
    xaxis: {
      type: "datetime",
      min: new Date(
        new Date().getFullYear() - 1,
        new Date().getMonth(),
        new Date().getDate()
      ).getTime(), // Set minimum date (11 months ago)
      max: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      ).getTime(), // Set maximum date (1 month ahead)
      tickAmount: 12, // Show ticks for each month
      position: "top",
      labels: {
        format: "MMM", // Display month abbreviations
        style: {
          colors: "#333", // Change text color
        },
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      row: {
        colors: [],
      },
    },
  });

  // Effect to update options when theme changes
  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      tooltip: {
        ...prevOptions.tooltip,
        theme: theme.theme,
        fill: {
          colors: theme.theme === "dark" ? ["#222"] : ["#fff"],
        },
      },
    }));
  }, [theme.theme]); // Only re-run the effect if theme changes

  const [priceListHeight, setPriceListHeight] = useState(180);

  const priceLength = sellingPrice?.length ?? 0;

  useEffect(() => {
    if (sellingPrice) {
      setPriceListHeight(priceLength * 52.5);
    }
  }, [sellingPrice]);

  const basePadding = 0.125; // Minimum padding in rem
  const scaleFactor = 0.15; // Scale factor to adjust the impact of the logarithm
  const linearComponent = 0.05; // Small linear component to slightly increase with item count

  const padding = `${
    basePadding +
    scaleFactor * Math.log10(priceLength + 1) +
    linearComponent * priceLength
  }rem`;

  return (
    <>
      <div className="visualisation-wrapper">
        <div className="header-box">
          <div className="header-box-header">
            <Heading text="Wash Sales Catch-up Visualization" variant="h2" />
            <Tooltip
              title={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div>
                    <strong>Red</strong> = Out of Money. I.e. Current buy-back
                    price is higher than sold price. More red refers to more
                    "out of the money".
                  </div>
                  <div>
                    <strong>White</strong> = Neither in the money, nor out of
                    the money.
                  </div>
                  <div>
                    <strong>Green</strong> = In the Money. I.e. Current buy-back
                    price is lower than sold price. More green refers to more
                    "in the money".
                  </div>
                </div>
              }
              placement="right-start"
            >
              <ImageComponent
                src="information 2.svg"
                alt="information-icon"
                style={{ width: "1.4rem" }}
              />
            </Tooltip>
          </div>

          {isWashSaleOpen ? (
            <ImageComponent
              src="expandUp.svg"
              alt="expandUp"
              style={{
                width: "2.3rem",
                height: "2.3rem",
                backgroundColor: "white",
                marginRight: "1rem",
              }}
              onClick={() => setIsWashSaleOpen(false)}
            />
          ) : (
            <ImageComponent
              src="expandDown.svg"
              alt="expandDown"
              style={{
                width: "2.3rem",
                height: "2.3rem",
                backgroundColor: "white",
                marginRight: "1rem",
              }}
              onClick={() => setIsWashSaleOpen(true)}
            />
          )}
        </div>
        <div
          className="chart-wrapper"
          style={{ display: isWashSaleOpen ? "none" : "" }}
        >
          <div className="price-section">
            <Heading text="Sell Price" variant="h4" />
            <ul
              className="price-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${priceLength * 0.25}rem`,
              }}
            >
              {sellingPrice &&
                sellingPrice.map((item, index) => {
                  return (
                    <li
                      style={{
                        padding: padding,
                      }}
                    >
                      <span className="cmp-name">{item.name}</span>
                      <span className="price">{item.price}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="chart">
            {series && (
              <ReactApexChart
                type="rangeBar"
                options={options}
                series={series}
                height={priceListHeight}
                width={800}
              />
            )}
          </div>
          <div className="price-section">
            <Heading text="Current Price" variant="h4" />
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${priceLength * 0.25}rem`,
              }}
            >
              {currnetPrice &&
                currnetPrice.map((item, index) => (
                  <li style={{ padding: padding }} key={index}>
                    <span className="cmp-name">{item.name}</span>
                    <span className="price">
                      {item.price > 0 ? (
                        <span style={{ color: "green" }}>
                          +{item.price.toFixed(3)}
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>
                          -{Math.abs(item.price).toFixed(3)}
                        </span>
                      )}
                      {item.price > 0 ? (
                        <i className="fas fa-plus"></i>
                      ) : (
                        <i className="fas fa-minus"></i>
                      )}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Visualisation;
