import React, { useState } from "react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";

const DrodpodwnWidget: React.FC = () => {
    
    
    // Frequency dropdown values
    const frequencies = [
        { id: 'Annualy', text: 'Annualy' },
        { id: 'Quaterly', text: 'Quaterly' }
    ];

    return (
        <div className="custom-table-row-container">
            <CustomDropdown inline items={frequencies} label={"Select Frequency"} />
        </div>
    );
};

export default DrodpodwnWidget;
