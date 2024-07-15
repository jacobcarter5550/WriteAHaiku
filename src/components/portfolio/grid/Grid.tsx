/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import { useDispatch } from "react-redux";
import api from "../../../helpers/serviceTP.ts";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import SecurityView, { Security } from "../../modals/SecurityPreview/securtityViewTP.tsx";
import { useTheme } from "next-themes";
import { filterTree, toCamelCase, processDataThree } from "../portfolioLib.tsx";
import {
    preOptRenderer,
    priceRenderer,
    postOptRenderer,
    tradingWeightRenderer,
    ordinaryCellRenderer,
    TooltipRenderer,
} from "./cellRendererTP.tsx";
import { ClassificationHoldingView, PortfolioContainerProps } from "../portfolioTypes.ts";
import { signal } from "@preact/signals-react";
import { updatePortfolioNode, addSecurityId } from "../../../store/portfolio/index.ts";
import { useAppSelector } from "../../../store/index.ts";
import {
    getAccountId,
    getPersistedCurrentSelection,
    getSelectedAccountList,
} from "../../../store/portfolio/selector.ts";
import { collectLeaves } from "../../modals/portfolioConstruction/lib.ts";
import CustomHeader from "./customHeaderTP.tsx";
import { getCurrentDateFormatted } from "../../../helpers/lib.ts";
import { getAdditionalData, getSecurityModal } from "../../../store/nonPerstistant/selectors.ts";
import {
    addSecurities,
    setSecurityModal,
    setShowOptimizationDefinition,
} from "../../../store/nonPerstistant/index.ts";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import { Option } from "../../../types/types.ts";
import { SelectOption } from "../../nav/Nav.tsx";
import camelCase from "camelcase";
import toWords from "split-camelcase-to-words";
import decamelize from "decamelize";

export const secDetails = signal<Security | null>(null);
export const secModal = signal<boolean>(false);
export const constructionFlowAccount = signal<string | string[] | null>(null);

const Grid: React.FC<PortfolioContainerProps> = ({
    setSectorClassVal,
    setSecurities,
    setReffo,
    pointsView,
    sectorClassVal,
    securities,
}) => {
    const accountId = useAppSelector(getAccountId);

    const dispatch = useDispatch();

    const { theme } = useTheme();

    const [vals, setVals] = useState<boolean>(false);

    const persitedCurrentSelection = useAppSelector(getPersistedCurrentSelection);

    function dispatchAddSecurities(data: Security[]) {
        dispatch(addSecurities(data));
    }

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

    const [rowData, setRowData] = useState<ClassificationHoldingView[] | null>(null);
    const [columnDefs, setColumnDefs] = useState<any[]>([]);
    const [showColumnGroup, setShowColumnGroup] = useState<boolean>(false);

    // const [securities, setSecuritiess] = useState<Security[] | null>(null);
    //   const [sectorClassVal, setSectorClassVall] = useState<Option | undefined>();
    const [regionViewVal, setRegionViewVal] = useState<Option | undefined>();
    const [countryViewVal, setCountryViewVal] = useState<Option | undefined>();
    const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
    const [rowHeight, setRowHeight] = useState<number>(30);

    const handleCellClicked = (data: any) => {
        dispatch(updatePortfolioNode(data.data));
        if (data?.data?.securityId) {
            const {
                data: { securityName },
            } = data;
            dispatch(addSecurityId(data.data));
        }
    };

    const [activeColumn, setActiveColumn] = useState(null);

    const onColumnClicked = (event) => {
        const { colDef } = event;
        setActiveColumn(colDef.field);
    };

    useEffect(() => {
        if (gridRef && gridRef.current && gridRef.current.api) {
            gridRef.current.api.expandAll();
        }
    }, [rowData]);

    const additionalData = useAppSelector(getAdditionalData);
    const selectedPortfolioAccountList = useAppSelector(getSelectedAccountList);
    const persistedCurrentSelection = useAppSelector(getPersistedCurrentSelection);

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
                      console.log(item, additionalData);
                      const datas = additionalData?.map((item) => {
                          const camelCasedString = decamelize(item);
                          const title = toWords(camelCasedString);
                          return {
                              field: toCamelCase(item),
                              headerName: title,
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
                          headerGroupComponent: CustomHeader,
                          filter: "agTextColumnFilter",
                          children: [
                              ...(datas ?? []),
                              {
                                  field: `preOptimizationWeight${item.value}`,
                                  headerName: "Pre-opt",
                                  cellClass: "centered-cells",
                                  cellRenderer: (p: any) =>
                                      preOptRenderer(p, `preOptimizationWeight${item.value}`),
                                  minWidth: "125",
                                  filter: "agNumberColumnFilter",
                                  cellRendererParams: {
                                      pointsView: pointsView,
                                  },
                                  headerClass: "account-sub-header",
                                  cellClassRules: {
                                      "positive-value": function (params: any) {
                                          // Check if 'classificationHoldingViews' or 'accountHoldingViews' exist in data
                                          if (
                                              params.data.classificationHoldingViews ||
                                              params.data.accountHoldingViews
                                          ) {
                                              return null; // Return null if any of the specified properties exist
                                          }
                                          // Otherwise, evaluate and return the boolean condition
                                          return (
                                              params.data[`preOptimizationWeight${item.value}`] > 0
                                          );
                                      },
                                      "negative-value": function (params: any) {
                                          // Check if 'classificationHoldingViews' or 'accountHoldingViews' exist in data
                                          if (
                                              params.data.classificationHoldingViews ||
                                              params.data.accountHoldingViews
                                          ) {
                                              return null; // Return null if any of the specified properties exist
                                          }
                                          // Otherwise, evaluate and return the boolean condition
                                          return (
                                              params.data[`preOptimizationWeight${item.value}`] < 0
                                          );
                                      },
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
                                  field: `postOptimizationWeight${item.value}`,
                                  headerName: "Post-opt",

                                  filter: "agNumberColumnFilter",
                                  cellClass: "centered-cells",
                                  minWidth: "125",

                                  cellRendererParams: {
                                      pointsView: pointsView,
                                  },
                                  headerClass: "account-sub-header",
                                  cellClassRules: {
                                      "positive-value": function (params: any) {
                                          // Check if 'classificationHoldingViews' or 'accountHoldingViews' exist in data
                                          if (
                                              params.data.classificationHoldingViews ||
                                              params.data.accountHoldingViews
                                          ) {
                                              return null; // Return null if any of the specified properties exist
                                          }
                                          // Otherwise, evaluate and return the boolean condition
                                          return (
                                              params.data[`postOptimizationWeight${item.value}`] > 0
                                          );
                                      },
                                      "negative-value": function (params: any) {
                                          // Check if 'classificationHoldingViews' or 'accountHoldingViews' exist in data
                                          if (
                                              params.data.classificationHoldingViews ||
                                              params.data.accountHoldingViews
                                          ) {
                                              return null; // Return null if any of the specified properties exist
                                          }
                                          // Otherwise, evaluate and return the boolean condition
                                          return (
                                              params.data[`postOptimizationWeight${item.value}`] < 0
                                          );
                                      },
                                  },
                                  cellRenderer: (p: any) =>
                                      postOptRenderer(p, `postOptimizationWeight${item.value}`),
                                  cellStyle: () => {
                                      return {
                                          alignItems: "center",
                                          display: "flex",
                                          justifyContent: "center",
                                      };
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
                                      "positive-value": function (params: any) {
                                          // Check if 'classificationHoldingViews' or 'accountHoldingViews' exist in data
                                          if (
                                              params.data.classificationHoldingViews ||
                                              params.data.accountHoldingViews
                                          ) {
                                              return null; // Return null if any of the specified properties exist
                                          }
                                          // Otherwise, evaluate and return the boolean condition
                                          return params.data[`tradingWeight${item.value}`] > 0;
                                      },
                                      "negative-value": function (params: any) {
                                          // Check if 'classificationHoldingViews' or 'accountHoldingViews' exist in data
                                          if (
                                              params.data.classificationHoldingViews ||
                                              params.data.accountHoldingViews
                                          ) {
                                              return null; // Return null if any of the specified properties exist
                                          }
                                          // Otherwise, evaluate and return the boolean condition
                                          return params.data[`tradingWeight${item.value}`] < 0;
                                      },
                                  },
                                  cellRenderer: (p: any) =>
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
    }, [additionalData, showColumnGroup, pointsView, accountId]);

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
            gridRef.current.api.sizeColumnsToFit();
            gridRef.current.api.refreshCells();
        }
    }, [persitedCurrentSelection, pointsView, accountId]);

    useEffect(() => {
        console.log(additionalData);
        if (additionalData && additionalData.length > 0) {
            setColumnDefs(getColumnsDefs);
        } else {
            setColumnDefs(getColumnsDefs);
        }
    }, [additionalData]);

    const autoGroupColumnDef = useMemo(() => {
        if (persitedCurrentSelection) {
            return persitedCurrentSelection.id === 1
                ? {
                      field: "sectorName",
                      headerClass: "group-header-parent classification",
                      headerName: persitedCurrentSelection.label,
                      pinned: "left",
                      headerComponent: MyHeaderComponent,
                      headerComponentParams: {
                          toggle: showColumnGroup,
                          updateToggle: setShowColumnGroup,
                          text: persitedCurrentSelection.label,
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
                          persitedCurrentSelection.id === 2
                              ? "regionCd"
                              : persitedCurrentSelection.id === 3
                              ? "countryCd"
                              : "assetClassName",
                      headerClass: "group-header-parent classification",
                      cellRenderer: TooltipRenderer,
                      enablePivot: true,
                      aggFunc: "sum",
                      minWidth: "300",
                      headerComponent: MyHeaderComponent,
                      headerName: persitedCurrentSelection.label,
                      headerComponentParams: {
                          toggle: showColumnGroup,
                          updateToggle: setShowColumnGroup,
                      },
                      filter: "agNumberColumnFilter",
                      hide: true,
                  };
        }
    }, [persitedCurrentSelection, pointsView, showColumnGroup, accountId]);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            resizable: true,
        };
    }, []);

    function filterDuplicatesBySecurityId(securities: Security[]): Security[] {
        const seenSecurityIds = new Set<string>();
        return securities.filter((security) => {
            if (seenSecurityIds.has(security.securityId)) {
                return false;
            } else {
                seenSecurityIds.add(security.securityId);
                return true;
            }
        });
    }

    const getDataPath = useMemo(() => (data: any) => data.dataPath, [rowData]);

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
            if (gridRef?.current.api) {
                gridRef?.current.api.openToolPanel(false);
            }
            if (
                persitedCurrentSelection &&
                persitedCurrentSelection.id !== null
                //  && vals === false
            ) {
                if (accountId && accountId.length > 0) {
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
                    console.log("results2-->", collectLeaves(results2));
                    const dats = processDataThree(results2, persitedCurrentSelection);
                    let securityAggregation: any[] = [];
                    for (const val of results2) {
                        securityAggregation = [...securityAggregation, ...collectLeaves(val.data)];
                    }
                    console.log("Security-->", filterDuplicatesBySecurityId(securityAggregation));
                    setSecurities(filterDuplicatesBySecurityId(securityAggregation));
                    gridRef.current.api.showLoadingOverlay();

                    try {
                        gridRef.current.api.setRowData(dats);
                        gridRef.current.api.hideOverlay();
                        gridRef.current.api.expandAll();
                        setVals(true);
                    } catch (error) {
                        console.error("Error occurred while processing data:", error);
                    }
                }
            }
        } catch (error) {
            console.error("Error occurred in onGridReady function:", error);
        }
    }, [vals, gridRef.current, accountId]);

    console.log("accountId-->", accountId);
    console.log("persitedCurrentSelection", persitedCurrentSelection);
    console.log("vals", vals);

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
            api.get("/customview/characteristics")
                .then((res) => {
                    setCustomViewData(res.data);
                })
                .catch((error) => {
                    console.error("Error occurred while fetching custom view data:", error);
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

    const loadingOverlayTemplate = useMemo(() => {
        if (selectedPortfolioAccountList && selectedPortfolioAccountList.includes("Select")) {
            return `<span class="ag-overlay-loading-center">Select Account...</span>`;
        } else if (persistedCurrentSelection === null) {
            return `<span class="ag-overlay-loading-center">Select Sector...</span>`;
        }
    }, [selectedPortfolioAccountList, persistedCurrentSelection]);

    return (
        <div style={{ height: "81.75%" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    border: theme == "light" ? "" : "0.5px solid #5c5c5c",
                }}
                className={theme == "light" ? `ag-theme-balham` : `ag-theme-balham-dark`}
            >
                <div style={{ flex: "1 1 0px", width: "100%" }}>
                    <div
                        style={{
                            border: theme == "light" ? ".5px solid #8D8D8D" : "0px solid #5c5c5c",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <AgGridReact
                            key={`${loadingOverlayTemplate} ${accountId}`}
                            ref={gridRef}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            autoGroupColumnDef={autoGroupColumnDef as any}
                            onCellClicked={handleCellClicked}
                            pivotMode={false}
                            treeData={true}
                            suppressRowClickSelection
                            sideBar={true}
                            colResizeDefault={"shift"}
                            rowSelection="multiple"
                            getDataPath={getDataPath}
                            onGridReady={onGridReady}
                            rowHeight={rowHeight}
                            overlayLoadingTemplate={loadingOverlayTemplate}
                        />
                    </div>
                </div>
            </div>
            {securityModal && <SecurityView securities={securities!} close={close} />}
        </div>
    );
};

export default Grid;

const MyHeaderComponent = (params) => {
    const dispatch = useDispatch();

    const toggleColumnGroup = () => {
        params.updateToggle(!params.toggle);
    };

    const listedAccounts = useAppSelector(getAccountId);

    function dispatchShowOptimizationDefinition(val: boolean) {
        dispatch(setShowOptimizationDefinition(val));
    }
    return (
        <div className="header-icons-list">
            <h3 className="heading-text"> {params.displayName}</h3>
            <button style={{ background: "none" }} onClick={() => toggleColumnGroup()}>
                {params.toggle ? (
                    <img style={{ width: "1.5rem" }} src={"/expand.svg"} alt="Collapse Button" />
                ) : (
                    <img style={{ width: "1.5rem" }} src={"/collapse.svg"} alt="Expand button " />
                )}
            </button>
            <div className="icons">
                <ImageComponent src="mic.svg" alt="Microphone-icon" />
                <ImageComponent
                    src="settings--check.svg"
                    alt="settings--check-icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        console.log(listedAccounts);
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
