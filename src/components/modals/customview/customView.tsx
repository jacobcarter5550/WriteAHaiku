import React, { useEffect, useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";
import LeftBlock from "./leftblock.tsx";
import RightBlock from "./rightblock.tsx";
import {
    Characteristic,
    Data,
    FilterableData,
    IndividualCustomView,
    InitialState,
    ListData,
    Payload,
} from "./types.ts";
import SearchBox from "./searchBox.tsx";
import ModalType, { ModalTypeEnum } from "../../../ui-elements/modals/ModalType.tsx";
import { useTheme } from "next-themes";
import api from "../../../helpers/serviceTP.ts";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import { Option } from "../../portfolio/portfolioLib.tsx";
import { toast } from "react-toastify";
import { TextInput } from "@carbon/react";
import "../../../styles/customView.scss";
import Button from "../../../ui-elements/buttonTP.tsx";
interface Props {
    customViewData: any;
    open: boolean;
    onClose: () => void;
    individualCustomViewData?: IndividualCustomView[];
    customViewOptions: Option[];
    customViewValue: Option | undefined;
    onSelectCustomView: (option: Option, modal: boolean) => void;
}

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
        width: "47.5%",
        height: "50vh",
    },
    title: {
        color: "#161616",
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "600",
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
};

const initialState: InitialState = {};

const CustomView: React.FC<Props> = ({
    onClose,
    customViewData,
    individualCustomViewData,
    customViewValue,
    customViewOptions,
    onSelectCustomView,
}) => {
    const [data, setData] = useState<Data>(customViewData);
    const [searchTerm, setSearchTerm] = useState("");
    const [customViewLabel, setCustomViewlabel] = useState<string>("");

    const theme = useTheme();

    useEffect(() => {
        Object.keys(data).forEach((category: string) => {
            const updatedCategoryItems = (data[category] || []).map((item: any, index: number) => {
                const correspondingItem = individualCustomViewData?.find(
                    (view: any) => view.name === item
                );
                let upperBound = "";
                let lowerBound = "";
                let checkboxValue = false;

                if (correspondingItem) {
                    const { lower_bound, upper_bound } = correspondingItem;
                    upperBound = upper_bound;
                    lowerBound = lower_bound;
                    checkboxValue = true;
                }

                return {
                    id: index,
                    name: item,
                    checkboxState: checkboxValue,
                    textInputFirst: upperBound,
                    textInputSecond: lowerBound,
                    toggleInputFirst: "<=",
                    toggleInputSecond: ">=",
                    category: [category],
                };
            });

            initialState[category] = {
                outerCheckBoxState: false,
                [category]: updatedCategoryItems,
            };
        });
        setHierarchicalState((prev) => ({ ...prev, ...initialState }));
        setFilteredState((prev) => ({ ...prev, ...initialState }));
    }, [data, individualCustomViewData]);

    useEffect(() => {
        if (customViewValue?.value === "new") {
            setCustomViewlabel("");
        } else {
            setCustomViewlabel(customViewValue?.label || "");
        }
    }, [customViewValue]);

    const [hierarchicalState, setHierarchicalState] = useState<InitialState>(initialState);
    const [filteredState, setFilteredState] = useState<InitialState>(hierarchicalState);
    console.log("customViewLabel", customViewLabel);
    console.log("customViewValue", customViewValue);
    const handleInteraction = (
        category: string,
        id: number | null = null,
        value: string | boolean | null = null,
        action: string
    ) => {
        switch (action) {
            case "checkbox":
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
            case "input1":
            case "input2":
                setHierarchicalState((prevState: InitialState) => ({
                    ...prevState,
                    [category]: {
                        outerCheckBoxState: prevState[category].outerCheckBoxState,
                        [category]: prevState[category][category]?.map(
                            (characteristic: Characteristic) => {
                                if (characteristic.id === id) {
                                    return {
                                        ...characteristic,
                                        [action === "input1"
                                            ? "textInputFirst"
                                            : "textInputSecond"]: value as string,
                                    };
                                }
                                return characteristic;
                            }
                        ),
                    },
                }));
                break;
            case "toggleFirstInput":
            case "toggleSecondInput":
                setHierarchicalState((prevState: InitialState) => ({
                    ...prevState,
                    [category]: {
                        outerCheckBoxState: prevState[category].outerCheckBoxState,
                        [category]: prevState[category][category].map(
                            (characteristic: Characteristic) => {
                                if (characteristic.id === id) {
                                    return {
                                        ...characteristic,
                                        [action === "toggleFirstInput"
                                            ? "toggleInputFirst"
                                            : "toggleInputSecond"]:
                                            action === "toggleFirstInput"
                                                ? characteristic.toggleInputFirst === "<="
                                                    ? "<"
                                                    : "<="
                                                : characteristic.toggleInputSecond === ">="
                                                ? ">"
                                                : ">=",
                                    };
                                }
                                return characteristic;
                            }
                        ),
                    },
                }));
                break;
            case "outerCheckbox":
                setHierarchicalState((prevState: InitialState) => ({
                    ...prevState,
                    [category]: {
                        ...prevState[category],
                        outerCheckBoxState: value as boolean,
                    },
                }));
                break;

            default:
                break;
        }
    };

    function transformStateToCustomView(
        state: any
    ): { name: string; lower_bound: string; upper_bound: string }[] {
        const customViewCharacteristics: {
            name: string;
            lower_bound: string;
            upper_bound: string;
        }[] = [];

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
                        customViewCharacteristics.push({
                            name: char.name,
                            lower_bound: char.textInputFirst || "",
                            upper_bound: char.textInputSecond || "",
                        });
                    }
                });
            }
        });

        return customViewCharacteristics;
    }

    const handleSaveCustomView = () => {
        const payloadArray = transformStateToCustomView(hierarchicalState);
        if (!customViewLabel) {
            toast.error("Please enter a valid name", {
                autoClose: 2000,
            });
            const labelTextElement = document.getElementById("text-input-1");
            labelTextElement?.focus();
            return;
        }
        const payload: Payload = {
            customViewCharacteristics: payloadArray,
            productTypeId: 1,
            preferenceName: customViewLabel,
        };

        try {
            if (customViewValue?.value) {
                payload.preferenceId = Number(customViewValue?.value);
                api.put("/customview", payload)
                    .then((response) => {
                        toast.success("Custom view created successfully");
                        onClose();
                    })
                    .catch((error) => {
                        console.error("Error occurred while updating custom view:", error);
                    });
            } else {
                api.put("/customview", payload)
                    .then((response) => {
                        toast.success("Custom view updated successfully");
                        onClose();
                    })
                    .catch((error) => {
                        console.error("Error occurred while creating custom view:", error);
                    });
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleSelectAll = () => {
        const updatedState = { ...hierarchicalState };
        let isAllSelected = true;

        for (const category in filteredState) {
            if (category === "message") continue;
            if (!filteredState[category].outerCheckBoxState) {
                isAllSelected = false;
                break;
            }
        }

        for (const category in filteredState) {
            if (category === "message") continue;
            updatedState[category].outerCheckBoxState = !isAllSelected;
            const categoryData = filteredState[category][category];
            if (Array.isArray(categoryData)) {
                for (const item of categoryData) {
                    item.checkboxState = !isAllSelected;
                }
            }
        }

        setHierarchicalState(updatedState);
        handleSearch(searchTerm);
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
    const handleSearch = (searchTerm: string) => {
        if (!searchTerm?.trim()) {
            setFilteredState(hierarchicalState);
        } else {
            const filteredData: InitialState = {
                fundamentalCharacteristics: {
                    outerCheckBoxState:
                        hierarchicalState.fundamentalCharacteristics.outerCheckBoxState,
                    fundamentalCharacteristics:
                        hierarchicalState.fundamentalCharacteristics.fundamentalCharacteristics?.filter(
                            (item: Characteristic) => {
                                return item.name.toLowerCase().includes(searchTerm.toLowerCase());
                            }
                        ),
                },
                // riskModelCharacteristics: {
                //   outerCheckBoxState:
                //     hierarchicalState.riskModelCharacteristics.outerCheckBoxState,
                //   riskModelCharacteristics:
                //     hierarchicalState.riskModelCharacteristics.riskModelCharacteristics?.filter(
                //       (item: Characteristic) => {
                //         return item.name
                //           .toLowerCase()
                //           .includes(searchTerm.toLowerCase());
                //       }
                //     ),
                // },
                balanceSheetCharacteristics: {
                    outerCheckBoxState:
                        hierarchicalState.balanceSheetCharacteristics.outerCheckBoxState,
                    balanceSheetCharacteristics:
                        hierarchicalState.balanceSheetCharacteristics.balanceSheetCharacteristics?.filter(
                            (item: Characteristic) => {
                                return item.name.toLowerCase().includes(searchTerm.toLowerCase());
                            }
                        ),
                },
                cashFlowCharacteristics: {
                    outerCheckBoxState:
                        hierarchicalState.cashFlowCharacteristics.outerCheckBoxState,
                    cashFlowCharacteristics:
                        hierarchicalState.cashFlowCharacteristics.cashFlowCharacteristics?.filter(
                            (item: Characteristic) => {
                                return item.name.toLowerCase().includes(searchTerm.toLowerCase());
                            }
                        ),
                },
            };
            setFilteredState(filteredData);
        }
    };

    const handleSearchDebounced = debounce(handleSearch, 500);

    useEffect(() => {
        setFilteredState(hierarchicalState);
        if (searchTerm) {
            handleSearch(searchTerm);
        }
    }, [hierarchicalState]);

    const buttons = (
        <Stack spacing={2} direction="row" justifyContent="end" sx={{ width: "95%" }}>
            <Button
                label="Cancel"
                className={
                    theme.theme == "light"
                        ? "pop-btnNeg buttonMarginHelper"
                        : "pop-btnNeg-dark-mode buttonMarginHelper"
                }
                onClick={onClose}
            />
            <Button
                onClick={handleSaveCustomView}
                label={"Save"}
                className={"pop-btn buttonMarginHelper"}
            />
        </Stack>
    );

    return (
        <ModalType
            buttons={buttons}
            type={ModalTypeEnum.MEDIUM}
            open={true}
            closeDialog={onClose}
            style={styles.modal}
        >
            <div style={styles.CVpaper} className="custom-view">
                <Typography style={styles.title} variant="h5" id="custom-modal-title">
                    Custom View
                </Typography>

                <div className="customViewLabel">
                    <TextInput
                        id="text-input-1"
                        type="text"
                        labelText=""
                        placeholder="Enter Custom View Name"
                        value={customViewLabel}
                        onChange={(e) => setCustomViewlabel(e.target.value)}
                        required={true}
                    />
                    <CustomSelect
                        value={customViewValue}
                        defaultValue={{ label: "Custom View" }}
                        options={customViewOptions}
                        onChange={(selectedOption: Option) => {
                            onSelectCustomView(selectedOption, true);
                        }}
                        placeholder="Select custom view"
                        customWidth="100%"
                        customHeight="3.1rem"
                        customIndicatorHeight="3rem"
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={styles.block}>
                        <Typography
                            style={{
                                ...styles.CVsectionTitle,
                                backgroundColor: theme.theme == "light" ? "#D9D9D9" : "#0d0d0d",
                            }}
                            variant="h6"
                        >
                            Display Security Characteristics
                        </Typography>
                        <SearchBox
                            onSearch={handleSearchDebounced}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />

                        <LeftBlock
                            handleSelectAll={handleSelectAll}
                            handleInteraction={handleInteraction}
                            listData={filteredState}
                        />
                    </div>
                    <div style={styles.block}>
                        <Typography
                            style={{
                                ...styles.CVsectionTitle,
                                backgroundColor: theme.theme == "light" ? "#D9D9D9" : "#0d0d0d",
                            }}
                            variant="h6"
                        >
                            Display Group of Security Characteristics
                        </Typography>
                        <SearchBox
                            onSearch={handleSearchDebounced}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />

                        <RightBlock
                            handleSelectAll={handleSelectAll}
                            listData={filteredState}
                            handleInteraction={handleInteraction}
                        />
                    </div>
                </div>
            </div>
        </ModalType>
    );
};

export default CustomView;
