import React, { useEffect, useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Characteristic, Data, InitialState } from "../customview/types.ts";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import { toast } from "react-toastify";
import "../../../styles/customView.scss";
import { Virtuoso } from "react-virtuoso";
import BlockItemSecurity from "./BlockItemSecurity.tsx";
import SearchBox from "../customview/searchBox.tsx";
import api from "../../../helpers/serviceTP.ts";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountDetails } from "../../../store/portfolio/selector.ts";
import Button from "../../../ui-elements/buttonTP.tsx";
import { useTheme } from "next-themes";
interface Props {
  customViewData: any;
  open: boolean;
  onClose: () => void;
  setComparedDataPortfolio: React.Dispatch<React.SetStateAction<any>>;
  setComparedDataSecurity: React.Dispatch<React.SetStateAction<any>>;
  comparisonType: string;
  hierarchicalState: InitialState;
  setHierarchicalState: React.Dispatch<React.SetStateAction<any>>;
  hierarchicalStateSecurity: InitialState;
  setHierarchicalStateSecurity: React.Dispatch<React.SetStateAction<any>>;
  comparedDataPortfolio: any;
  comparedDataSecurity: any;
}

type ComparisonResponse = {
  id: string;
  comparisonAttributes: {
    attributeName: string;
    values: {
      attributeValue: number;
      date: string;
    }[];
  }[];
};

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7F9",
  },
  CVpaper: {
    width: "95%",
    display: "flex",
    border: "0",
    flexDirection: "column",
    gap: "1.8rem",
  },
  block: {
    width: "100%",
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
  },
  innerBlock: {
    display: "flex",
    gap: "2rem",
    padding: "5px 20px 5px 12px",
    justifyContent: "space-between",
    border: "1px solid #8D8D8D",
    marginBottom: "0.7rem",
  },
  title: {
    color: "#161616",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "500",
  },
  CVsectionTitle: {
    textAlign: "center",
    padding: "15px",
    fontSize: "1.2rem",
    marginBottom: "2rem",
    fontWeight: "600",
    position: "sticky",
    top: "0",
  },
  closeIcon: {
    position: "relative",
    left: "98%",
    cursor: "pointer",
  },
  searchBox: {
    marginTop: "1rem",
  },
};

const initialState: InitialState = {};

const SecurityComparison: React.FC<Props> = ({
  onClose,
  customViewData,
  setComparedDataPortfolio,
  setComparedDataSecurity,
  comparisonType,
  hierarchicalState,
  setHierarchicalState,
  hierarchicalStateSecurity,
  setHierarchicalStateSecurity,
  comparedDataPortfolio,
  comparedDataSecurity,
}) => {
  const theme = useTheme();
  const [data, setData] = useState<Data>(customViewData);
  const [list, setList] = useState<Characteristic[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const accountDetails = useAppSelector(getAccountDetails);

  const [filteredState, setFilteredState] = useState<InitialState>(
    comparisonType === "characteristic"
      ? hierarchicalState
      : hierarchicalStateSecurity
  );

  useEffect(() => {
    if (comparisonType === "characteristic") {
      if (Object.keys(hierarchicalState).length === 0) {
        Object?.keys(data)?.forEach((category: string) => {
          const updatedCategoryItems = (data[category] || []).map(
            (item: any, index: number) => {
              return {
                id: index,
                name: item,
                checkboxState: false,

                category: [category],
              };
            }
          );

          initialState[category] = {
            outerCheckBoxState: false,
            [category]: updatedCategoryItems,
          };
        });
        setHierarchicalState((prev) => ({ ...prev, ...initialState }));
        setFilteredState((prev) => ({ ...prev, ...initialState }));
      } else {
        setHierarchicalState(hierarchicalState);
        setFilteredState(hierarchicalState);
      }
    } else {
      if (Object.keys(hierarchicalStateSecurity).length === 0) {
        Object?.keys(data)?.forEach((category: string) => {
          const updatedCategoryItems = (data[category] || []).map(
            (item: any, index: number) => {
              return {
                id: index,
                name: item,
                checkboxState: false,

                category: [category],
              };
            }
          );

          initialState[category] = {
            outerCheckBoxState: false,
            [category]: updatedCategoryItems,
          };
        });
        setHierarchicalStateSecurity((prev) => ({ ...prev, ...initialState }));
        setFilteredState((prev) => ({ ...prev, ...initialState }));
      } else {
        setHierarchicalStateSecurity(hierarchicalStateSecurity);
        setFilteredState(hierarchicalStateSecurity);
      }
    }
  }, [data]);

  const handleInteraction = (
    category: string,
    id: number | null = null,
    value: string | boolean | null = null,
    action: string
  ) => {
    if (comparisonType === "characteristic") {
      switch (action) {
        case "checkbox":
          const checkedItemsCount = hierarchicalState[category][
            category
          ]?.filter(
            (characteristic: Characteristic) => characteristic.checkboxState
          ).length;

          if (value && checkedItemsCount >= 2) {
            console.log("charts1");
            toast.info("Can't select more than two characteristics");
            break;
          }

          setHierarchicalState((prevState: InitialState) => ({
            ...prevState,
            [category]: {
              outerCheckBoxState: prevState[category].outerCheckBoxState,
              [category]: prevState[category][category]?.map(
                (characteristic: Characteristic) => {
                  if (characteristic.id === id) {
                    return {
                      ...characteristic,
                      checkboxState: value,
                    };
                  }
                  return characteristic;
                }
              ),
            },
          }));
          break;

        default:
          break;
      }
    } else {
      switch (action) {
        case "checkbox":
          const checkedItemsCount = hierarchicalStateSecurity[category][
            category
          ]?.filter(
            (characteristic: Characteristic) => characteristic.checkboxState
          ).length;

          if (value && checkedItemsCount >= 2) {
            toast.info("Can't select more than two characteristics");
            break;
          }

          setHierarchicalStateSecurity((prevState: InitialState) => ({
            ...prevState,
            [category]: {
              outerCheckBoxState: prevState[category].outerCheckBoxState,
              [category]: prevState[category][category]?.map(
                (characteristic: Characteristic) => {
                  if (characteristic.id === id) {
                    return {
                      ...characteristic,
                      checkboxState: value,
                    };
                  }
                  return characteristic;
                }
              ),
            },
          }));
          break;

        default:
          break;
      }
    }
  };

  function transformStateToCustomView(state: any): string[] {
    const customViewCharacteristics: string[] = [];

    const categories = [
      "balanceSheetCharacteristics",
      "cashFlowCharacteristics",
      "fundamentalCharacteristics",
      "riskModelCharacteristics",
    ];

    categories.forEach((category) => {
      const characteristics = state[category]?.[category];
      if (Array.isArray(characteristics)) {
        characteristics.forEach((char: any) => {
          if (char.checkboxState) {
            customViewCharacteristics.push(char.name);
          }
        });
      }
    });

    return customViewCharacteristics;
  }

  const handleCompare = () => {
    let payloadArray;
    if (comparisonType === "characteristic") {
      payloadArray = transformStateToCustomView(hierarchicalState);
    } else {
      payloadArray = transformStateToCustomView(hierarchicalStateSecurity);
    }
    if (payloadArray.length == 0) {
      comparisonType == "characteristic"
        ? setComparedDataPortfolio({})
        : setComparedDataSecurity({});
      onClose();
      return;
    }

    let payload = {};
    if (comparisonType == "characteristic") {
      payload = {
        accountId: accountDetails?.accountId,
        attributeName: payloadArray,
      };
    } else {
      payload = {
        securityId: accountDetails?.securityId,
        attributeName: payloadArray,
      };
    }

    const apiUrl =
      comparisonType == "characteristic"
        ? "/portfolio/security/attributes"
        : "/security/attributes";
    try {
      api
        .post<ComparisonResponse>(apiUrl, payload)
        .then((response) => {
          let valuesArray: string[] = [];

          for (const value of response.data.comparisonAttributes) {
            valuesArray = [...valuesArray, value.attributeName];
          }

          const missingValue = payloadArray.filter((item) => {
            return !valuesArray
              .map((key) => key.replace(/[^a-zA-Z]/g, "").toLowerCase()) // Removing non-alphabet characters and converting to lowercase
              .includes(item.replace(/[^a-zA-Z]/g, "").toLowerCase()); // Matching after formatting both similarly
          });

          console.log("missingValue", missingValue, payloadArray);
          // Handling missing attributes with toast notifications
          missingValue?.forEach((item) => {
            const capitalizeFirstLetter = (str) =>
              str.charAt(0).toUpperCase() + str.slice(1);
            const capitalizedItem = capitalizeFirstLetter(item);
            toast.info(`${capitalizedItem} has no data present in it.`);
          });

          // comparisonType == "characteristic"
          // ? setComparedDataPortfolio(response?.data)
          // : setComparedDataSecurity(response.data);
          // console.log("response", missingValue);
          if (payloadArray.length == 1) {
            if (missingValue.length !== 1) {
              comparisonType == "characteristic"
                ? setComparedDataPortfolio(response?.data)
                : setComparedDataSecurity(response.data);
            }
          } else {
            if (missingValue.length !== 2) {
              comparisonType == "characteristic"
                ? setComparedDataPortfolio(response?.data)
                : setComparedDataSecurity(response.data);
            }
          }
          onClose();
        })
        .catch((error) => {
          console.error("Error occurred while updating custom view:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCancel = () => {
    if (
      comparisonType === "characteristic" &&
      Object.keys(comparedDataPortfolio).length !== 0
    ) {
      let payloadArray = transformStateToCustomView({});

      if (payloadArray.length == 0) {
        comparisonType == "characteristic"
          ? setComparedDataPortfolio({})
          : setComparedDataSecurity({});
        onClose();
        return;
      }

      let payload = {};
      if (comparisonType == "characteristic") {
        payload = {
          accountId: accountDetails?.accountId,
          attributeName: payloadArray,
        };
      } else {
        payload = {
          securityId: accountDetails?.securityId,
          attributeName: payloadArray,
        };
      }
      try {
        api
          .post("/security/attributes", payload)
          .then((response) => {
            const missingValue = payloadArray.filter((item) => {
              return !Object.keys(
                response?.data?.securityAttributeValue || {}
              ).includes(item);
            });

            missingValue?.map((item) => {
              const capitalizeFirstLetter = (str) =>
                str.charAt(0).toUpperCase() + str.slice(1);
              const capitalizedItem = capitalizeFirstLetter(item);
              toast.info(`${capitalizedItem} have no data present in them`);
            });
            comparisonType == "characteristic"
              ? setComparedDataPortfolio(response?.data)
              : setComparedDataSecurity(response.data);
            onClose();
          })
          .catch((error) => {
            console.error("Error occurred while updating custom view:", error);
          });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      console.log("charts");
      onClose();
    }
  };
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function debounce(func, delay: number) {
    return function (...args: []) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        func(...args);
        debounceTimeout.current = null;
      }, delay);
    };
  }

  useEffect(() => {
    if (comparisonType === "characteristic") {
      setFilteredState(hierarchicalState);
    }
  }, [hierarchicalState]);

  useEffect(() => {
    if (comparisonType === "security") {
      setFilteredState(hierarchicalStateSecurity);
    }
  }, [hierarchicalStateSecurity]);

  const buttons = (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="end"
      sx={{ width: "95%" }}
    >
      <Button
        label="Reset"
        className={
          theme.theme == "light"
            ? "pop-btnNeg buttonMarginHelper"
            : "pop-btnNeg-dark-mode buttonMarginHelper"
        }
        onClick={() => {
          if (comparisonType === "characteristic") {
            setHierarchicalState(initialState);
            setFilteredState(initialState);
          } else {
            setHierarchicalStateSecurity(initialState);
            setFilteredState(initialState);
          }
          handleCancel();
          onClose();
        }}
      />
      <Button
        label="Save"
        onClick={handleCompare}
        className={"pop-btn buttonMarginHelper"}
      />
    </Stack>
  );

  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
    if (!initialized) {
      const arraysToPush = Object.keys(filteredState)
        .filter((item) => item !== "message")
        .reduce((accumulator: Characteristic[], char) => {
          const value = filteredState[char][char];
          if (Array.isArray(value)) {
            return accumulator.concat(value);
          } else {
            return accumulator;
          }
        }, []);
      setList((prevList) => [...prevList, ...arraysToPush]);
      setInitialized(true);
    } else {
      const arraysToPush = Object.keys(filteredState)
        .filter((item) => item !== "message")
        .reduce((accumulator: Characteristic[], char) => {
          const value = filteredState[char][char];
          if (Array.isArray(value)) {
            return accumulator.concat(value);
          } else {
            return accumulator;
          }
        }, []);

      setList(arraysToPush);
    }
  }, [filteredState]);

  const handleSearch = (searchTerm: string) => {
    if (comparisonType === "characteristic") {
      if (!searchTerm?.trim()) {
        setFilteredState(hierarchicalState);
      } else {
        const filteredData: InitialState = {
          fundamentalCharacteristics: {
            outerCheckBoxState:
              hierarchicalStateSecurity.fundamentalCharacteristics
                .outerCheckBoxState,
            fundamentalCharacteristics:
              hierarchicalStateSecurity.fundamentalCharacteristics.fundamentalCharacteristics?.filter(
                (item: Characteristic) => {
                  return item.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              ),
          },

          balanceSheetCharacteristics: {
            outerCheckBoxState:
              hierarchicalStateSecurity.balanceSheetCharacteristics
                .outerCheckBoxState,
            balanceSheetCharacteristics:
              hierarchicalStateSecurity.balanceSheetCharacteristics.balanceSheetCharacteristics?.filter(
                (item: Characteristic) => {
                  return item.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              ),
          },
          cashFlowCharacteristics: {
            outerCheckBoxState:
              hierarchicalStateSecurity.cashFlowCharacteristics
                .outerCheckBoxState,
            cashFlowCharacteristics:
              hierarchicalStateSecurity.cashFlowCharacteristics.cashFlowCharacteristics?.filter(
                (item: Characteristic) => {
                  return item.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              ),
          },
        };
        setFilteredState(filteredData);
      }
    } else {
      if (!searchTerm?.trim()) {
        setFilteredState(hierarchicalState);
      } else {
        const filteredData: InitialState = {
          fundamentalCharacteristics: {
            outerCheckBoxState:
              hierarchicalStateSecurity.fundamentalCharacteristics
                .outerCheckBoxState,
            fundamentalCharacteristics:
              hierarchicalStateSecurity.fundamentalCharacteristics.fundamentalCharacteristics?.filter(
                (item: Characteristic) => {
                  return item.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              ),
          },

          balanceSheetCharacteristics: {
            outerCheckBoxState:
              hierarchicalStateSecurity.balanceSheetCharacteristics
                .outerCheckBoxState,
            balanceSheetCharacteristics:
              hierarchicalStateSecurity.balanceSheetCharacteristics.balanceSheetCharacteristics?.filter(
                (item: Characteristic) => {
                  return item.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              ),
          },
          cashFlowCharacteristics: {
            outerCheckBoxState:
              hierarchicalStateSecurity.cashFlowCharacteristics
                .outerCheckBoxState,
            cashFlowCharacteristics:
              hierarchicalStateSecurity.cashFlowCharacteristics.cashFlowCharacteristics?.filter(
                (item: Characteristic) => {
                  return item.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              ),
          },
        };
        setFilteredState(filteredData);
      }
    }
  };

  const handleSearchDebounced = debounce(handleSearch, 500);

  return (
    <ModalType
      buttons={buttons}
      type={ModalTypeEnum.SMALL}
      open={true}
      closeDialog={onClose}
      style={styles.modal}
    >
      <div style={styles.CVpaper} className="custom-view">
        <Typography style={styles.title} variant="h5" id="custom-modal-title">
          Compare Security Characteristics{" "}
        </Typography>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={styles.block}>
            <div className="list-container-security">
              <div className="maximum-text">
                You can select maximum 2 security characteristics
              </div>
              <div style={styles.searchBox}>
                <SearchBox
                  onSearch={handleSearchDebounced}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
              <div className="block-item-list-security">
                <Virtuoso
                  style={{
                    height: "56vh",
                    margin: "20px 0",
                    paddingBottom: "20px",
                  }}
                  totalCount={list?.length}
                  data={list}
                  itemContent={(index, item) => (
                    <div style={styles.innerBlock}>
                      <BlockItemSecurity
                        key={index}
                        item={item}
                        handleInteraction={handleInteraction}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalType>
  );
};

export default SecurityComparison;
