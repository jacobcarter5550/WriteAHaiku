import React, { useState } from 'react';
import { DatePicker, DatePickerInput } from 'carbon-components-react';

const useDateRangePicker = () => {
  const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // const handleEndDateChange = (date) => {
  //   setEndDate(date);
  // };

  const DateRangePicker = () => (
    
    <DatePicker autoCorrect value={startDate}    onChange={handleStartDateChange} datePickerType="range">
      <DatePickerInput
        labelText="Start Date"
        id="start-date"
        placeholder="mm/dd/yyyy"
      />
      <DatePickerInput
        labelText="End Date"
        id="end-date"
        placeholder="mm/dd/yyyy"
      />
    </DatePicker>
  );


  console.log(startDate)

  return {
    startDate,
    DateRangePicker,
  };
};

export default useDateRangePicker;