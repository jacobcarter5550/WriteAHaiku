import React, { useState } from "react";
import ModalType, { ModalTypeEnum } from "../../../ui-elements/modals/ModalType.tsx";
import {
    Button,
    Checkbox,
    DatePicker,
    DatePickerInput,
    RadioButton,
    RadioButtonGroup,
    Search,
    Select,
    SelectItem,
    Tab,
    TabList,
    Tabs,
    TextInput,
    Toggle,
} from "@carbon/react";
import { Add } from "@carbon/icons-react";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import { useTheme } from "next-themes";
import { Theme } from "@carbon/react";
import { GroupBase, StylesConfig } from "react-select";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
interface Props {
    flag: any;
    updateFlag: () => void;
}

export enum ChartRangeViewENUM {
    OneD = "1D",
    FiveD = "5D",
    OneM = "1M",
    ThreeM = "3M",
    SixM = "6M",
    YTD = "YTD",
    OneY = "1Y",
    ThreeY = "3Y",
    FiveY = "5Y",
    TenY = "10Y",
    Max = "Max",
}

const items = [
    { value: "option-1", label: "Option 1" },
    { value: "option-2", label: "Option 2" },
    { value: "option-3", label: "Option 3" },
];

const styles: { [key: string]: React.CSSProperties } = {
    modal: {
        display: "flex",
        alignItems: "center",
        padding: "40px",
        zIndex: 1000,
        justifyContent: "center",
        height: "80%",
        backgroundColor: "#F4F4F4",
    },
    heading: {
        paddingBottom: "30px",
    },
};

const CustomizeWidget: React.FC<Props> = ({ flag, updateFlag }) => {
    const theme = useTheme();
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(1);
    const [selectedTabView, setSelectedTabView] = useState<ChartRangeViewENUM>();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const ChartRangeTabData = [
        ChartRangeViewENUM.OneD,
        ChartRangeViewENUM.FiveD,
        ChartRangeViewENUM.OneM,
        ChartRangeViewENUM.ThreeM,
        ChartRangeViewENUM.SixM,
        ChartRangeViewENUM.YTD,
        ChartRangeViewENUM.OneY,
        ChartRangeViewENUM.ThreeY,
        ChartRangeViewENUM.FiveY,
        ChartRangeViewENUM.TenY,
        ChartRangeViewENUM.Max,
    ];

    const handleDateChange = (dates: (Date | null)[]) => {
        setStartDate(dates[0]);
        setEndDate(dates[1]);
    };
    const handleTabChange = (index: number): void => {
        console.log(`Tab changed to index: ${index}`);
        setCurrentTabIndex(index + 1);
        setSelectedTabView(ChartRangeTabData[index]);
    };

    const getCustomStyle = (dropdown: string): StylesConfig<any, any, GroupBase<any>> => {
        return {
            control: (provided, state) => ({
                ...provided,
                minWidth: "5vw",
                maxWidth: "30rem",
                width:
                    dropdown == "Chart Options"
                        ? "23rem"
                        : dropdown == "Date Range"
                        ? "11rem"
                        : "17rem", // Set your desired width here
                borderRadius: "0",
                fontSize: "1.2rem",
                minHeight: "2.75rem",
                border: theme.theme == "light" ? "1px solid #8d8d8d" : "1px solid #383a3e",
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
                height: "2.75rem",
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
                    backgroundColor:
                        theme.theme == "dark"
                            ? state.isFocused
                                ? "#393939"
                                : "#181818"
                            : state.isFocused
                            ? "#e9eaea"
                            : "#f4f4f4", // Change the hover color here
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
                maxHeight: "60vh", // Set the maximum height for the dropdown menu
                overflowY: "auto", // Enable scrolling within the dropdown
            }),
            indicatorsContainer: (provided, state) => ({
                ...provided,
                height: "2.75rem",
            }),
        };
    };
    const handleToggle = (toggled: boolean) => {
        console.log("Toggle is now", toggled ? "On" : "Off");
    };

    return (
        <ModalType
            type={ModalTypeEnum.LARGE}
            open={flag}
            style={styles.modal}
            closeDialog={updateFlag}
            buttons={[]}
        >
            <div className="container-block">
                <div className="header-container">
                    <div className="left-section">
                        <h4>New Fundamental Chart</h4>
                        <span>(unsaved)</span>
                        <ImageComponent
                            src="caret--sort--down.svg"
                            alt="caret-icon"
                            style={{ transform: theme.theme == "light" ? "rotate(180deg)" : "" }}
                        />
                    </div>
                    <div className="right-section">
                        <div className="sub-section">
                            <ImageComponent
                                src="export.svg"
                                alt="export-icon"
                                style={{ width: "1.4rem" }}
                            />
                            <h4>Export</h4>
                            <ImageComponent
                                src="caret--sort--down.svg"
                                alt="caret-icon"
                                style={{
                                    transform: theme.theme == "light" ? "rotate(180deg)" : "",
                                }}
                            />
                        </div>
                        <div className="sub-section">
                            <ImageComponent
                                src="share.svg"
                                alt="share-icon"
                                style={{ width: "1.4rem" }}
                            />
                            <h4>Share</h4>
                            <ImageComponent
                                src="caret--sort--down.svg"
                                alt="caret-icon"
                                style={{
                                    transform: theme.theme == "light" ? "rotate(180deg)" : "",
                                }}
                            />
                        </div>
                        <div className="sub-section">
                            <ImageComponent
                                src="restart.svg"
                                alt="restart-icon"
                                style={{ width: "1.4rem" }}
                            />
                            <h4>Reset</h4>
                        </div>
                    </div>
                </div>
                <div className="main-container">
                    <section className="input-container">
                        <div className="input-text">
                            <h4>Input</h4>
                        </div>
                        <div className="securities">
                            <div className="securities-text">
                                <span className="filterHeaderStyle">Securities</span>

                                <ImageComponent
                                    src="infoIcon.svg"
                                    alt="infoIcon-icon"
                                    style={{ width: "1.7rem" }}
                                />
                            </div>
                            <div className="securities-input-container">
                                <Search
                                    size="lg"
                                    placeholder="Search"
                                    labelText="Search"
                                    closeButtonLabelText="Clear search input"
                                    id="search-1"
                                    onChange={() => {}}
                                    onKeyDown={() => {}}
                                />
                                <Button className="add-button">Add</Button>
                            </div>
                        </div>
                        <div className="financial-matrix">
                            <span className="filterHeaderStyle">Financial Matrix</span>
                            <div className="matrix-container">
                                <div className="matrix-input-container">
                                    <Search
                                        size="lg"
                                        placeholder="Search"
                                        labelText="Search"
                                        closeButtonLabelText="Clear search input"
                                        id="search-1"
                                        onChange={() => {}}
                                        onKeyDown={() => {}}
                                    />
                                    <Button className="add-button">Add</Button>
                                </div>
                                <div className="divisor"></div>
                                <Button className="browse-button" kind="tertiary">
                                    Browse
                                </Button>
                            </div>
                        </div>
                        <div className="lists">
                            <div className="list-text">
                                <span className="filterHeaderStyle">Lists</span>
                                <ImageComponent
                                    src="infoIcon.svg"
                                    alt="infoIcon-icon"
                                    style={{ width: "1.7rem" }}
                                />
                            </div>
                            <ImageComponent
                                src="table-of-contents.svg"
                                alt="table-of-contents-icon"
                                style={{
                                    width: "2.3rem",
                                    border: "1px solid #383c93",
                                    padding: ".2rem",
                                }}
                            />
                        </div>
                        <div className="data-format">
                            <div className="data-format-text">
                                <span className="filterHeaderStyle">Data Format</span>
                                <ImageComponent
                                    src="infoIcon.svg"
                                    alt="infoIcon-icon"
                                    style={{ width: "1.7rem" }}
                                />
                            </div>
                            <RadioButtonGroup
                                name="radio-button-default-group"
                                orientation="vertical"
                            >
                                <RadioButton
                                    labelText="Original (Unchanged)"
                                    value="radio-1"
                                    id="radio-1"
                                />
                                <RadioButton
                                    labelText="Normalized (% Change)"
                                    value="radio-2"
                                    id="radio-2"
                                />
                                <RadioButton
                                    labelText="Growth (Custom)"
                                    value="radio-3"
                                    id="radio-3"
                                />
                                <RadioButton
                                    labelText="Percent Off High"
                                    value="radio-4"
                                    id="radio-4"
                                />
                            </RadioButtonGroup>
                        </div>
                        <div className="panel-layout">
                            <span className="filterHeaderStyle">Panel Layout</span>
                            <RadioButtonGroup
                                name="radio-button-default-group1"
                                orientation="vertical"
                            >
                                <RadioButton
                                    labelText="Single Panel"
                                    value="radio-11"
                                    id="radio-11"
                                />
                                <RadioButton
                                    labelText="Panel per financial metric"
                                    value="radio-21"
                                    id="radio-21"
                                />
                                <RadioButton
                                    labelText="Panel Per security"
                                    value="radio-31"
                                    id="radio-31"
                                />
                            </RadioButtonGroup>
                        </div>
                        <div className="ratios">
                            <span className="filterHeaderStyle">Ratios/Spreads/ Correlations</span>
                            <Button hasIconOnly renderIcon={Add} iconDescription="Add" />
                        </div>
                    </section>
                    <section className="chart-container">
                        <div className="chart-header">
                            <CustomSelect
                                customWidth="23rem"
                                placeholder="Chart Options"
                                options={items}
                                styles={getCustomStyle("Chart Options")}
                            />
                            <div className="toggle-container">
                                <span>Presentation View</span>
                                <Toggle
                                    id="custom-toggle"
                                    labelText=""
                                    labelA="Off"
                                    labelB="On"
                                    hideLabel
                                    defaultToggled={false}
                                    onToggle={handleToggle}
                                />
                            </div>
                        </div>
                        <div className="chart-main-container">
                            <div className="chart-sub-header">
                                <div className="tab-date-container">
                                    <div className="tab-container">
                                        <Tabs
                                            selectedIndex={currentTabIndex - 1}
                                            onChange={(tabInfo) =>
                                                handleTabChange(tabInfo.selectedIndex)
                                            }
                                        >
                                            <TabList aria-label="Financial Data Tabs">
                                                {ChartRangeTabData.map((tab, index) => (
                                                    <Tab
                                                        style={{
                                                            margin: "0 0.2rem",
                                                            padding: "10px",
                                                        }}
                                                        key={index}
                                                    >
                                                        {tab}
                                                    </Tab>
                                                ))}
                                            </TabList>
                                        </Tabs>
                                    </div>
                                    <div className="date-container">
                                        <CustomSelect
                                            customWidth="11rem"
                                            placeholder="Date Range"
                                            options={items}
                                            styles={getCustomStyle("Date Range")}
                                        />
                                        <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                                            <DatePicker
                                                datePickerType="range"
                                                value={[startDate, endDate]}
                                                onChange={handleDateChange}
                                            >
                                                <DatePickerInput
                                                    id="start-date"
                                                    placeholder="mm/dd/yyyy"
                                                    labelText=""
                                                />
                                                <DatePickerInput
                                                    id="end-date"
                                                    placeholder="mm/dd/yyyy"
                                                    labelText=""
                                                />
                                            </DatePicker>{" "}
                                        </Theme>
                                    </div>
                                </div>
                                <div className="icon-container">
                                    <ImageComponent
                                        src="fit-to-screen.svg"
                                        alt="fit-to-screen-icon"
                                        style={{
                                            width: "2.8rem",
                                            border: "1px solid #383c93",
                                            padding: ".2rem",
                                        }}
                                    />
                                    <ImageComponent
                                        src="view--off--filled.svg"
                                        alt="view--off--filled-icon"
                                        style={{
                                            width: "2.8rem",
                                            border: "1px solid #383c93",
                                            padding: ".2rem",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="chart-body-container"></div>
                        </div>
                    </section>
                </div>
            </div>
        </ModalType>
    );
};

export default CustomizeWidget;
