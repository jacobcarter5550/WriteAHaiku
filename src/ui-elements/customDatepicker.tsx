import React, {useState} from 'react';
import { DatePicker, DatePickerInput } from 'carbon-components-react';

type CustomDatePickerProps =  {
  id: string;
  label: string;
  placeholder: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (dates: (Date | null | undefined)[]) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  id,
  label,
  placeholder,
  dateFormat = 'm/d/Y',
  minDate,
  maxDate,
  onChange,
}) => {

  const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };



  return (
     
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
};

export default CustomDatePicker;
