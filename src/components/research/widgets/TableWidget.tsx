import React, { useState, useRef, useEffect } from "react";
import BaseWidget from "./BaseWidget.tsx";
import Table from "./table.tsx";
import { useTheme } from "next-themes";
import { DatePicker, Theme } from "@carbon/react";
import { DatePickerInput } from "@carbon/react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import { getChart } from "./lib.tsx";


type TableWidgetProps =  {
    convertType: boolean;
}

  

const TableWidget: React.FC<TableWidgetProps> = (props) => { 


    const theme = useTheme(); // Get the current theme
    const [isTableVisible, setIsTableVisible] = useState<boolean>(false); // State to toggle table/chart view
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State to manage selected date
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // State to toggle date picker visibility
    const [dateRange, setDateRange] = useState<Date[]>([
        new Date("2022-10-01T00:00:00+0000"),
        new Date("2022-11-01T00:00:00+0000"),
    ]); // State to manage date range

    // Function to toggle between table and chart
    const handleTableToggle = () => {
        setIsTableVisible(!isTableVisible);
    }


    useEffect(  () => {
        setIsTableVisible(props.convertType)
    },[props.convertType])

    // Function to handle date changes
    const handleDateChange = (dates: (Date | null | undefined)[]) => {
        if (dates && dates[0]) {
            setSelectedDate(dates[0]);
        }
    };

    // Frequency dropdown values
    const frequencies = [
        { id: 'Annualy', text: 'Annualy' },
        { id: 'Quaterly', text: 'Quaterly' }
    ];

    // Placeholder function for pagination handling
    const handlePage = () => {}

    return (
        <BaseWidget data={props}>
            <Theme theme={theme.theme === "light" ? "white" : "g100"}>
                <div style={{ cursor: 'move' }} className="drag-handle custom-icons">
                    <div className="sub-heading-wrapper">
                        <h2>{props.data.heading}</h2>
                        <label>{props.data.subHeading}</label>
                    </div>
                    <div className="icon-control">
                        <div className="controls">
                            <span className="date-range" onClick={() => setShowDatePicker(!showDatePicker)}>
                                Select Day Range <img className="calendar-icon" src="/calendar.svg" />
                            </span>
                            {showDatePicker && (
                                <div className="date-range-selector">
                                    <DatePicker
                                        datePickerType="range"
                                        closeOnSelect={true}
                                        onChange={(newValue) => handleDateChange(newValue)}
                                        value={dateRange}
                                        dateFormat="d/m/Y"
                                    >
                                        <DatePickerInput
                                            labelText=""
                                            id="date-picker-input-id-start"
                                            placeholder="dd/mm/yyyy"
                                            size="md"
                                        />
                                        <DatePickerInput
                                            labelText=""
                                            id="date-picker-input-id-finish"
                                            placeholder="dd/mm/yyyy"
                                            size="md"
                                        />
                                    </DatePicker>
                                </div>
                            )}
                            <CustomDropdown inline items={frequencies} label={"Select Frequency"} />
                        </div>
                        <img onClick={handleTableToggle}  style={{pointerEvents:'all'}}  src="/convert.svg" alt="convert-icon" title="Convert" />
                        <img style={{pointerEvents:'none',cursor:'move'}} src={"/move.svg"} alt="Move" />
                        <img src={"/dots.svg"} alt="More options" />
                    </div>
                </div>
                {isTableVisible ? (
                    <Table handlePagination={handlePage} rows={props.data.data} headers={props.data.headers} />
                ) : (
                    getChart(props.chartType, props.data.data)
                )}
            </Theme>
        </BaseWidget>
    );
};


export default TableWidget;


