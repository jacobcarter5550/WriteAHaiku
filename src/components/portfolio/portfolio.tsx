import React, { useEffect, useRef, useState } from "react";
import isEqual from "lodash/isEqual";
import Status from "./misc/statusTP.tsx";
import api from "../../helpers/serviceTP.ts";
import SummaryChart from "./charts/SummaryChart.tsx";
import Overview from "./misc/Overview.tsx";
import Grid from "./grid/Grid.tsx";
import Header from "./misc/Header.tsx";
import { useAppSelector } from "../../store/index.ts";
import Heading from "../../ui-elements/headingTP.tsx";
import CustomSelect from "../../ui-elements/selectTP.tsx";
import BreadCrumb from "./misc/breadcrumbTP.tsx";
import Select, {
    components,
} from "react-select";
import { ProgressBar, Toggle } from "@carbon/react";
import { toast } from "react-toastify";
import {
  drillDownAndExtract,
  filterTree,
  proccessSet,
  processDataThree,
} from "./portfolioLib.tsx";
import { collectLeaves } from "../modals/portfolioConstruction/lib.ts";
import {
  getAccountId,
  getPersistedCurrentSelection,
} from "../../store/portfolio/selector.ts";
import CustomView from "../modals/customview/customView.tsx";
import SecurityComparison from "../modals/securityComparison/securityComparison.tsx";
import {
  IndividualCustomView,
  InitialState,
} from "../modals/customview/types.ts";
import LetterModal from "./letter/LetterModal.tsx";
import { getCurrentDateFormatted } from "../../helpers/lib.ts";
import {
  getAdditionalData,
  getCurrentOpen,
  getShowLetter,
} from "../../store/nonPerstistant/selectors.ts";
import {
  addSecurities,
  setAdditionalData,
  setShowLetter,
} from "../../store/nonPerstistant/index.ts";
import { useDispatch, shallowEqual } from "react-redux";
import { Security } from "../modals/SecurityPreview/securtityViewTP.tsx";
import { useOptContext } from "../../providers/contexts/optContext.ts";
import ImageComponent from "../../ui-elements/ImageComponent.tsx";
import SectionComponent from "../../ui-elements/SectionComponent.tsx";
import { setPersistedCurrentSelection } from "../../store/portfolio/index.ts";
import ChartType from "./charts/ChartType.tsx";
import { ChartTypeEnum } from "./charts/utils.ts";
import {
  AdditionalAttributeMap,
  ClassificationHoldingView,
} from "./portfolioTypes.ts";
import { Option } from "../../types/types.ts";
import { SelectOption } from "../nav/Nav.tsx";
import { StringComparison } from "igniteui-react-core";
import { setPersistedPDF } from "../../store/pdf/index.ts";
import { getPDFData } from "../../store/pdf/selectors.ts";
import Button from "../../ui-elements/buttonTP.tsx";

const initialState: InitialState = {};

const Portfolio: React.FC = () => {
  const dispatch = useDispatch();

  const currentOpen = useAppSelector(getCurrentOpen);

  const { opt, optVal, setOpt } = useOptContext();

  const [reffo, setReffo] = useState<any>(null);

  const overViewRef = useRef<HTMLDivElement>(null);
  const b1Ref = useRef<HTMLDivElement>(null);

  function dispatchCurrentSelection(val: Option) {
    dispatch(setPersistedCurrentSelection(val));
  }
  const persistedCurrentSelection = useAppSelector(
    getPersistedCurrentSelection
  );

  function dispatchAddSecurities(data: Security[]) {
    dispatch(addSecurities(data));
  }
  const accountId = useAppSelector(getAccountId);

  const idSecectOptions: number[] = [0, 1, 2, 3];
  const [assetVal, setAssetVal] = useState<Option | undefined>();
  const [textState, setTextState] = useState<string>("Optimizing...");
  const [value, setVal] = useState<number | null>(null);
  const [securities, setSecurities] = useState<Security[] | null>(null);
  const gridRef = useRef<any>(null);
  const [regionView, setRegionView] = useState<Option[]>([]);
  const [pointsView, setPointsView] = useState<string>("percentage");
  const [sectorClassVal, setSectorClassVal] = useState<Option | null>();
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

  const [comparedDataPortfolio, setComparedDataPortfolio] = useState<any>({});
  const [comparedDataSecurity, setComparedDataSecurity] = useState<any>({});
  const [comparisonType, setComparisonType] = useState<string>("");
  const additionalData = useAppSelector(getAdditionalData);

  function dispatchAdditionalData(data: string[]) {
    dispatch(setAdditionalData(data));
  }

  const [customView, setCustomView] = useState<boolean>(false);
  const [securityComparisonView, setSecurityComparisonView] =
    useState<boolean>(false);
  const [hierarchicalState, setHierarchicalState] =
    useState<InitialState>(initialState);
  const [hierarchicalStateSecurity, setHierarchicalStateSecurity] =
    useState<InitialState>(initialState);

  const url = (endpoint: string, account: SelectOption, option: Option) => {
    switch (endpoint) {
      case "assetclass":
        return `account/assetclass/holding/1/${account.value}`;
      case "sector":
        return `account/sector/holding/${account.value}/${option?.value}`;
      case "region":
        return `/account/region/holding/${account.value}/${option?.value}`;
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
    console.log(option);
    console.log("accountId---->", accountId);
    const promises = accountId.map((account) =>
      api.get(url(endpoint, account, option))
    );
    const results = await Promise.all(promises);
    console.log(results, "3");
    return results.map((item, index) => ({
      data: transformFunc(item.data[dataProperty]),
      id: accountId[index].value,
    }));
  };

  function checkForError(data: any[]): boolean {
    const ERROR_MESSAGE = "Custom filter yielded zero record!!!";
    return data.some((item: any) => item.message === ERROR_MESSAGE);
  }

  const onSelectedItem = async (option: Option) => {
    dispatchCurrentSelection(option);
    let data;
    console.log(option);
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
    console.log(data, "1");
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
        console.log("viewVal", viewVal);
        if (element === 0) setAssetVal(viewVal);
        else if (element === 1) setSectorClassVal(viewVal);
        else if (element === 2) setRegionViewVal(viewVal);
        else if (element === 3) setCountryViewVal(viewVal);
      }
    });
  };

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
            // Check for the specific error message in any of the responses
            const hasError = data.some(
              (item: any) =>
                item.message === "Custom filter yielded zero record!!!"
            );
            if (hasError) {
              // Handle the error case
              toast.info("Custom filter yielded zero record!!!");
              return false;
            }

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
          .catch((error) => {});
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
            // Check for the specific error message in any of the responses
            const hasError = data.some(
              (item: any) =>
                item.message === "Custom filter yielded zero record!!!"
            );
            if (hasError) {
              // Handle the error case
              toast.info("Custom filter yielded zero record!!!");
              return false;
            }
            const betterData = data.map((item, index) => ({
              data: filterTree(item.data.classificationHoldingViewList),
              id: accountId[index].value,
            }));

            console.log(data, "mapppppppppppppp");

            const clone = structuredClone(betterData);
            console.log(clone, "map");
            const map = drillDownAndExtract(clone[0].data);
            console.log(map, "map");

            if (map !== null) {
              //@ts-ignore
              dispatchAdditionalData(map!);
            } else {
              toast.info("Custom View Returned no data");
            }
            const proccessed = processDataThree(
              betterData,
              persistedCurrentSelection
            );
            console.log(proccessed, "map");
            console.log(securities, "map");
            if (securities == null) {
              const leaves = collectLeaves(proccessed);
              setSecurities(leaves);
              dispatchAddSecurities(leaves);
            }
            if (reffo.current) {
              if (reffo.current.api) {
                console.log("Setting row api:", reffo.current.api);
                console.log("Setting row data:", proccessed);
                reffo.current.api.setRowData(proccessed);
                reffo.current.api.hideOverlay();
                reffo.current.api.expandAll();
                reffo.current.refreshCells({ force: true });
              }
            }
          })
          .catch((error) => {});
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
            // Check for the specific error message in any of the responses
            const hasError = data.some(
              (item: any) =>
                item.message === "Custom filter yielded zero record!!!"
            );
            if (hasError) {
              // Handle the error case
              toast.info("Custom filter yielded zero record!!!");
              return false;
            }

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
          .catch((error) => {});
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
          .catch((error) => {});
    }
  }

  const onSelectCustomView = (option: Option, modal: boolean) => {
    console.log("onSelectCustomView", option, modal);
    if (option.value == "new") {
      setCustomView(true);
      setCustomViewValue({
        value: "new",
        label: "Add New",
      });
      setIndividualCustomViewData([]);
    } else {
        setCustomView(true);
      setCustomViewValue(option);
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
          .catch((error) => {});
      } else {
        (persistedCurrentSelection.id || persistedCurrentSelection.id == 0) &&
          setNewData(persistedCurrentSelection.id, Number(option.value));
      }
    }
  };    

  
  // Custom SingleValue component
  const CustomSingleValue = (props: any) => {
    return (
        <components.SingleValue {...props}>
            <span>{props.data.value === "initial" ? "Add New" : props.data.label}</span>
        </components.SingleValue>
    );
  };

  // Custom Option component
  const CustomOption = (props: any) => {
      const { data, innerRef, innerProps } = props;
      console.log("CustomOption", data);

      if (data.value === "new") {
          return (
              <components.Option {...props}>
                  <div
                      style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                      }}
                  >
                      <p>Add New</p>
                      <ImageComponent
                          src="addoption.svg"
                          alt="add-icon"
                          style={{ width: "1.3em" }}
                      />
                  </div>
              </components.Option>
          );
      }
      return (
          <components.Option {...props}>
              <div
                  style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                  }}
              >
                  <span>{props.data.label}</span>
                  <div style={{ display: "flex", gap: ".5rem" }}>
                      <ImageComponent
                          src="edit-icon.svg"
                          alt="settings--edit-icon"
                          style={{ width: "1.3em" }}
                          onClick={(e) => {
                              onSelectCustomView(persistedCurrentSelection, false)
                          }}  
                      />
                      <ImageComponent
                          src="trash-can.svg"
                          alt="trash-can-icon"
                          style={{ width: "1em" }}
                      />
                  </div>
              </div>
          </components.Option>
      );
  };


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
            "regionModelId",
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
      persistedCurrentSelection?.id !== null
    ) {
      setVal(persistedCurrentSelection?.id, persistedCurrentSelection);
    }
  }, []);

  const collapseAll = () => {
    reffo.current.api.collapseAll();
  };

  const expandAll = () => {
    reffo.current.api.expandAll();
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

  const [customViewData, setCustomViewData] = useState<any | null>(null);

  useEffect(() => {
    async function handleREquests() {
      api
        .get("/customview/characteristics")
        .then((res) => {
          setCustomViewData(res.data);
        })
        .catch((error) => {});
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
      } catch (error) {}
    }
    if (customViewData == null) {
      handleREquests();
    }
  }, []);

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
            <ImageComponent src="addoption.svg" alt="add-icon" />
            <span>Add New</span>
          </div>
        ),
      });
      setCustomViewOptions(optionList);
    } catch (error) {}
  };

  const showLetter = useAppSelector(getShowLetter);

  const closeSecurityComparisonView = async () => {
    setSecurityComparisonView(false);
  };

  const persistedPDFData = useAppSelector(getPDFData);

  const [pdfData, setPDFData] = useState<string | null>(persistedPDFData);
  const [binaryPDFData, setBinaryPDFData] = useState<string | null>(null);
  // Ref to track if it's the initial mount

  const states = {
    pdfData,
    binaryPDFData,
    setBinaryPDFData,
    setPDFData,
  };

  useEffect(() => {
    if (!isEqual(pdfData, persistedPDFData)) {
      dispatch(setPersistedPDF(pdfData));
      if (!showLetter) {
        toast.success(
          'Your PDF has finished generating! Click here button to view it."',
          {
            position: "bottom-right",
            onClick: () => {
              console.log("yyoy");
              dispatch(setShowLetter(true));
            },
          }
        );
      }
    }
  }, [persistedPDFData, pdfData, showLetter]);

  return (
    <>
      <section className={`portfolio-section ${currentOpen ? "show" : "hide"}`}>
        <Header />
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
                    console.log("selectedOptionRegion", selectedOption);
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
                    customComponents={{
                        IndicatorSeparator: () => null,
                        Option: CustomOption,
                        SingleValue: CustomSingleValue
                    }}
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
                    value={value!}
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
                  <ImageComponent
                    src="CollapseAll.svg"
                    alt="CollapseAll-icon"
                  />
                  <p> Collapse All</p>
                </button>
                <div
                  style={{
                    width: ".1rem",
                    height: "2.5rem",
                    backgroundColor: "rgba(141, 141, 141, 0.32)",
                  }}
                />
                <div className="override">
                  <p>Override:</p>
                  <ImageComponent src="config.svg" alt="config-icon" />
                  <ImageComponent src="save.svg" alt="save-icon" />
                </div>
              </aside>
            </SectionComponent>
            {gridRef && (
              <Grid
                ref={reffo}
                setSectorClassVal={setSectorClassVal}
                setSecurities={setSecurities}
                setReffo={setReffo}
                pointsView={pointsView}
                sectorClassVal={sectorClassVal}
                securities={securities}
              />
            )}
          </div>
          <div
            className="block-two flex-3"
            style={{ display: currentOpen ? "none" : "block" }}
          >
            <SummaryChart />
            {/* <ChartType
              chartType={ChartTypeEnum.SUMMARY}
              setSecurityComparisonView={setSecurityComparisonView}
              comparedDataPortfolio={null}
              setComparisonType={setComparisonType}
            /> */}
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
          </div>
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
            comparedDataPortfolio={comparedDataPortfolio}
            comparedDataSecurity={comparedDataSecurity}
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
        <LetterModal visible={showLetter} states={states} />
      </section>
    </>
  );
};

export default Portfolio;