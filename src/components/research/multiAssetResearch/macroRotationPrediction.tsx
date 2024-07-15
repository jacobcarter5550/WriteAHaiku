import React, { useEffect, useRef, useState } from "react";
import HeatMap from "./heatMap.tsx";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";
import { DatePicker, DatePickerInput } from "@carbon/react";
import moment from "moment";

function MacroRotationPrediction() {
  const datePickerRef = useRef(null);

  const [startDate, setStartDate] = useState<string>("20201001");
  const [endDate, setEndDate] = useState<string>("20240510");
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date("2020-10-01T00:00:00+0000"),
    new Date("2024-05-10T00:00:00+0000"),
  ]);

  const handleDateChange = (newValue: Date[]) => {
    setDateRange(newValue);
    if (moment(newValue[0])?.format("YYYYMMDD") !== startDate) {
      setStartDate(moment(newValue[0])?.format("YYYYMMDD"));
    }
    if (moment(newValue[1])?.format("YYYYMMDD") !== endDate) {
      setEndDate(moment(newValue[1])?.format("YYYYMMDD"));
    }
  };

  const datePickerInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="macro-container">
      <div className="left-column">
        <div className="select-heading">Rotation Analysis</div>
        <div className="menu-container">
          <div className="menu-item"> Style Rotation</div>
          <div className="separator"></div>
          <div className="menu-item">Cap Rotation</div>
          <div className="separator"></div>

          <div className="menu-item"> Sector Rotation</div>
          <div className="separator"></div>

          <div className="menu-item">Factor Rotation</div>
        </div>

        <div className="select-heading">Visualization</div>

        <div className="menu-container">
          <div className="menu-item"> Heat Map Visualization</div>
          <div className="separator"></div>
          <div className="menu-item">Trend Visualization</div>
          <div className="separator"></div>
          <div className="menu-item">Trend Visualization</div>
          <div className="separator"></div>
          <div className="menu-item">Trend Visualization</div>
          <div className="separator"></div>

          <div className="menu-item"> Sector Rotation</div>
          <div className="separator"></div>

          <div className="menu-item">Factor Rotation</div>
        </div>

        {/* <div className="date-range-selector" ref={datePickerRef}>
          <DatePicker
            datePickerType="range"
            onChange={(newValue) => handleDateChange(newValue)}
            value={dateRange}
            closeOnSelect={false}
            dateFormat="d/m/Y"
          >
            <DatePickerInput
              id="date-picker-input-id-start"
              placeholder="dd/mm/yyyy"
              labelText="Start date"
              size="md"
              ref={datePickerInputRef}
            />
            <DatePickerInput
              id="date-picker-input-id-finish"
              placeholder="dd/mm/yyyy"
              labelText="End date"
              size="md"
              ref={datePickerInputRef}
            />
          </DatePicker>
        </div> */}
      </div>
      <HeatMap />
    </div>
  );
}

export default MacroRotationPrediction;
