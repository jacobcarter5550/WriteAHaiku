import React, { useState } from "react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import { DatePicker } from "@carbon/react";
import { DatePickerInput } from "@carbon/react";

const Control = ({
    handleTable,
    state
}) => {




  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State to manage selected date

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // State to toggle date picker visibility

  const [dateRange, setDateRange] = useState<Date[]>([
      new Date("2022-10-01T00:00:00+0000"),
      new Date("2022-11-01T00:00:00+0000"),
  ]); // State to manage date range
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




  return (
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
        <img onClick={() => handleTable(!state)} style={{pointerEvents:'all'}}  src="/convert.svg" alt="convert-icon" title="Convert" />
        <img  style={{pointerEvents:'none',cursor:'move'}} src={"/move.svg"} alt="Move" />
        <img src={"/dots.svg"} alt="More options" />
    </div>
  )
}

export default Control