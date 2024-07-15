import React, { useState } from "react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";

const DynamicControl: React.FC = () => {


    // Frequency dropdown values
    const frequencies = [
        { id: 'Annualy', text: 'Annualy' },
        { id: 'Quaterly', text: 'Quaterly' }
    ];

    return (
        <div className="custom-table-row-container">
            <h2>Performance Dynamic Controls:</h2>
            <div className="dropdown-flex-wrapper">
                    <div className="parent-block">
                        <CustomDropdown inline items={frequencies} label={"Choose Strategy"} />
                        <img src="/move.svg"/>
                    </div>
                    <div className="parent-block">
                        <CustomDropdown inline items={frequencies} label={"Time Period"} />
                        <img src="/move.svg"/>
                    </div>
                    <div className="parent-block">
                        <CustomDropdown inline items={frequencies} label={"Return Type"} />
                        <img src="/move.svg"/>
                    </div>
                    <div className="parent-block">
                        <CustomDropdown inline items={frequencies} label={"Attribution Methodology"} />
                        <img src="/move.svg"/>
                    </div>
                    <div className="parent-block">
                        <CustomDropdown inline items={frequencies} label={"Currency"} />
                        <img src="/move.svg"/>
                    </div>
                    <div className="parent-block">
                        <CustomDropdown inline items={frequencies} label={"Include Transaction Costs"} />
                        <img src="/move.svg"/>
                    </div>
            </div>
        </div>
    );
};

export default DynamicControl;
