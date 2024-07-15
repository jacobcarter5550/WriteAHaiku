import React, { useEffect, useState, useRef } from 'react';
import { TextArea, TextInput } from '@carbon/react';
import CustomDropdown from '../../../ui-elements/carbonDropdownTP.tsx';
import { DatePicker, Theme } from "@carbon/react";
import { DatePickerInput } from "@carbon/react";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import MathTextArea from './mathComponent.tsx' // Import the custom MathTextArea component

addStyles();

export enum MacroResearchENUM {
    SECTOR_ROTATION = "Sector Rotation",
    CAP_SIZE_ROTATION = "Cap-Size Rotation",
    FACTOR_ROTATION = "Factor Rotation",
    ASSET_CLASS_ROTATION = "Asset Class Rotation",
    REGION_ROTATION = "Region Rotation",
    COUNTRY_ROTATION = "Country Rotation",
    MICRO_FACTOR_RESEARCH = "Micro Factor Research",
    MICRO_RESEARCH = "Micro Research",
}

type FormulaeComponentProps = {
    text: MacroResearchENUM | string;
};

const FormulaeComponent: React.FC<FormulaeComponentProps> = ({ text }) => {
    const [state1, setState1] = useState<string>('');
    const [state2, setState2] = useState<string>('');

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

    // Frequency dropdown values
    const frequencies = [
        { id: 'Annualy', text: 'Annualy' },
        { id: 'Quaterly', text: 'Quaterly' }
    ];

    useEffect(() => {
        switch (text) {
            case MacroResearchENUM.SECTOR_ROTATION:
                setState1('Sector Rotation Model Name');
                setState2(`Cap Size​= α⋅GDP + β⋅INF + γ⋅UNEMP + δ⋅IR + ϵ⋅CCI + ζ⋅COMMODITY + η⋅FOREX + θ⋅CPI + ι⋅PPI + κ⋅ESI + λ⋅EMP + μ⋅TRADE 
                Where: 
                α,β,γ,δ,ϵ,ζ,η,θ,ι,κ,λ,μ are the weights assigned to each economic indicator based on their impact on the sector.`);
                break;
            case MacroResearchENUM.CAP_SIZE_ROTATION:
                setState1('Cap-size Rotation Model Name');
                setState2(`Cap Size​= α⋅GDP + β⋅INF + γ⋅UNEMP + δ⋅IR + ϵ⋅CCI + ζ⋅COMMODITY + η⋅FOREX + θ⋅CPI + ι⋅PPI + κ⋅ESI + λ⋅EMP + μ⋅TRADE 
                Where: 
                α,β,γ,δ,ϵ,ζ,η,θ,ι,κ,λ,μ are the weights assigned to each economic indicator based on their impact on the sector.`);
                break;
            case MacroResearchENUM.FACTOR_ROTATION:
                setState1('Factor-Model Rotation Model Name');
                setState2(`SValue​= α⋅(1−GDP) + β⋅INF + γ⋅UNEMP + δ⋅IR + ϵ⋅(1−CCI)
                SGrowth= α⋅GDP + β⋅(1−INF) + γ⋅(1−UNEMP) + δ⋅(1−IR) + ϵ⋅CCI
                SMomentum=α⋅GDP + β⋅(1−INF) + γ⋅MOM + δ⋅(1−IR) + ϵ⋅CCI 
                SSize=α⋅(1−MCAP)
                SQuality=α⋅(1−GDP)+β⋅INF+γ⋅UNEMP+δ⋅IR+ϵ⋅(1−CCI)`);
                break;
            case MacroResearchENUM.ASSET_CLASS_ROTATION:
            case MacroResearchENUM.COUNTRY_ROTATION:
            case MacroResearchENUM.REGION_ROTATION:
                setState1('Derived-Economic Strength and Stability Index (ESSI)');
                setState2('(w1 × GDP_growth) - (w2 × Unemployment_Rate) - (w3 × Inflation_Rate) - (w4 × Treasury_Yield_10yr)');
                break;
            case MacroResearchENUM.MICRO_FACTOR_RESEARCH:
            case 'Micro Factor Research':
                setState1('New Alpha Model Name');
                setState2(`Cap Size​= α⋅GDP + β⋅INF + γ⋅UNEMP + δ⋅IR + ϵ⋅CCI + ζ⋅COMMODITY + η⋅FOREX + θ⋅CPI + ι⋅PPI + κ⋅ESI + λ⋅EMP + μ⋅TRADE 
                Where: 
                α,β,γ,δ,ϵ,ζ,η,θ,ι,κ,λ,μ are the weights assigned to each economic indicator based on their impact on the sector.`);
                break;
            case 'Micro Research':
                setState1('New Alpha Model Name');
                setState2(`Cap Size​= α⋅GDP + β⋅INF + γ⋅UNEMP + δ⋅IR + ϵ⋅CCI + ζ⋅COMMODITY + η⋅FOREX + θ⋅CPI + ι⋅PPI + κ⋅ESI + λ⋅EMP + μ⋅TRADE 
                Where: 
                α,β,γ,δ,ϵ,ζ,η,θ,ι,κ,λ,μ are the weights assigned to each economic indicator based on their impact on the sector.`);
                break;
            case 'Macro Factor Research':
                setState1('Derived-Economic Strength and Stability Index (ESSI)');
                setState2(`Cap Size​= α⋅GDP + β⋅INF + γ⋅UNEMP + δ⋅IR + ϵ⋅CCI + ζ⋅COMMODITY + η⋅FOREX + θ⋅CPI + ι⋅PPI + κ⋅ESI + λ⋅EMP + μ⋅TRADE 
                Where: 
                α,β,γ,δ,ϵ,ζ,η,θ,ι,κ,λ,μ are the weights assigned to each economic indicator based on their impact on the sector.`);
                break;
            case MacroResearchENUM.MICRO_RESEARCH:
            case 'Micro Research':
                setState1('New Alpha Model Name');
                setState2(`Cap Size​= α⋅GDP + β⋅INF + γ⋅UNEMP + δ⋅IR + ϵ⋅CCI + ζ⋅COMMODITY + η⋅FOREX + θ⋅CPI + ι⋅PPI + κ⋅ESI + λ⋅EMP + μ⋅TRADE 
                Where: 
                α,β,γ,δ,ϵ,ζ,η,θ,ι,κ,λ,μ are the weights assigned to each economic indicator based on their impact on the sector.`);
                break;
            default:
                setState1('');
                setState2('');
                break;
        }
    }, [text]);

    return (
        <div className="sector-rotation-model">
            <div className='formulae-filter'>
                <TextInput
                    labelText=""
                    placeholder={state1}
                    id="sector-rotation-model-name"
                    className="sector-rotation-text-input"
                />
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
                </div>
            </div>
            <MathTextArea
                value={state2}
                onChange={setState2}
                rows={5}
                id="sector-rotation-equation"
                className="sector-rotation-text-area"
            />
        </div>
    );
};

export default FormulaeComponent;
