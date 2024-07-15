import React from "react";
import StackedArea from "./stackedArea.tsx";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";

function RightBlockModels() {
  return (
    <div className="right-block-models">
      <div className="heading-container">
        <div className="right-block-heading">Models</div>
        <CustomDropdown
          inline
          items={[]}
          label={"Representative Classic Model"}
        />
      </div>
      <div className="stacked-area-chart">
        <StackedArea title="Representative 60-40 model" />
      </div>
      <div className="stacked-area-chart">
        <StackedArea title="Representative 70-30 model" />
      </div>
      <div className="stacked-area-chart">
        <StackedArea title="Representative 80-20 model" />
      </div>
    </div>
  );
}

export default RightBlockModels;
