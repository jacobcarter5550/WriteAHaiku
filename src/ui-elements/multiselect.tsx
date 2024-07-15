import React, { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import { Check } from "@mui/icons-material";
import { useAppSelector } from "../store/index.ts";
import { getAccountId, portfolioSelectors } from "../store/portfolio/selector.ts";
import { useTheme } from "next-themes";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { useDispatch } from "react-redux";
import { setSelectedAccountList } from "../store/portfolio/index.ts";

interface SelectOption {
    label: string;
}

interface SelectGroup {
    label: string;
    options: SelectOption[];
}

interface MultipleSelectCheckMarksProps {
    changeFunction: (data: any) => void;
    accountCreation?: string;
    newAccountHandler: (name: string) => void;
}

const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            maxWidth: "13vw",
            minWidth: "13vw",
        },
    },
};
const MenuPropsNoData = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 167,
        },
    },
};

// Create a theme with overrides for the Checkbox component
const MultipleSelectCheckMarks: React.FC<MultipleSelectCheckMarksProps> = ({
    changeFunction,
    accountCreation,
    newAccountHandler,
}) => {
    const dispatch = useDispatch();
    const group = useAppSelector(portfolioSelectors);
    console.log("group-->", group);

    const updatedGroup = group?.slice(2);
    const listedAccounts = useAppSelector(getAccountId);
    const theme = useTheme();
    const preListedAccounts =
        listedAccounts &&
        structuredClone(listedAccounts)
            .map((item) => {
                if (item?.label) {
                    return item.label;
                } else {
                    return undefined;
                }
            })
            .filter((item) => item !== undefined);
    const def =
        updatedGroup && listedAccounts && listedAccounts.length > 0
            ? (preListedAccounts as string[])
            : ["Select"];
    const [selectedItems, setSelectedItems] = useState<string[]>(def);

    const handleChange = (option: string) => {
        if (selectedItems.includes("Select")) {
            setSelectedItems([option]);
        } else if (selectedItems.includes(option)) {
            setSelectedItems((selecs) => {
                const deselected = selecs.filter((item) => item !== option);
                if (deselected.length == 0) {
                    return ["Select"];
                } else {
                    return deselected;
                }
            });
        } else {
            setSelectedItems([option, ...selectedItems]);
        }
    };

    const preSelections = listedAccounts ? listedAccounts : [];
    const [selectionTracker, setSelectionTracker] = useState<any>(preSelections);
    // Define a custom icon with inline styles
    const CustomDropDownIcon = (props) => (
        <ExpandMoreOutlinedIcon
            {...props}
            style={{
                fontSize: 22,
                color: theme.theme == "dark" ? "#f4f4f4" : "#cfd0d1",
            }}
        />
    );

    useEffect(() => {
        dispatch(setSelectedAccountList(selectedItems));
    }, [selectedItems]);
    console.log("selectedItems--->", `selectedItems`);
    return (
        <div className="multiselect-container">
            <Select
                IconComponent={CustomDropDownIcon} // Use the custom icon
                labelId="multiple-select-checkmarks-label"
                id="multiple-select-checkmarks"
                multiple
                placeholder="Select"
                value={selectedItems}
                style={{
                    height: "2.75rem",
                    marginTop: 0,
                    backgroundColor: theme.theme == "light" ? "#fff" : "#0D0D0D",
                    border: "1px solid #D9D9D9",
                    borderWidth: "0px",
                    borderRadius: 0,
                    fontSize: "13px",
                    maxWidth: "13vw",
                    minWidth: "13vw",
                    // position: "unset",
                }}
                input={<OutlinedInput label="Select" />}
                renderValue={(selected) => (
                    <Tooltip
                        title={(selected as string[]).map((name) => (
                            <div key={name}>
                                <div>{name}</div>
                            </div>
                        ))}
                        arrow
                    >
                        <span>
                            {(selected as string[])
                                .map((item, index) => (index > 0 ? `, ${item}` : item))
                                .join("")}
                        </span>
                    </Tooltip>
                )}
                MenuProps={MenuProps}
            >
                {accountCreation && (
                    <span
                        className={
                            theme.theme == "dark"
                                ? "select-header-container-dark-mode"
                                : "select-header-container"
                        }
                        onClick={() => newAccountHandler("Value")}
                    >
                        {accountCreation}
                    </span>
                )}
                {updatedGroup.map((item, index) => {
                    const isRow = item.options && item.options[0] !== "";
                    return (
                        <div key={index}>
                            <span
                                style={{
                                    fontSize: "1.04rem",
                                    padding: "10px 0px 10px 15px",
                                    display: "block",
                                    textTransform: "uppercase",
                                    paddingLeft: isRow ? "22px" : "15px",
                                    fontWeight: "800",
                                    lineHeight: "1.4rem",
                                }}
                            >
                                {item.label}
                            </span>
                            {item.options &&
                                typeof item.options !== "string" &&
                                item.options.length > 0 &&
                                typeof item.options[0] !== "string" &&
                                item.options.map((option, idx) => (
                                    <>
                                        <MenuItem
                                            style={{ height: "40px" }}
                                            key={idx}
                                            value={option.label}
                                        >
                                            <span
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    width: "100%",
                                                    alignItems: "center",
                                                }}
                                                onClick={() => {
                                                    console.log(option);
                                                    handleChange(option.label);
                                                    setSelectionTracker((trackers) => {
                                                        console.log(trackers);
                                                        if (
                                                            trackers.find(
                                                                (tracker) =>
                                                                    tracker.value ===
                                                                        option.value &&
                                                                    tracker.label === option.label
                                                            )
                                                        ) {
                                                            trackers = trackers.filter(
                                                                (item) =>
                                                                    item.label !== option.label
                                                            );
                                                            console.log(trackers);
                                                            changeFunction(trackers);
                                                            return trackers;
                                                        } else {
                                                            trackers = [...trackers, option];
                                                            console.log(trackers);
                                                            changeFunction(trackers);
                                                            return trackers;
                                                        }
                                                    });
                                                }}
                                            >
                                                <ListItemText
                                                    style={{
                                                        fontSize: "10px",
                                                        padding: "13px",
                                                        paddingLeft: "10px",
                                                    }}
                                                    className="muiListHelper"
                                                    primary={option.label}
                                                />
                                                {selectedItems.indexOf(option.label) > -1 ? (
                                                    <Check
                                                        style={{
                                                            color:
                                                                theme.theme == "light"
                                                                    ? "black"
                                                                    : "#f4f4f4",
                                                        }}
                                                    />
                                                ) : null}
                                            </span>
                                        </MenuItem>
                                    </>
                                ))}
                        </div>
                    );
                })}
            </Select>
        </div>
    );
};

export default MultipleSelectCheckMarks;
