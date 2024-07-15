/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import Heading from "../../ui-elements/headingTP.tsx";
import CustomSelect from "../../ui-elements/selectTP.tsx";
import Button from "../../ui-elements/buttonTP.tsx";
import { Toggle, ProgressBar } from "@carbon/react";
import { useDispatch } from "react-redux";
import api from "../../helpers/serviceTP.ts";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import SecurityView, {
  Security,
} from "../modals/SecurityPreview/securtityViewTP.tsx";
import _ from "lodash";
import { useTheme } from "next-themes";
import {
  preOptRenderer,
  priceRenderer,
  postOptRenderer,
  tradingWeightRenderer,
  ordinaryCellRenderer,
  TooltipRenderer,
} from "../portfolio/grid/cellRendererTP.tsx";
import {
  filterTree,
  proccessSet,
  toCamelCase,
  Option,
  ClassificationHoldingView,
  processDataThree,
} from "../portfolio/portfolioLib.tsx";
import { signal } from "@preact/signals-react";
import {
  updatePortfolioNode,
  addSecurityId,
} from "../../store/portfolio/index.ts";
import { useAppSelector } from "../../store/index.ts";
import {
  getAccountId,
  getPersistedCurrentSelection,
} from "../../store/portfolio/selector.ts";
import { collectLeaves } from "../modals/portfolioConstruction/lib.ts";
import { getCurrentDateFormatted } from "../../helpers/lib.ts";
import AECustomHeader from "./AECustomHeader.tsx";
import {
  OverrideData,
  updateNewOverrideData,
} from "../../store/activeEquity/index.ts";
import { processData } from "./lib.ts";
import {
  getAdditionalData,
  getCurrentSelection,
  getHighlightedNodes,
  getSecurityModal,
} from "../../store/nonPerstistant/selectors.ts";
import {
  addSecurities,
  setHighlightedNodes,
  setSecurityModal,
  setShowOptimizationDefinition,
} from "../../store/nonPerstistant/index.ts";
import { IRowNode } from "ag-grid-community";
import ImageComponent from "../../ui-elements/ImageComponent.tsx";
import { SelectOption } from "../nav/Nav.tsx";
import { PortfolioContainerProps } from "../portfolio/portfolioTypes.ts";

export const secDetails = signal<Security | null>(null);
export const secModal = signal<boolean>(false);
export const constructionFlowAccount = signal<string | string[] | null>(null);

export type NodeStateData = {
  data: IRowNode<any>;
  color: string;
  columnId: number;
};

const AEGrid: React.FC<PortfolioContainerProps> = ({
  setSectorClassVal,
  setSecurities,
  setReffo,
  pointsView,
  sectorClassVal,
  securities,
}) => {
  console.log(constructionFlowAccount.value);
  let accountId = useAppSelector(getAccountId);

  const dispatch = useDispatch();

  const { theme, setTheme } = useTheme();

  const currentSelection = useAppSelector(getPersistedCurrentSelection);

  function dispatchAddSecurities(data: Security[]) {
    dispatch(addSecurities(data));
  }

  const [vals, setVals] = useState<boolean>(false);

  const gridRef = useRef<any>(null);
  useEffect(() => {
    setReffo((state) => {
      if (state == null) {
        return gridRef;
      } else {
        return state;
      }
    });
  }, []);

  const [pivotState, setPivotState] = useState<boolean>(false);

  const [countryView, setCountryView] = useState<Option[]>([]);
  const [regionView, setRegionView] = useState<Option[]>([]);
  const [pointsViews, setPointsView] = useState<string>("percentage");
  const [assetClassView, setAssetClassView] = useState<Option[]>([]);
  const [sectorClassView, setSectorClassView] = useState<Option[]>([]);
  let [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [showColumnGroup, setShowColumnGroup] = useState<boolean>(false);

  //   const [securities, setSecuritiess] = useState<Security[] | null>(null);

  const [customView, setCustomView] = useState<boolean>(false);

  const [assetVal, setAssetVal] = useState<Option | undefined>();

  const [regionViewVal, setRegionViewVal] = useState<Option | undefined>();
  const [countryViewVal, setCountryViewVal] = useState<Option | undefined>();
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [rowHeight, setRowHeight] = useState<number>(30);

  const highlightedNodes = useAppSelector(getHighlightedNodes);
  const persitedCurrentSelection = useAppSelector(getPersistedCurrentSelection);

  function dispatchHighlightedNodes(data: NodeStateData[]) {
    console.log(data,'skabndmm')
    dispatch(setHighlightedNodes(data));
  } 

  console.log(highlightedNodes,'skandmishjra')

  useEffect(() => {
    // Fetch dropdown views
    const fetchData = async () => {
      try {
        const countryData = await api.get(
          `/country/all/${getCurrentDateFormatted()}`
        );
        setCountryView(
          countryData.data.map((item: any) => ({
            value: item.countryModelId,
            label: item.countryModelName,
          }))
        );

        const regionData = await api.get(
          `/region/all/${getCurrentDateFormatted()}`
        );
        setRegionView(
          regionData.data.map((item: any) => ({
            value: item.parentRegionModelId,
            label: item.regionModelName,
          }))
        );

        const assetClassData = await api.get(
          `/assetclass/all/${getCurrentDateFormatted()}`
        );
        setAssetClassView(
          assetClassData.data
            .map((item: any, index) => {
              if (index == 0) {
                return {
                  value: item.assetClassModelId,
                  label: item.assetClassModelName,
                };
              }
            })
            .filter((item) => item !== undefined)
        );

        const sectorClassData = await api.get(
          `/sectormodels/all/${getCurrentDateFormatted()}`
        );
        setSectorClassView(
          sectorClassData.data.sectorModelList.map((item: any) => ({
            value: item.sectorModelId,
            label: item.sectorModelName,
          }))
        );
      } catch (error) {
        console.error("Error fetching dropdown views:", error);
      }
    };

    fetchData();
  }, [accountId]);

  const expandAll = () => {
    gridRef.current.api.expandAll();
  };

  const handleCellEditing = (params) => {
    if (params.valueChanged) {
      const rowNode = params.api.getRowNode(params.node.id);
      console.log(rowNode, "rownode");
      // const data = params.data;
      // data.isEdited = true;
      // rowNode.setDataValue(data);
    }
  };

  const toggleColumnGroup = () => {
    setShowColumnGroup(!showColumnGroup);
  };

  const collapseAll = () => {
    gridRef.current.api.collapseAll();
  };

  const handleCellClicked = (data: any) => {
    const broken = structuredClone(data.data);
    dispatch(updatePortfolioNode(broken));
    if (data?.data?.securityId) {
      let {
        data: { securityName },
      } = data;
      const sec = securities?.find((sec) => sec.securityName === securityName);
      // setSecurityDetails(sec!);
      dispatch(addSecurityId(broken));
    }
    console.log(data);
  };

  const [activeColumn, setActiveColumn] = useState(null);

  const onColumnClicked = (event) => {
    const { colDef } = event;
    setActiveColumn(colDef.field);
  };

  // useEffect(() => {
  //   if (gridRef && gridRef.current && gridRef.current.api) {
  //     gridRef.current.api.expandAll();
  //   }
  // }, [rowData]);

  const additionalData = useAppSelector(getAdditionalData);

  const getColumnsDefs = useMemo(() => {
    return [
      {
        headerName: "Security Indicative",
        headerClass: "group-header-parent",
        pinned: "left",
        children: [
          {
            field: "securityId",
            headerName: "Sec Id",
            headerClass: "subheading",
            minWidth: "90",
            hide: showColumnGroup,

            pivot: true,
            rowGroup: true,
            cellClass: "centered-cells",
            cellStyle: () => {
              return {
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              };
            },
          },
          {
            field: "securityTypeCd",
            headerName: "Sec Type",
            minWidth: "90",
            headerClass: "subheading",

            hide: showColumnGroup,
            cellClass: "centered-cells",
          },
          {
            field: "cusip",
            headerClass: "subheading",
            minWidth: "90",
            hide: showColumnGroup,
            cellClass: "centered-cells",
          },
          {
            field: "sedol",
            headerClass: "subheading",
            minWidth: "90",
            hide: showColumnGroup,

            cellClass: "centered-cells",
          },
          {
            field: "isin",
            headerClass: "subheading",
            minWidth: "90",
            hide: showColumnGroup,

            cellClass: "centered-cells",
          },
          {
            field: "price",
            headerClass: "subheading",
            minWidth: "90",
            cellRenderer: priceRenderer,

            hide: showColumnGroup,
            cellClass: "centered-cells",
          },
        ],
      },
      ...(accountId
        ? accountId.map((item, index) => {
            const datas = additionalData?.map((item) => {
              return {
                field: toCamelCase(item),
                headerName: item,
                headerClass: "account-sub-header",
                minWidth: "125",
                cellRendererParams: {
                  pointsView: pointsView,
                  colVal: toCamelCase(item),
                },
                filter: "agNumberColumnFilter",
                cellClass: "centered-cells",
                cellStyle: () => {
                  return {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  };
                },
                cellRenderer: ordinaryCellRenderer,
                cellClassRules: {
                  "positive-value": (params: any) =>
                    params?.data?.additionalAttributeMap?.[item] > 0,
                  "negative-value": (params: any) =>
                    params?.data?.additionalAttributeMap?.[item] < 0,
                },
              };
            });

            return {
              headerName: `${item.label} + ${item.value}`,
              headerClass: "account-header",
              headerComponentParams: {
                data: item,
              },
              headerGroupComponent: AECustomHeader,
              filter: "agTextColumnFilter",
              children: [
                ...(datas ?? []),
                {
                  field: `preOptimizationWeight${item.value}`,
                  headerName: "Current Wght",
                  cellClass: "centered-cells",
                  cellRenderer: (p) =>
                    preOptRenderer(p, `preOptimizationWeight${item.value}`),
                  minWidth: "125",
                  filter: "agNumberColumnFilter",
                  cellRendererParams: {
                    pointsView: pointsView,
                  },
                  headerClass: "account-sub-header",
                  cellClassRules: {
                    "positive-value": (params: any) =>
                      params.data[`preOptimizationWeight${item.value}`] > 0,
                    "negative-value": (params: any) =>
                      params.data[`preOptimizationWeight${item.value}`] < 0,
                  },
                  cellStyle: () => {
                    return {
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    };
                  },
                },
                {
                  field: `benchmarkWeight${item.value}`,
                  headerName: "BM Weight",

                  filter: "agNumberColumnFilter",
                  cellClass: "centered-cells",
                  minWidth: "125",

                  cellRendererParams: {
                    pointsView: pointsView,
                  },
                  headerClass: "account-sub-header",
                  cellClassRules: {
                    "positive-value": (params: any) =>
                      params.data[`benchmarkWeight${item.value}`] > 0,
                    "negative-value": (params: any) =>
                      params.data[`benchmarkWeight${item.value}`] < 0,
                  },
                  cellRenderer: (p) =>
                    postOptRenderer(p, `benchmarkWeight${item.value}`),
                  cellStyle: () => {
                    return {
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    };
                  },
                },
                {
                  editable: true,
                  field: `overrideWeight${item.value}`,
                  headerName: "Override Wght",
                  minWidth: "125",
                  filter: "agNumberColumnFilter",
                  cellClass: "centered-cells",
                  cellRendererParams: {
                    pointsView: pointsView,
                  },
                  headerClass: "account-sub-header",
                  onCellValueChanged: (e) => {
                    const newOverride: OverrideData = {
                      newWeight: Number(e.newValue),
                      overrideID: e.data.securityId,
                      previousWeight: e.oldValue,
                    };
                    dispatch(updateNewOverrideData(newOverride));
                  },
                  cellRenderer: (p) =>
                    tradingWeightRenderer(p, `overrideWeight${item.value}`),
                
                  cellStyle: (e) => {
                    if (
                      highlightedNodes &&
                      highlightedNodes.some(
                        (item) =>
                          item.data === e.node.key &&
                          item.columnId === e.column.getInstanceId()
                      )
                    ) {
                      const color = highlightedNodes.find(
                        (item) =>
                          item.data === e.node.key &&
                          item.columnId === e.column.getInstanceId()
                      )?.color;
                      return {
                        border: `1px solid ${color}`,
                      };
                    } else {
                      return {
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                      };
                    }
                  },
                },
                {
                  field: `tradingWeight${item.value}`,
                  headerName: "Trade Wt",
                  minWidth: "125",
                  filter: "agNumberColumnFilter",
                  cellClass: "centered-cells",
                  cellRendererParams: {
                    pointsView: pointsView,
                  },
                  headerClass: "account-sub-header",
                  cellClassRules: {
                    "positive-value": (params: any) =>
                      params.data[`tradingWeight${item.value}`] > 0,
                    "negative-value": (params: any) =>
                      params.data[`tradingWeight${item.value}`] < 0,
                  },
                  cellRenderer: (p) =>
                    tradingWeightRenderer(p, `tradingWeight${item.value}`),
                  cellStyle: () => {
                    return {
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      width: "125px",
                    };
                  },
                },
              ],
            };
          })
        : []),
    ];
  }, [additionalData, showColumnGroup, accountId, highlightedNodes]);

  useEffect(() => {
    setColumnDefs(getColumnsDefs);
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.refreshCells();
      gridRef.current.api.expandAll();
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [accountId, pointsView, showColumnGroup]);

  useEffect(() => {
    setColumnDefs(getColumnsDefs);
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.refreshCells();
      gridRef.current.api.expandAll();
      gridRef.current.api.sizeColumnsToFit();
    }
  }, [accountId, pointsView, showColumnGroup]);

  useEffect(() => {
    console.log(additionalData);
    if (additionalData && additionalData.length > 0) {
      setColumnDefs(getColumnsDefs);
    } else {
      setColumnDefs(getColumnsDefs);
    }
  }, [additionalData, highlightedNodes]);

  const autoGroupColumnDef = useMemo(() => {
    return currentSelection?.id === 1
      ? {
          field: "sectorName",
          headerClass: "group-header-parent classification",
          headerName: currentSelection.label,
          pinned: "left",
          headerComponent: MyHeaderComponent,
          headerComponentParams: {
            toggle: showColumnGroup,
            updateToggle: setShowColumnGroup,
            text: currentSelection.label,
          },
          enablePivot: true,

          cellRenderer: TooltipRenderer,
          filter: "agNumberColumnFilter",
          cellRendererParams: {
            pointsView: pointsView,
          },
          minWidth: "225",
          resizable: true,
          children: [
            {
              field: "default",
              headerName: "Classification",
              headerClass: "subheading",
            },
          ],
        }
      : {
          field:
            currentSelection?.id === 2
              ? "regionCd"
              : currentSelection?.id === 3
              ? "countryCd"
              : "assetClassName",
          headerClass: "group-header-parent classification",
          cellRenderer: TooltipRenderer,
          enablePivot: true,
          aggFunc: "sum",
          minWidth: "300",
          headerComponent: MyHeaderComponent,
          headerName: currentSelection?.label,
          headerComponentParams: {
            toggle: showColumnGroup,
            updateToggle: setShowColumnGroup,
          },
          filter: "agNumberColumnFilter",
          hide: true,
        };
  }, [currentSelection, pointsView, showColumnGroup]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      resizable: true,
    };
  }, []);

  const handleCustomView = () => {
    setCustomView(true);
  };

  const closeCustomVuew = () => {
    setCustomView(false);
  };

  const getDataPath = useMemo(() => (data: any) => data.dataPath, []);

  const url = (account: SelectOption, option: Option) => {
    switch (option.id) {
      case 0:
        return `account/assetclass/holding/1/${account.value}`;
      case 1:
        return `account/sector/holding/${account.value}/${option.value}`;
      case 2:
        return `/account/region/holding/${account.value}`;
      case 3:
        return `/account/country/holding/${account.value}`;
      default:
        return `account/sector/holding/${account.value}/${option.value}`;
    }
  };

  const onGridReady = useMemo(async () => {
    try {
      gridRef.current.api.openToolPanel(false);
      if (
        persitedCurrentSelection &&
        persitedCurrentSelection.id !== null &&
        vals === false
      ) {
        if (accountId && accountId.length > 0) {
          gridRef.current.api.showLoadingOverlay();

          let promises: any = [];

          accountId.forEach((account) => {
            const prom = api.get(url(account, persitedCurrentSelection));
            promises.push(prom);
          });

          const data = await Promise.all(promises);

          const field = (id: number) => {
            switch (id) {
              case 0:
                return {
                  string: "assetClassHoldingViewList",
                  function: (item) => item,
                };
              case 1:
                return {
                  string: "classificationHoldingViewList",
                  function: filterTree,
                };
              case 2:
                return {
                  string: "regionHoldingViewList",
                  function: (item) => item,
                };
              case 3:
                return {
                  string: "countryHoldingViewList",
                  function: (item) => item,
                };
              default:
                return {
                  string: "classificationHoldingViewList",
                  function: (item) => item,
                };
            }
          };

          const results2 = data.map((item, index) => {
            return {
              data: field(persitedCurrentSelection.id).function(
                item.data[field(persitedCurrentSelection.id).string]
              ),
              id: accountId[index].value,
            };
          });

          const dats = processDataThree(results2, currentSelection);
          console.log(dats);
          gridRef.current.api.showLoadingOverlay();

          api
            .get(
              `account/sector/holding/${accountId[0].value}/${
                sectorClassVal?.value ?? "4"
              }`
            )
            .then((data: any) => {
              try {
                const betterData = filterTree(
                  data.data.classificationHoldingViewList
                );
                let proccessed = processData(betterData, currentSelection);
                console.log(securities, "sss");
                if (securities == null) {
                  const option = {
                    value: 1,
                    label: "GICS Sector",
                    id: 1,
                  };
                  // setSectorClassVal(option);
                  setSecurities(collectLeaves(dats));
                  dispatchAddSecurities(collectLeaves(dats));
                }
                console.log(dats);
                gridRef.current.api.setRowData(dats);
                gridRef.current.api.hideOverlay();
                gridRef.current.api.expandAll();
                setVals(true);
              } catch (error) {
                console.error("Error occurred while processing data:", error);
              }
            })
            .catch((error: any) => {
              console.error("Error occurred while fetching data:", error);
            });
        }
      }
    } catch (error) {
      console.error("Error occurred in onGridReady function:", error);
    }
  }, [vals, gridRef.current]);

  function dispatchSecurityModal(data: boolean) {
    dispatch(setSecurityModal(data));
  }

  const securityModal = useAppSelector(getSecurityModal);

  function close() {
    dispatchSecurityModal(false);
  }

  const [customViewData, setCustomViewData] = useState<any | null>(null);

  useEffect(() => {
    async function handleREquests() {
      api.get("/customview/characteristics").then((res) => {
        setCustomViewData(res.data);
      });
    }
    if (customViewData == null) {
      handleREquests();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newViewportWidth = window.innerWidth;
      setViewportWidth(newViewportWidth);
    };

    const setInitialViewportWidth = () => {
      const initialViewportWidth = window.innerWidth;
      setViewportWidth(initialViewportWidth);
    };

    setInitialViewportWidth();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    console.log(viewportWidth, "called");
    const calculateRowHeight = () => {
      switch (true) {
        case viewportWidth >= 1500 && viewportWidth < 1700:
          setRowHeight(27);
          break;
        case viewportWidth >= 1700 && viewportWidth < 2000:
          setRowHeight(29);
          break;
        case viewportWidth >= 2000 && viewportWidth < 2400:
          setRowHeight(45);
          break;
        case viewportWidth >= 2400 && viewportWidth < 2900:
          setRowHeight(49);
          break;
        case viewportWidth >= 2900 && viewportWidth < 3900:
          setRowHeight(52);
          break;
        case viewportWidth >= 3900:
          setRowHeight(56);
          break;
        default:
          setRowHeight(27);
      }
    };

    calculateRowHeight();

    window.addEventListener("resize", calculateRowHeight);

    return () => {
      window.removeEventListener("resize", calculateRowHeight);
    };
  }, [viewportWidth]);

  //   console.log(Object.isFrozen(rowData)); // Checks if the object is frozen
  // console.log(Object.isSealed(rowData)); // Checks if the object is sealed

  console.log(highlightedNodes); // Checks if the object is sealed

  const testMemo = useMemo(() => {
    console.log(highlightedNodes);
    return highlightedNodes;
  }, [highlightedNodes]);

  console.log(testMemo);

  return (
    <div style={{ height: "81.75%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          border: theme == "light" ? "" : "0.5px solid #5c5c5c",
        }}
        className={
          theme == "light" ? `ag-theme-balham` : `ag-theme-balham-dark`
        }
      >
        <div style={{ flex: "1 1 0px", width: "100%" }}>
          <div
            style={{
              border:
                theme == "light" ? ".5px solid #8D8D8D" : ".5px solid #5c5c5c",
              height: "100%",
              width: "100%",
            }}
          >
            <AgGridReact
              onCellValueChanged={(e) => {
                console.log(e);
                const prev = highlightedNodes ?? ([] as NodeStateData[]);
                dispatchHighlightedNodes([
                  ...prev,
                  {
                    data: e.node.key,
                    columnId: e.column.getInstanceId(),
                    color: "#000000",
                  },
                ]);
              }}
              ref={gridRef}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              autoGroupColumnDef={autoGroupColumnDef as any}
              onCellClicked={handleCellClicked}
              pivotMode={true}
              treeData={true}
              sideBar={true}
              onCellEditingStopped={handleCellEditing}
              colResizeDefault={"shift"}
              rowSelection="multiple"
              getDataPath={getDataPath}
              onGridReady={onGridReady}
              rowHeight={rowHeight}
            />
          </div>
        </div>
      </div>
      {securityModal && <SecurityView securities={securities!} close={close} />}
    </div>
  );
};

export default AEGrid;

const MyHeaderComponent = (params) => {
  console.log("params", params);
  const theme = useTheme();
  const toggleColumnGroup = () => {
    params.updateToggle(!params.toggle);
  };
  const dispatch = useDispatch();

  const listedAccounts = useAppSelector(getAccountId);

  function dispatchShowOptimizationDefinition(val: boolean) {
    dispatch(setShowOptimizationDefinition(val));
  }
  return (
    <div className="header-icons-list">
      <h3 className="heading-text"> {params.displayName}</h3>
      <button
        style={{ background: "none" }}
        onClick={() => toggleColumnGroup()}
      >
        {params.toggle ? (
          <img
            style={{ width: "1.5rem" }}
            src={"/expand.svg"}
            alt="Collapse Button"
          />
        ) : (
          <img
            style={{ width: "1.5rem" }}
            src={"/collapse.svg"}
            alt="Expand button "
          />
        )}
      </button>
      <div className="icons">
        <ImageComponent src="mic.svg" alt="Microphone-icon" />
        <ImageComponent
          src="settings--check.svg"
          alt="settings--check-icon"
          style={{ cursor: "pointer" }}
          onClick={() => {
            console.log(params);
            // console.log(listedAccounts);
            dispatchShowOptimizationDefinition(true);
            constructionFlowAccount.value = listedAccounts.map(
              (item) => item.label as any
            );
          }}
        />
      </div>
    </div>
  );
};
