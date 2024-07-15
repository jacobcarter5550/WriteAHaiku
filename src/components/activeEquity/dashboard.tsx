import React, { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { ProgressBar, Toggle } from "@carbon/react";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";

import Overview from "../portfolio/misc/Overview.tsx";
import BreadCrumb from "../portfolio/misc/breadcrumbTP.tsx";
import Status from "../portfolio/misc/statusTP.tsx";
import LetterModal from "../portfolio/letter/LetterModal.tsx";
import ChartType from "../portfolio/charts/ChartType.tsx";
import { ChartTypeEnum } from "../portfolio/charts/utils.ts";
import {
  filterTree,
  proccessSet,
  processData,
  Option,
  processDataThree,
} from "../portfolio/portfolioLib.tsx";
import api from "../../helpers/serviceTP.ts";
import { getCurrentDateFormatted } from "../../helpers/lib.ts";
import { checkValidationResults, formatApiChartResponse } from "./lib.ts";
import { collectLeaves } from "../modals/portfolioConstruction/lib.ts";
import { Security } from "../modals/SecurityPreview/securtityViewTP.tsx";
import SecurityComparison from "../modals/securityComparison/securityComparison.tsx";
import CustomView from "../modals/customview/customView.tsx";
import {
  IndividualCustomView,
  InitialState,
} from "../modals/customview/types.ts";
import {
  getAccountId,
  getAccountIdForSummary,
  getPersistedCurrentSelection,
} from "../../store/portfolio/selector.ts";
import {
  getAdditionalData,
  getCurrentOpen,
  getCurrentSelection,
  getHighlightedNodes,
  getShowLetter,
} from "../../store/nonPerstistant/selectors.ts";
import {
  addSecurities,
  setAdditionalData,
  setCurrentSelection,
  setHighlightedNodes,
  setShowOverrideConfiguration,
} from "../../store/nonPerstistant/index.ts";
import { setPersistedCurrentSelection } from "../../store/portfolio/index.ts";
import { getNewOverrideData } from "../../store/activeEquity/selector.ts";
import {
  OverrideData,
  clearNewOverrideData,
} from "../../store/activeEquity/index.ts";
import { useAppSelector } from "../../store/index.ts";
import { useOptContext } from "../../providers/contexts/optContext.ts";
import ImageComponent from "../../ui-elements/ImageComponent.tsx";
import SectionComponent from "../../ui-elements/SectionComponent.tsx";
import Heading from "../../ui-elements/headingTP.tsx";
import CustomSelect from "../../ui-elements/selectTP.tsx";
import { SelectOption } from "../nav/Nav.tsx";
import AEHeader from "./AEHeader.tsx";
import SummaryChart from "./charts/SummaryChart.tsx";
import AEGrid, { NodeStateData } from "./AEGrid.tsx";

const initialState: InitialState = {};
interface AdditionalAttributeMap {
  [key: string]: any;
}
interface AccountHoldingView {
  additionalAttributeMap?: AdditionalAttributeMap;
}
interface ClassificationHoldingView {
  classificationHoldingViews?: ClassificationHoldingView[];
  accountHoldingViews?: AccountHoldingView[];
}

type SavePayload = {
  securityId: string;
  overrideWeight: number;
}[];

const AEDashboard: React.FC<{}> = ({}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [fontSize, setFontSize] = useState<number | null>(null);
  const [bgroundState, setBgroundState] = useState(false);
  const [reffo, setReffo] = useState<any>(null);
  const [assetVal, setAssetVal] = useState<Option | undefined>();
  const [textState, setTextState] = useState<string>("Optimizing...");
  const [value, setVal] = useState<number | null>(null);
  const [securities, setSecurities] = useState<Security[] | null>(null);
  const gridRef = useRef<any>(null);
  const [regionView, setRegionView] = useState<Option[]>([]);
  let [pointsView, setPointsView] = useState<string>("percentage");
  const [sectorClassVal, setSectorClassVal] = useState<Option | undefined>();
  const [regionViewVal, setRegionViewVal] = useState<Option | undefined>();
  const [countryViewVal, setCountryViewVal] = useState<Option | undefined>();
  const [assetClassView, setAssetClassView] = useState<Option[]>([]);
  const [sectorClassView, setSectorClassView] = useState<Option[]>([]);
  const [countryView, setCountryView] = useState<Option[]>([]);
  const [customViewOptions, setCustomViewOptions] = useState<Option[]>([]);
  const [customViewValue, setCustomViewValue] = useState<Option | undefined>();
  const [individualCustomViewData, setIndividualCustomViewData] = useState<
    IndividualCustomView[]
  >([]);
  const [customView, setCustomView] = useState<boolean>(false);
  const [comparedDataPortfolio, setComparedDataPortfolio] = useState<any>({});
  const [comparedDataSecurity, setComparedDataSecurity] = useState<any>({});
  const [comparisonType, setComparisonType] = useState<string>("");
  const additionalData = useAppSelector(getAdditionalData);

  const [hierarchicalState, setHierarchicalState] =
    useState<InitialState>(initialState);
  const [hierarchicalStateSecurity, setHierarchicalStateSecurity] =
    useState<InitialState>(initialState);
  const [securityComparisonView, setSecurityComparisonView] =
    useState<boolean>(false);
  const [customViewData, setCustomViewData] = useState<any | null>(null);
  const [tableData, setTableData] = useState<any | null>(null);

  const overViewRef = useRef<HTMLDivElement>(null);
  const b1Ref = useRef<HTMLDivElement>(null);

  const { opt, optVal, setOpt } = useOptContext();

  const persistedCurrentSelection = useAppSelector(
    getPersistedCurrentSelection
  );
  const currentSelection = useAppSelector(getPersistedCurrentSelection);
  const currentOpen = useAppSelector(getCurrentOpen);
  const showLetter = useAppSelector(getShowLetter);
  const overrideData = useAppSelector(getNewOverrideData);
  const highlightedNodes = useAppSelector(getHighlightedNodes);
  const account = useAppSelector(getAccountIdForSummary);

  const idSecectOptions: number[] = [0, 1, 2, 3];

  function dispatchCurrentSelection(val: Option) {
    // dispatch(setCurrentSelection(val));
    dispatch(setPersistedCurrentSelection(val));
  }

  function dispatchAddSecurities(data: Security[]) {
    dispatch(addSecurities(data));
  }
  const accountId = useAppSelector(getAccountId);

  function dispatchAdditionalData(data: string[]) {
    dispatch(setAdditionalData(data));
  }

  function dispatchHighlightedNodes(data: NodeStateData[]) {
    dispatch(setHighlightedNodes(data));
  }

  const url = (endpoint: string, account: SelectOption, option: Option) => {
  
    switch (endpoint) {
      case "assetclass":
        return `account/assetclass/holding/1/${account.value}`;
      case "sector":
        return `account/sector/holding/${account.value}/${option?.value}`;
      case "region":
        return `/account/region/holding/${account.value}`;
      case "country":
        return `/account/country/holding/${account.value}`;
      default:
        return `account/sector/holding/${account.value}/${option?.value}`;
    }
  };

  const fetchDataForOption = async (
    option: Option,
    endpoint: string,
    dataProperty: string,
    transformFunc: any
  ) => {
    const promises = accountId.map((account) =>
      api.get(url(endpoint, account, option))
    );
    const results = await Promise.all(promises);
    return results.map((item, index) => ({
      data: transformFunc(item.data[dataProperty]),
      id: accountId[index].value,
    }));
  };

  const onSelectedItem = async (option: Option) => {
    console.log("onSelectedItem",option)
    dispatchCurrentSelection(option);
    let data;
    switch (option.id) {
      case 0:
        setAssetVal(option);
        data = await fetchDataForOption(
          option,
          "assetclass",
          "assetClassHoldingViewList",
          (item) => item
        );
        break;
      case 1:
        setSectorClassVal(option);
        data = await fetchDataForOption(
          option,
          "sector",
          "classificationHoldingViewList",
          filterTree
        );
        break;
      case 2:
        setRegionViewVal(option);
        data = await fetchDataForOption(
          option,
          "region",
          "regionHoldingViewList",
          (item) => item
        );
        break;
      case 3:
        setCountryViewVal(option);
        data = await fetchDataForOption(
          option,
          "country",
          "countryHoldingViewList",
          (item) => item
        );
        break;
      default:
        return;
    }
    proccessSet(reffo, option, data);

    // Simplified default settings
    const viewLabels = [
      "Asset Class View",
      "Sector View",
      "Region View",
      "Country View",
    ];
    idSecectOptions.forEach((element) => {
      if (element !== option.id) {
        const viewVal = {
          label: viewLabels[element],
          value: viewLabels[element],
        };
        if (element === 0) setAssetVal(viewVal);
        else if (element === 1) setSectorClassVal(viewVal);
        else if (element === 2) setRegionViewVal(viewVal);
        else if (element === 3) setCountryViewVal(viewVal);
      }
    });
  };

  function dispatchShowOverrideConfig(val: boolean) {
    dispatch(setShowOverrideConfiguration(val));
  }

  function drillDownAndExtract(
    obj: ClassificationHoldingView[]
  ): AdditionalAttributeMap[] | null {
    function recursiveDrill(
      currentObject: ClassificationHoldingView
    ): AdditionalAttributeMap[] | undefined {
      // Check if we have the 'classificationHoldingViews' to drill down further
      if (currentObject.classificationHoldingViews) {
        for (const child of currentObject.classificationHoldingViews) {
          const result = recursiveDrill(child);
          if (result) {
            return result; // Propagate the found result up the recursion chain
          }
        }
      } else if (
        currentObject.accountHoldingViews &&
        currentObject.accountHoldingViews.length > 0
      ) {
        // Found the accountHoldingViews, extract additionalAttributeMap
        const firstAccountHoldingView = currentObject.accountHoldingViews[0];
        if (firstAccountHoldingView.additionalAttributeMap) {
          // Convert the map to an array of [key, value] pairs
          //@ts-ignore
          return Object.keys(firstAccountHoldingView.additionalAttributeMap);
        }
      }
      // Nothing found, return undefined
      //@ts-ignore
      return null;
    }

    // Iterate over the root array and start the recursive drilling
    for (const rootObject of obj) {
      const result = recursiveDrill(rootObject);
      if (result) {
        return result; // Return the first found result
      }
    }
    // If nothing is found in any of the objects
    return null;
  }

  function setNewData(type: number, id: number) {
    switch (type) {
      case 0:
        let classificationPromises: any[] = [];

        accountId.forEach((account) => {
          const prom = api.get(
            `account/assetclass/holding/${1}/${account.value}?prefId=${id}`
          );
          classificationPromises.push(prom);
        });

        Promise.all(classificationPromises)
          .then((data: any) => {
            const betterData = data.map((item, index) => ({
              data: item.data.assetClassHoldingViewList,
              id: accountId[index].value,
            }));

            const clone = structuredClone(betterData);
            const map = drillDownAndExtract(clone[0].data);

            if (map !== null) {
              //@ts-ignore
              dispatchAdditionalData(map!);
            } else {
              toast.info("Custom View Returned no data");
            }
            proccessSet(reffo, assetVal!, betterData);
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 1:
        let promises: any[] = [];

        accountId.forEach((account) => {
          const prom = api.get(
            `account/sector/holding/${account.value}/${sectorClassVal?.value}?prefId=${id}`
          );
          promises.push(prom);
        });

        Promise.all(promises)
          .then((data: any) => {
            const betterData = data.map((item, index) => ({
              data: filterTree(item.data.classificationHoldingViewList),
              id: accountId[index].value,
            }));
            const clone = structuredClone(betterData);
            const map = drillDownAndExtract(clone[0].data);
            if (map !== null) {
              //@ts-ignore
              dispatchAdditionalData(map!);
            } else {
              toast.info("Custom View Returned no data");
            }
            const proccessed = processDataThree(betterData, currentSelection);
            if (securities == null) {
              setSecurities(collectLeaves(proccessed));
              dispatchAddSecurities(collectLeaves(proccessed));
            }
            reffo.current.api.setRowData(proccessed);
            reffo.current.api.hideOverlay();
            reffo.current.api.expandAll();
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 2:
        let regionPromises: any[] = [];

        accountId.forEach((account) => {
          const prom = api.get(
            `/account/region/holding/${account.value}?prefId=${id}`
          );
          regionPromises.push(prom);
        });

        Promise.all(regionPromises)
          .then((data: any) => {
            const betterData = data.map((item, index) => ({
              data: item.data.regionHoldingViewList,
              id: accountId[index].value,
            }));

            const clone = structuredClone(betterData);
            const map = drillDownAndExtract(clone[0].data);

            if (map !== null) {
              //@ts-ignore
              dispatchAdditionalData(map!);
            } else {
              toast.info("Custom View Returned no data");
            }
            proccessSet(reffo, assetVal!, betterData);
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 3:
        let countryPromises: any[] = [];

        accountId.forEach((account) => {
          const prom = api.get(
            `/account/country/holding/${account.value}?prefId=${id}`
          );
          countryPromises.push(prom);
        });

        Promise.all(countryPromises)
          .then((data: any) => {
            const betterData = data.map((item, index) => ({
              data: item.data.countryHoldingViewList,
              id: accountId[index].value,
            }));

            const clone = structuredClone(betterData);
            const map = drillDownAndExtract(clone[0].data);

            if (map !== null) {
              //@ts-ignore
              dispatchAdditionalData(map!);
            } else {
              toast.info("Custom View Returned no data");
            }
            proccessSet(reffo, assetVal!, betterData);
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }

  const onSelectCustomView = (option: Option, modal: boolean) => {
    if (option.value == "new") {
      setCustomView(true);
      setCustomViewValue(option);
      setIndividualCustomViewData([]);
    } else {
      if (modal) {
        api
          .get(`/customview/preference/${option.value}`)
          .then((res) => {
            setIndividualCustomViewData(
              res?.data?.customViewByPreferenceIdViews
            );
            setCustomViewValue(option);
            setCustomView(true);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        currentSelection.id &&
          setNewData(currentSelection.id, Number(option.value));
      }
    }
  };

  const collapseAll = () => {
    reffo.current.api.collapseAll();
  };

  const expandAll = () => {
    reffo.current.api.expandAll();
  };

  function transformData(array) {
    const result = { holdings: {} };

    array.forEach((item) => {
      const { overrideID, newWeight, previousWeight } = item;
      // Assuming the calculation for overriddenWeight isn't provided and will just copy newWeight for demonstration.
      // If there is a specific formula to calculate overriddenWeight from newWeight and previousWeight, you should apply it here.
      result.holdings[overrideID] = {
        overriddenWeight: newWeight, // Placeholder, adjust as needed
        originalWeight: previousWeight,
      };
    });

    return result;
  }

  const closeCustomVuew = async () => {
    setCustomView(false);
    try {
      const res = await api.get("/customview/user");
      const optionList = res.data.customViewPreferencesViewList.map((item) => ({
        value: item.preferenceId,
        label: item.preferenceName,
      }));
      setCustomViewValue(
        optionList?.filter(
          (option: Option) => option?.value == customViewValue?.value
        )
      );
      optionList.unshift({
        value: "new",
        label: (
          <div className="custom-option">
              <span>Add New</span>
            <ImageComponent src="addoption.svg" alt="add-icon" />
          </div>
        ),
      });
      setCustomViewOptions(optionList);
    } catch (error) {
      console.log(error);
    }
  };

  function convertToPayload(data: OverrideData[]): SavePayload {
    return data.map((item) => {
      return {
        securityId: item.overrideID,
        overrideWeight: item.newWeight,
      };
    });
  }

  const closeSecurityComparisonView = async () => {
    setSecurityComparisonView(false);
  };

  useEffect(() => {
    let optimizationTimer;
    let resetOptTimer;

    if (opt) {
      // Start the 14 seconds timer after opt becomes true
      optimizationTimer = setTimeout(() => {
        setVal(100);
        setTextState("Success"); // Update the text state to "Success" after 14 seconds

        // Start another timer to set opt back to false after 1 second
        resetOptTimer = setTimeout(() => {
          setOpt(false); // Set opt back to false
          setVal(null);
          setTextState("Optimizing...");
        }, 2000); // 1 second
      }, 10000); // 14 seconds
    }

    return () => {
      clearTimeout(optimizationTimer);
      clearTimeout(resetOptTimer);
    };
  }, [opt]);

  useEffect(() => {
    async function handleREquests() {
      api
        .get("/customview/characteristics")
        .then((res) => {
          setCustomViewData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      try {
        const res = await api.get("/customview/user");
        const optionList = res.data.customViewPreferencesViewList.map(
          (item) => ({
            value: item.preferenceId,
            label: item.preferenceName,
          })
        );
        optionList.unshift({
          value: "new",
          label: (
            <div className="custom-option">
                         <span>Add New</span>
              <ImageComponent src="addoption.svg" alt="add-icon" />
            </div>
          ),
        });
        setCustomViewOptions(optionList);
      } catch (error) {
        console.log(error);
      }
    }
    if (customViewData == null) {
      handleREquests();
    }
  }, []);

  useEffect(() => {
    // Fetch dropdown views
    const fetchData = async () => {
      const getCurrentDateUrl = () => `/all/${getCurrentDateFormatted()}`;

      // Helper function to transform response data
      const transformData = (data, key, label, ind) =>
        data.map((item) => ({
          value: item[key],
          label: item[label],
          id: ind,
        }));

      try {
        // Parallel API requests
        const [
          countryResponse,
          regionResponse,
          assetClassResponse,
          sectorClassResponse,
        ] = await Promise.all([
          api.get(`/country${getCurrentDateUrl()}`),
          api.get(`/region${getCurrentDateUrl()}`),
          api.get(`/assetclass${getCurrentDateUrl()}`),
          api.get(`/sectormodels${getCurrentDateUrl()}`),
        ]);

        // Setting states
        setCountryView(
          transformData(
            countryResponse.data,
            "countryModelId",
            "countryModelName",
            3
          )
        );
        setRegionView(
          transformData(
            regionResponse.data,
            "parentRegionModelId",
            "regionModelName",
            2
          )
        );

        // Special handling for the first asset class item
        const filteredAssetData = assetClassResponse.data.filter(
          (_, index) => index === 0
        );
        setAssetClassView(
          transformData(
            filteredAssetData,
            "assetClassModelId",
            "assetClassModelName",
            0
          )
        );

        setSectorClassView(
          transformData(
            sectorClassResponse.data.sectorModelList,
            "sectorModelId",
            "sectorModelName",
            1
          )
        );
      } catch (error) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (overrideData !== null) {
      setBgroundState(true);
    } else {
      setBgroundState(false);
    }
  }, [overrideData]);

  useEffect(() => {
    function setVal(id: number, selection: Option) {
      switch (id) {
        case 0:
          setAssetVal(selection);
          break;
        case 1:
          setSectorClassVal(selection);
          break;
        case 2:
          setRegionViewVal(selection);
          break;
        case 3:
          setCountryViewVal(selection);
          break;
      }
    }

    if (
      persistedCurrentSelection !== null &&
      persistedCurrentSelection.id !== null
    ) {
      setVal(persistedCurrentSelection.id, persistedCurrentSelection);
    }
  }, []);

  useEffect(() => {
    var fontSize = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("font-size");
    setFontSize(Number(fontSize.split("px")[0]));
  }, []);

  return (
    <>
      <section className={`portfolio-section ${currentOpen ? "show" : "hide"}`}>
        <AEHeader />
        <div className="flex-box-wrapper">
          <div ref={b1Ref} className="block-one flex-7">
            <Overview overviewRef={overViewRef} />
            <div
              className="flexwrapper"
              style={{ justifyContent: "space-between", height: "5vh" }}
            >
              <Heading
                variant={"h4"}
                text={"Portfolio Details:"}
                style={{ whiteSpace: "nowrap", fontWeight: 600 }}
              />
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "85%",
                }}
              >
                <CustomSelect
                  disabled={assetClassView.length == 0}
                  value={assetVal}
                  defaultValue={{ label: "Asset Class View" }}
                  options={assetClassView}
                  onChange={(selectedOption: Option) => {
                    onSelectedItem({ ...selectedOption, id: 0 });
                  }}
                />
                <CustomSelect
                  disabled={sectorClassView.length == 0}
                  value={sectorClassVal}
                  defaultValue={{ label: "Sector View" }}
                  options={sectorClassView}
                  onChange={(selectedOption: Option) => {
                    onSelectedItem({ ...selectedOption, id: 1 });
                  }}
                />
                <CustomSelect
                  disabled={regionView.length == 0}
                  value={regionViewVal}
                  defaultValue={{ label: "Region View" }}
                  options={regionView}
                  onChange={(selectedOption: Option) => {
                    console.log("RegionView",selectedOption)
                    onSelectedItem({ ...selectedOption, id: 2 });
                  }}
                />
                <CustomSelect
                  disabled={countryView.length == 0}
                  value={countryViewVal}
                  defaultValue={{ label: "Country View" }}
                  options={countryView}
                  onChange={(selectedOption: Option) => {
                    onSelectedItem({ ...selectedOption, id: 3 });
                  }}
                />
                <CustomSelect
                  disabled={accountId.length == 0}
                  value={customViewValue}
                  defaultValue={{ label: "Custom View" }}
                  options={customViewOptions}
                  onChange={(selectedOption: Option) => {
                    onSelectCustomView(selectedOption, false);
                  }}
                  placeholder="Select custom view"
                />
              </span>
            </div>
            <SectionComponent
              style={{ height: "4.5vh" }}
              className="breadcrumb-filters"
            >
              <div
                className="bread-crumb toggleHelper"
                style={{ display: "flex", alignItems: "center" }}
              >
                <BreadCrumb />
                <aside
                  style={{
                    width: "1px",
                    margin: "0px 0.5em",
                    height: "1em",
                    border: "1px solid grey",
                  }}
                />
                <Toggle
                  className="toggleBCHelper"
                  id="toggle-1"
                  size="md"
                  defaultToggled={true}
                  style={{ width: "400px" }}
                  labelA="BPS"
                  labelB="Percentage"
                  onToggle={() => {
                    pointsView === "points"
                      ? setPointsView("percentage")
                      : setPointsView("points");
                  }}
                />
              </div>
              <aside
                className="filters"
                style={{ display: "flex", alignItems: "center" }}
              >
                {opt && (
                  <ProgressBar
                    value={optVal!}
                    className="progressBarHelper"
                    label={
                      (
                        <p
                          style={{
                            width: "100px",
                            fontSize: "1em",
                            textAlign: "center",
                          }}
                        >
                          {textState}
                        </p>
                      ) as any
                    }
                  />
                )}
                <button onClick={() => expandAll()}>
                  <ImageComponent src="expandAll.svg" alt="expandAll-icon" />
                  <p>Expand All</p>
                </button>
                <button onClick={() => collapseAll()}>
                  <ImageComponent src="collapse2.svg" alt="Collapse-icon" />
                  <p> Collapse All</p>
                </button>
                <div className="override">
                  <p>Override:</p>
                  <ImageComponent
                    src="config.svg"
                    alt="config-icon"
                    style={{
                      backgroundColor: bgroundState ? "aliceblue" : "",
                      cursor: "pointer",
                    }}
                    onClick={async () => {
                      if (overrideData && accountId) {
                        const toData = {
                          accountId: accountId[0].value,
                          ...transformData(structuredClone(overrideData)),
                        };
                        await api
                          .put("/fundamental/validatealloc", toData)
                          .then(async (res) => {
                            if (checkValidationResults(res).passed) {
                              dispatchHighlightedNodes(
                                structuredClone(highlightedNodes)!.map(
                                  (item) => {
                                    return {
                                      ...item,
                                      color: "#05B656",
                                    };
                                  }
                                )
                              );
                              await api
                                .put("/fundamental/calcpostoptmetrics", toData)
                                .then((ret) => {
                                  setTableData(
                                    formatApiChartResponse(ret.data)
                                  );
                                  dispatch(clearNewOverrideData());
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            } else {
                              checkValidationResults(res).data.forEach(
                                (item) => {
                                  dispatchHighlightedNodes(
                                    structuredClone(highlightedNodes)!.map(
                                      (node) => {
                                        if (
                                          node.data.data.securityId ===
                                          item.securityId
                                        ) {
                                          return {
                                            ...node,
                                            color: "#FF0000",
                                          };
                                        }
                                        return node;
                                      }
                                    )
                                  );
                                }
                              );
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      }
                    }}
                  />
                  <img
                    style={{ backgroundColor: bgroundState ? "aliceblue" : "" }}
                    onClick={async () => {
                      if (overrideData && accountId) {
                        const toData = {
                          accountId: accountId[0].value,
                          ...transformData(structuredClone(overrideData)),
                        };

                        await api
                          .put("/fundamental/calcpostoptmetrics", toData)
                          .then((ret) => {
                            setTableData(formatApiChartResponse(ret.data));
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      }
                    }}
                    src="/calculation--alt.svg"
                    alt=""
                  />
                  <ImageComponent
                    src="save.svg"
                    alt="save-icon"
                    onClick={async () => {
                      if (overrideData && accountId) {
                        await api
                          .put(
                            `/override/security/${accountId[0].value}`,
                            convertToPayload(overrideData)
                          )
                          .then((res) => {
                            toast.success("Saved Successfully");
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      }
                    }}
                  />
                </div>
              </aside>
            </SectionComponent>
            {gridRef && (
              <AEGrid
                ref={gridRef}
                setSectorClassVal={setSectorClassVal}
                setSecurities={setSecurities}
                setReffo={setReffo}
                pointsView={pointsView}
                sectorClassVal={sectorClassVal}
                securities={securities}
              />
            )}
          </div>
          <SectionComponent className="block-two flex-3">
            <SummaryChart inheritedTableData={tableData} />
            <ChartType
              chartType={ChartTypeEnum.RETURN}
              setSecurityComparisonView={setSecurityComparisonView}
              comparedDataPortfolio={null}
              setComparisonType={setComparisonType}
            />
            <ChartType
              chartType={ChartTypeEnum.PORTFOLIOCHAR}
              setSecurityComparisonView={setSecurityComparisonView}
              comparedDataPortfolio={comparedDataPortfolio}
              setComparisonType={setComparisonType}
            />
            <ChartType
              chartType={ChartTypeEnum.SECURITYCHAR}
              setSecurityComparisonView={setSecurityComparisonView}
              comparedDataPortfolio={comparedDataSecurity}
              setComparisonType={setComparisonType}
            />
          </SectionComponent>
        </div>

        <Status />
        {customView && (
          <CustomView
            customViewData={customViewData}
            open={customView}
            onClose={closeCustomVuew}
            individualCustomViewData={individualCustomViewData}
            customViewValue={customViewValue}
            customViewOptions={customViewOptions}
            onSelectCustomView={onSelectCustomView}
          />
        )}
        {securityComparisonView && (
          <SecurityComparison
            customViewData={customViewData}
            open={securityComparisonView}
            onClose={closeSecurityComparisonView}
            setComparedDataPortfolio={setComparedDataPortfolio}
            setComparedDataSecurity={setComparedDataSecurity}
            comparisonType={comparisonType}
            hierarchicalState={hierarchicalState}
            setHierarchicalState={setHierarchicalState}
            hierarchicalStateSecurity={hierarchicalStateSecurity}
            setHierarchicalStateSecurity={setHierarchicalStateSecurity}
          />
        )}
        {showLetter && <LetterModal />}
      </section>
    </>
  );
};

export default AEDashboard;
