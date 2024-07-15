import React, { useState } from "react";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import { SelectOption } from "../../nav/Nav.tsx";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import DynamicPortfolioFilter from "../../modals/dynamicPortfolioFilter/FilterModal.tsx";
import api from "../../../helpers/serviceTP.ts";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/index.ts";
import { getActiveDynamicPortfolioFilterId } from "../../../store/nonPerstistant/selectors.ts";
import { useDispatch } from "react-redux";
import { setActiveDynamicPortfolioFilterId } from "../../../store/nonPerstistant/index.ts";
import {
    IDynamicPortfolioItem,
    addDynamicPortfolioFilterList,
    setPortfolioSelectors,
    updateAccountId,
} from "../../../store/portfolio/index.ts";
import { getDynamicPortfolioList } from "../../../store/portfolio/selector.ts";
import { PortfolioCollection } from "../../modals/portfolioConstruction/types.ts";
import { createStrategyTree, remapData } from "../../modals/lib.ts";
import { Dispatch } from "redux";
import Select, { SingleValueProps, OptionProps, components } from "react-select";
import { useTheme } from "next-themes";

type Props = {};

interface Type {
    type: string;
    id: number;
}

interface OptionType {
    value: string;
    label: JSX.Element | string;
}

export interface Item {
    item: any; // Update this with the correct type of 'item'
    label: string;
    value?: string;
    options?: Item[] | string;
}

export interface ISingleFilterValue {
    filterId: number;
    userId: number;
    isActive: boolean;
    createdAt: string;
    name: string;
    cashLevelLower: number | null;
    cashLevelUpper: number | null;
    expectedAlphaLower: number | null;
    expectedAlphaUpper: number | null;
    expectedTeLower: number | null;
    expectedTeUpper: number | null;
    expectedVolLower: number | null;
    expectedVolUpper: number | null;
}

const DynamicPortfolioFilterComp = (props: Props) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [dynamicPortfolioModal, setDynamicPortfolioModal] = useState(false);
    const [dynamicPortfolioFilterList, setDynamicPortfolioFilterList] = useState<SelectOption[]>(
        []
    );
    const [singleFilterValue, setSingleFilterValue] = useState<ISingleFilterValue | {}>({});
    const [filterValue, setFilterValue] = useState<OptionType | null>(null);
    const [isFilterEditable, setIsFilterEditable] = useState<boolean>(false);
    const [activeFilterId, setActiveFilterId] = useState<number | null>(null);
    const activeDynamicPortfolioFilterId = useAppSelector(getActiveDynamicPortfolioFilterId);
    const dynamicPortfolioFilterListAPI = useAppSelector(getDynamicPortfolioList);

    const customStylesPortfolio = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: "0",
            fontSize: "1.2rem",
            minHeight: "2.55rem",
            minWidth : '14rem',
            // border: theme.theme == "light" ? "1px solid #8d8d8d" : "1px solid #383a3e",
            borderWidth: "0px",
            cursor: "pointer",
            backgroundColor: theme.theme == "light" ? "#fff" : "#0D0D0D",
            position: "unset",
        }),
        container: (provided, state) => ({
            ...provided,
            position: "unset",
        }),
        singleValue: (provided, state) => ({
            ...provided,
            overflow: "visible",
            color: theme.theme == "dark" ? "#fff" : "#181818",
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: "2.2rem",
            padding: "0 6px",
            display: "flex",
            flexWrap: "nowrap", // Enable flex-wrap for all selected options
        }),
        multiValue: (provided) => ({
            ...provided,
        }),
        groupHeading: (provided) => ({
            ...provided,
            fontSize: "1.6rem", // Set the desired font size for group heading
            colot: "#002D9C",
            fontWeight: "bold", // You can customize other styles as well
        }),
        menu: (provided, state) => ({
            ...provided,
            borderRadius: 0, // Set border radius to 0 for the menu block
            marginTop: "0",
        }),
        input: (provided, state) => ({
            ...provided,
            margin: "0px",
        }),
        option: (provided, state) => {
          const isFirstItem = state.selectProps.options[0].value === state.data.value;
            return {
                ...provided,
                fontSize: "1.2rem",
                borderRadius: "0px",
                paddingLeft: "2rem",
                marginTop: "0px",
                color:
                    theme.theme == "dark"
                        ? state.isFocused
                            ? "#f4f4f4"
                            : "#fff"
                        : state.isFocused
                        ? "#181818"
                        : "#181818",
                cursor: "pointer",
                // backgroundColor:"black",
                backgroundColor:
                    theme.theme == "dark"
                        ? state.isFocused
                            ? "#393939"
                            : "#181818"
                        : state.isFocused
                        ? "#e9eaea"
                        : "#fff", // Change the hover color here
                borderBottom: isFirstItem ? "1px solid #e0e0e0" : "none", 
            };
        },
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
            flexWrap: "nowrap",
            fontSize: "11px",
            borderRadius: "0px",
        }),
        menuList: (base, state) => ({
            backgroundColor: theme.theme == "light" ? "#fff" : "#181818",
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: "2.2rem",
        }),
    };
    // Custom Option component
    const CustomOption = (props: any) => {
        const { data, innerRef, innerProps } = props;
        console.log("CustomOption", data);

        if (data.value === "initial") {
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
                    <span>{props.data.value}</span>
                    <div style={{ display: "flex", gap: ".5rem" }}>
                        <ImageComponent
                            src="settings--edit.svg"
                            alt="settings--edit-icon"
                            style={{ width: "1.3em" }}
                            onClick={(e) => {
                                editFilterHandler(e, data.filterId);
                                setFilterValue({ value: props.data.value, label: <div></div> });
                                setIsFilterEditable(true);
                            }}
                        />
                        <ImageComponent
                            src="trash-can.svg"
                            alt="trash-can-icon"
                            style={{ width: "1em" }}
                            onClick={(e) => deleteFilterHandler(e, data.filterId)}
                        />
                    </div>
                </div>
            </components.Option>
        );
    };

    // Custom SingleValue component
    const CustomSingleValue = (props: any) => {
        return (
            <components.SingleValue {...props}>
                <span>{props.data.value === "initial" ? "Add New" : props.data.value}</span>
            </components.SingleValue>
        );
    };

    const transformData = (data: any): SelectOption[] => {
        const createFilterOption = {
            value: "initial",
            filterId: 0, // This is just a placeholder;
        };

        const modifiedData = data?.map((item) => ({
            value: item.name,
            filterId: item.filterId,
        }));

        return [createFilterOption, ...modifiedData];
    };

    const getAllDynamicFilters = async () => {
        const modifiedFilterList: SelectOption[] = transformData(dynamicPortfolioFilterListAPI);
        const finalFilterList: SelectOption[] = modifiedFilterList;
        setDynamicPortfolioFilterList(finalFilterList);
    };

    const fetchDynamicPortfolioApi = async () => {
        try {
            const response = await api.get(
                `${process.env.REACT_APP_HOST_IP_ADDRESS}/dynamic-filter`
            );
            const result: IDynamicPortfolioItem[] = await response;
            dispatch(addDynamicPortfolioFilterList(result));
        } catch (err) {
            console.log("Get All Dynamic Filter API Error", err.message);
        }
    };

    const apiCallToDeleteFilter = async (id: number) => {
        try {
            const response = await api.delete(
                `${process.env.REACT_APP_HOST_IP_ADDRESS}/dynamic-filter/${id}`
            );
            const result = await response;
            console.log("DeleteResponse", result);
            toast("Successfully Filter Deleted");
            fetchDynamicPortfolioApi();
        } catch (err) {
            console.log("Delete Filter API Error", err.message);
            toast("Error while deleting filter");
        }
    };

    const apiCallToGetSingleFilter = async (id: number) => {
        try {
            const response = await api.get(
                `${process.env.REACT_APP_HOST_IP_ADDRESS}/dynamic-filter/${id}`
            );
            const result = await response;
            setSingleFilterValue(result);
            setDynamicPortfolioModal(true);
        } catch (err) {
            toast("Error while GetSingle filter");
        }
    };

    const editFilterHandler = (e: any, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        apiCallToGetSingleFilter(id);
    };

    const deleteFilterHandler = (e: any, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        apiCallToDeleteFilter(id);
    };

    function updateValuesWithIds(originalData, idData) {
        // Create a mapping from names to account IDs for easier lookup
        const nameToIdMap = idData.reduce((map, item) => {
            map[item.accountFullName] = item.accountId;
            return map;
        }, {});

        // Iterate through each item in the original data
        originalData.forEach((group) => {
            if (group.options && group.options.length) {
                group.options.forEach((option) => {
                    // Check if the option has a label that matches an entry in the ID data
                    if (option.label && nameToIdMap.hasOwnProperty(option.label)) {
                        // Update the value with the corresponding account ID
                        option.value = nameToIdMap[option.label];
                    }
                });
            }
        });

        return originalData;
    }

    const fetchPortfolioSelectors = (id: number) => {
        if (id) {
            api.get<PortfolioCollection>(`/portfolio/all?filter=${id}`)
                .then(async (res) => {
                    try {
                        const stratgyTypes = await api.get("/optstrategytype/all");
                        let resultArray = remapData(res.data).map((item) => ({
                            label: item.name,
                            options: item.portfolios.map((portfolio) => ({
                                value: portfolio.id,
                                label: portfolio.name,
                            })),
                        }));

                        const types: Type[] = stratgyTypes.data.map((item, index) => ({
                            type: item,
                            id: index,
                        }));

                        const strats = createStrategyTree(
                            res.data.strategyHierarchyViews,
                            types,
                            res.data.accountDetailViews
                        );

                        const correlatedIds = updateValuesWithIds(
                            structuredClone(strats),
                            structuredClone(res.data.accountDetailViews)
                        );

                        resultArray.concat(strats);
                        const newArr: Item[] = [
                            { label: "Region", options: [""] },
                            ...resultArray,
                            { label: "Strategy", options: [""] },
                            ...correlatedIds,
                        ];

                        dispatch(setPortfolioSelectors(newArr));
                    } catch (error) {
                        console.log("toasted");
                    }
                })
                .catch((error) => {
                    // Handle errors that occur during the API request or in the Promise chain.
                    console.error("Failed to fetch portfolio selectors:", error);
                    // Optionally dispatch an error action or update state to show an error message.
                });
        }
    };

    React.useEffect(() => {
        fetchDynamicPortfolioApi();
    }, []);

    React.useEffect(() => {
        getAllDynamicFilters();
    }, [dynamicPortfolioFilterListAPI]);

    React.useEffect(() => {
        if (!dynamicPortfolioModal) {
            setFilterValue(null);
            setIsFilterEditable(false);
            setActiveFilterId(null);
        }
    }, [dynamicPortfolioModal]);

    React.useEffect(() => {
        if (activeFilterId && isFilterEditable === false) {
            fetchPortfolioSelectors(activeFilterId);
            // dispatch(setActiveDynamicPortfolioFilterId(activeFilterId));
        }
    }, [activeFilterId, isFilterEditable]);

    console.log("isFilterEditablsse-->", isFilterEditable);
    console.log("activeFilterId-->", activeFilterId);

    return (
        <>
            <CustomSelect
                customWidth={
                    window.innerWidth > 1282 ? "12vw" : window.innerWidth > 1250 ? "13vw" : "10.5vw"
                }
                options={dynamicPortfolioFilterList}
                onChange={(e, val) => {
                    setFilterValue({ value: e.value, label: <div></div> });
                    if (e.value === "initial") {
                        setIsFilterEditable(false);
                        setDynamicPortfolioModal(true);
                    } else {
                        setActiveFilterId(e.filterId);
                    }
                }}
                placeholder="Dynamic Portfolio Filter"
                placeholderColor="#000"
                onMenuOpenHandler={() => getAllDynamicFilters()}
                customHeight="2.55rem"
    
                isSearchable={false}
                value={filterValue}
                customComponents={{
                    IndicatorSeparator: () => null,
                    Option: CustomOption,
                    SingleValue: CustomSingleValue,
                }}
                styles={customStylesPortfolio}
            />
            {dynamicPortfolioModal && (
                <DynamicPortfolioFilter
                    closeDialog={() => {
                        setDynamicPortfolioModal(false);
                    }}
                    setDynamicPortfolioModal={setDynamicPortfolioModal}
                    singleFilterValue={singleFilterValue}
                    isFilterEditable={isFilterEditable}
                    activeFilterId={activeFilterId}
                    fetchDynamicPortfolioApi={fetchDynamicPortfolioApi}
                />
            )}
        </>
    );
};

export default DynamicPortfolioFilterComp;
