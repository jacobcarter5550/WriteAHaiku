import React, { useState } from 'react';
import '@carbon/charts/styles.css';
import Card from '../../../ui-elements/list.tsx';
import { LineChart } from '../widgets/charts/line.tsx';
import { DatePicker, Theme } from "@carbon/react";
import { DatePickerInput } from "@carbon/react";
import { Tab, TabList, Tabs } from "@carbon/react";
import CustomDropdown from '../../../ui-elements/carbonDropdownTP.tsx';
import Heading from '../../../ui-elements/headingTP.tsx';
import FormulaeComponent from './formulae.tsx';
import { LineChart2 } from '../widgets/charts/line2.tsx';
import Button from '../../../ui-elements/buttonTP.tsx';



export enum MacroResearchENUM {
    SECTOR_ROTATION = "Sector Rotation",
    CAP_SIZE_ROTATION = "Cap-Size Rotation",
    FACTOR_ROTATION = "Factor Rotation",
    ASSET_CLASS_ROTATION = "Asset Class Rotation",
    REGION_ROTATION = "Region Rotation",
    COUNTRY_ROTATION = "Country Rotation",
}

export const MacroResearchView = {
    SECTOR_ROTATION: { id: 1, label: MacroResearchENUM.SECTOR_ROTATION },
    CAP_SIZE_ROTATION: { id: 2, label: MacroResearchENUM.CAP_SIZE_ROTATION },
    FACTOR_ROTATION: { id: 3, label: MacroResearchENUM.FACTOR_ROTATION },
    ASSET_CLASS_ROTATION: { id: 4, label: MacroResearchENUM.ASSET_CLASS_ROTATION },
    REGION_ROTATION: { id: 5, label: MacroResearchENUM.REGION_ROTATION },
    COUNTRY_ROTATION: { id: 6, label: MacroResearchENUM.COUNTRY_ROTATION },
};


const tabData = [
  MacroResearchENUM.SECTOR_ROTATION,
  MacroResearchENUM.CAP_SIZE_ROTATION,
  MacroResearchENUM.FACTOR_ROTATION,
  MacroResearchENUM.ASSET_CLASS_ROTATION,
  MacroResearchENUM.REGION_ROTATION,
  MacroResearchENUM.COUNTRY_ROTATION
];


const MicroResearch: React.FC = () => {
  

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


  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [selectedView, setSelectedView] = useState<MacroResearchENUM>(
    MacroResearchENUM.SECTOR_ROTATION
  );

  const handleTabChange = (index: number): void => {
    console.log(`Tab changed to index: ${index}`);
    setCurrentIndex(index);
    setSelectedView(tabData[index]);
  };


  
    // Frequency dropdown values
    const frequencies = [
      { id: 'Annualy', text: 'Annualy' },
      { id: 'Quaterly', text: 'Quaterly' }
  ];



      // List of macro factors
      const microFactors = [
        { text: "PE Ratio", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "PB Ratio", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Dividend Yield", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "EPS Growth", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Revenue Growth", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "ROE", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Gross Profit Margin", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Net Profit Margin", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "1-3 year price change", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "3-months Price change", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Market Capitalization", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Beta", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Standard deviation of returns", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Derived - Micro Factor", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Derived - Micro Factor", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Derived - Micro Factor", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Derived - Micro Factor", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Derived - Micro Factor", icons: ['settings--edit.svg', 'deleteHistory.svg'] },
        { text: "Derived - Micro Factor", icons: ['settings--edit.svg', 'deleteHistory.svg'] }
      ]
  

  return (
    <div className="macro-research-wrapper">
        <div className='flex-wrapper'>
            <div className='chart-block'>
            <FormulaeComponent text={'Micro Research'}/>
            <div style={{ cursor: 'move' }} className="drag-handle custom-icons">
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
                <LineChart2/>
                <div className='btn-list'>
                    <Button className='btn pop-btnNeg buttonMarginHelper' label='Back'/>
                    <Button className='btn pop-btn' label='Save'/>
                </div>
            </div>
            <div className='list-block'>  
                <Heading  variant='h2' text='Macro Factor Universe '/>
                <span>Priority list:</span>
                <div className='factors-list'>
                    {microFactors.map((factor, index) => (
                        <Card key={index} text={factor.text} icons={factor.icons} />
                    ))}
                </div>
                <div className='derived-factors'>
                    <button className='btn btn-primary cds--btn--primary'>Build Derived Factors</button>
                </div>  
            </div>
        </div>
    </div>
  );
};

export default MicroResearch;