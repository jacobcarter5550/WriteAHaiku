import React, { useState, useRef, useEffect } from 'react';
import '@carbon/charts/styles.css';
import Card from '../../../ui-elements/list.tsx';
import { LineChart } from '../widgets/charts/line.tsx';
import { DatePicker, Theme } from "@carbon/react";
import { DatePickerInput } from "@carbon/react";
import CustomDropdown from '../../../ui-elements/carbonDropdownTP.tsx';
import Heading from '../../../ui-elements/headingTP.tsx';
import Button from '../../../ui-elements/buttonTP.tsx';
import { LineChart2 } from '../widgets/charts/line2.tsx';
import FormulaeComponent from './formulae.tsx';
import { useTheme } from "next-themes";



const MacroFactorResearch: React.FC = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State to manage selected date
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // State to toggle date picker visibility
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date("2022-10-01T00:00:00+0000"),
    new Date("2022-11-01T00:00:00+0000"),
  ]); // State to manage date range
  const listBlockRef = useRef<HTMLDivElement>(null);


  // Function to handle date changes
  const handleDateChange = (dates: (Date | null | undefined)[]) => {
    if (dates && dates[0]) {
      setSelectedDate(dates[0]);
    }
  };  

  const [formulae, toggleFormulae] = useState<Boolean>(false)

  // Frequency dropdown values
  const frequencies = [
    { id: 'Annualy', text: 'Annualy' },
    { id: 'Quaterly', text: 'Quaterly' }
  ];

  const macroFactors = [
    { text: "Interest Rates", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Inflation Data", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Unemployment Data", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "GDP Data", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Consumer Confidence", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Retail Sales Data", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Manufacturing Data", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Housing Data", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Corporate Earning Data", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Market Liquidity Indicators", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI1", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI2", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI3", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI4", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI5", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI6", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI7", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI8", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI9", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI10", icons: ['settings--edit.svg', 'trashCan.svg'] },
    { text: "Derived - ESI11", icons: ['settings--edit.svg', 'trashCan.svg'] },
];


  return (
    <div className="macro-research-wrapper">
      <div className='flex-wrapper'>
        <div className='chart-block'>
         {formulae && <FormulaeComponent text='Macro Factor Research'/>}
          <div className="drag-handle custom-icons">
            <div className="sub-heading-wrapper">
              <h2>Macro Factor Historical Visualization</h2>
              <label>Jan 2022 - Dec 2022</label>
            </div>
            {/* <div className="icon-control">
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
            </div> */}
          </div>
          <Theme theme={theme.theme == "light" ? "white" : "g100"}>
          <LineChart2/></Theme>
          <div className='btn-list'>
            <Button className='btn pop-btnNeg buttonMarginHelper' label='Back'/>
            <Button className='btn pop-btn' label='Save'/>
          </div>
        </div>
        <div className='list-block' ref={listBlockRef}>
          <Heading variant='h2' text='Macro Factor Universe ' />
          <span>Priority list:</span>
          <div  className='factors-list'>
              {macroFactors.map((factor, index) => (
                    <Card key={index} text={factor.text} icons={factor.icons} />
                ))}
          </div>
          <div className='derived-factors'>
            <button onClick={ () => toggleFormulae(true)} className='btn btn-primary cds--btn--primary'>Build Derived Factors</button>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default MacroFactorResearch;
