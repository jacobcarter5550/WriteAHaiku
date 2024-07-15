import React, { useEffect, useState } from "react";
import GenericTable from "./GenericTable.tsx";
import AccordionWrapper from "./AccordionTable/AccordionWrapper.tsx";
import { SecurityTableData } from "./AccordionTable/accordionData.ts";
import { useTheme } from "next-themes";
import ImageComponent from "../../../../ui-elements/ImageComponent.tsx";
import api from "../../../../helpers/serviceTP.ts";
import { Security } from "../securtityViewTP.tsx";
import { formattedNumber } from "./lib.ts";

const Financials: React.FC<{ individualSecurity: Security | null }> = ({
  individualSecurity,
}) => {
  const [accordionData, setAccordionData] = useState<SecurityTableData>([]);
  const [annualKeys, setAnnualKeys] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState("Quarterly");
  const [balanceTableColumnHeader, setBalanceTableColumnHeader] = useState([]);
  const theme = useTheme();

  const getAllExpandableIds = (data: SecurityTableData) => {
    const ids: number[] = [];
    const findIds = (items: SecurityTableData) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          ids.push(item.id);
          findIds(item.children);
        }
      });
    };
    findIds(data);
    return ids;
  };

  const initialExpandedItems = getAllExpandableIds(accordionData);
  const [expandedItems, setExpandedItems] = useState(initialExpandedItems);

  const expandAll = () => {
    setExpandedItems(initialExpandedItems);
  };

  const collapseAll = () => {
    setExpandedItems([]);
  };

  const categoryMappings: { [category: string]: string[] } = {
    "Sales Revenue": ["comprehensiveIncome", "earningBeforeTax"],
    "Gross Income": ["operatingExpenses", "otherIncomeAndExpenses"],
    "Pretax Income": [],
  };

  const generateTitleFromKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  function transformData(
    data: FinancialData[],
    categories: string[]
  ): Category[] {
    let result: Category[] = [];

    const categoryData: Category = {
      children: [],
    };
    if (categories) {
      categories.forEach((key, childIdx) => {
        const child: CategoryChild = {
          id: 10 * (childIdx + 1) + childIdx + 1,
          title: generateTitleFromKey(key),
          rowData: [],
          children: [],
        };

        // Initialize an object to track subChild by title
        const subChildrenByTitle: { [title: string]: CategoryChild } = {};

        // Accumulate data for each period
        data.forEach((entry) => {
          if (entry[key]) {
            Object.keys(entry[key]).forEach((subkey) => {
              let subChild: CategoryChild;
              if (!subChildrenByTitle[subkey]) {
                subChild = {
                  id:
                    100 * (10 * (childIdx + 1) + childIdx + 1) +
                    Object.keys(subChildrenByTitle).length +
                    1,
                  title: generateTitleFromKey(subkey),
                  rowData: [],
                };
                subChildrenByTitle[subkey] = subChild;
                child.children.push(subChild); // Only push new subChild
              } else {
                subChild = subChildrenByTitle[subkey];
              }

              // Format and push row data for each sub-category

              if (selectedTab === "Quarterly") {
                const quarter =
                  "q" + entry.period.substring(1, 2).toLowerCase(); // Normalize the quarter key, remove the year
                subChild.rowData.push({
                  id: `A${subChild.rowData.length + 1}`, // Ensure unique IDs
                  columnName: entry.period,
                  [quarter]: formattedNumber(entry[key][subkey]), // Add data with modified key
                });
              } else {
                const year = "y" + entry.period.substring(6, 7).toLowerCase(); // Normalize the quarter key, remove the year

                subChild.rowData.push({
                  id: `A${subChild.rowData.length + 1}`, // Ensure unique IDs
                  columnName: entry.period,
                  [year]: formattedNumber(entry[key][subkey]), // Add data with modified key
                });
              }
            });
          }
        });

        // Calculate and add the annualized value
        if (selectedTab === "Quarterly") {
          child.children.forEach((subChild) => {
            const annualTotal = subChild.rowData.reduce((sum, current) => {
              const quarterValue = Object.values(current).find(
                (v) => typeof v === "number"
              );
              return sum + (quarterValue || 0);
            }, 0);

            // subChild.rowData.push({
            //   id: `A${subChild.rowData.length + 1}`,
            //   columnName: "Annualized",
            //   annualized: annualTotal.toLocaleString(), // Format the number as a string with commas
            // });
          });
        }
        categoryData.children.push(child);
      });
    }
    result.push(categoryData);

    // });

    return result;
  }
  const getFinancialData = async () => {
    try {
      const response = await api.get(
        `${process.env.REACT_APP_HOST_IP_ADDRESS}/api/security/incomestatement/${
          selectedTab === "Quarterly" ? "QUARTERLY" : "ANNUALLY"
        }/${individualSecurity?.securityId}`
      );
      const result = await response.data;
      if (response?.data?.incomeStatements?.length > 0) {
        const categories: string[] = Object.keys(
          response?.data?.incomeStatements[0]
        )
          .filter((item) => item !== "period" && item !== "acceptedDate")
          .reverse();

        const transformedData = transformData(
          response?.data?.incomeStatements,
          categories
        ).reverse();

        if (selectedTab !== "Quarterly") {
          response?.data?.incomeStatements?.forEach((entry) => {
            setAnnualKeys((prevResults) => [
              ...prevResults,
              `y${entry.period.substring(6, 7).toLowerCase()}`,
            ]);
          });
        } else {
          setAnnualKeys([]);
        }

        setAccordionData(transformedData[0]?.children);

        const headers = result?.incomeStatements?.map((item) => ({
          name: item.period,
          date: item.acceptedDate,
        }));

        setBalanceTableColumnHeader(headers);
      }
    } catch (err) {
      console.log("Error", err.message);
    }
  };

  useEffect(() => {
    getFinancialData();
  }, [selectedTab, individualSecurity]);

  useEffect(() => {
    setExpandedItems(getAllExpandableIds(accordionData));
  }, [accordionData]);

    return (
        <section className="balance-table-container">
            <div className="balance-table-header">
                <div className="balance-table-tabs">
                    <div className="balance-table-tabs-container">
                        <span
                            onClick={() => setSelectedTab("Quarterly")}
                            className={
                                selectedTab === "Quarterly" ? "balance-table-active-tab" : ""
                            }
                        >
                            Quarterly
                        </span>
                        <div className="balance-table-tabs-divider"></div>
                        <span
                            onClick={() => setSelectedTab("History")}
                            className={selectedTab === "History" ? "balance-table-active-tab" : ""}
                        >
                            History
                        </span>
                    </div>
                </div>
                <div className="balance-table-column-header">
                    {balanceTableColumnHeader.map((column, index) => (
                        <div key={index} className="balance-table-column-item">
                            <span style={{ fontWeight: 700 }}>{column?.name}</span>
                            {/* <span>{column?.date}</span> */}
                        </div>
                    )).reverse()}
                </div>
                <div className="balance-table-icons">
                    <button onClick={expandAll}>
                        <ImageComponent src="expandAll.svg" alt="expandAll-icon" />
                        <p>Expand All</p>
                    </button>
                    <button onClick={collapseAll}>
                        <ImageComponent src="CollapseAll.svg" alt="Collapse-icon" />
                        <p> Collapse All</p>
                    </button>
                </div>
            </div>
            <div className="balance-table-wrapper">
                <AccordionWrapper
                    key="financial"
                    expandedItems={expandedItems}
                    setExpandedItems={setExpandedItems}
                    accordionData={accordionData}
                    keys={selectedTab === "Quarterly" ? ["q1", "q2", "q3", "q4"] : annualKeys}
                />
            </div>
        </section>
    );
};

export default Financials;
