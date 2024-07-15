// InfoBoxView.tsx
import React from "react";
import { InfoBox, isCompanyInfo, isSalesInfo } from "./types.ts";
import CompanyInfoBox from "./CompanyInfoBox.tsx";
import SalesInfoBox from "./SalesInfoBox.tsx";

interface InfoBoxViewProps {
  infoBoxes: InfoBox[];
}

const InfoBoxView: React.FC<InfoBoxViewProps> = ({ infoBoxes }) => {
  return (
    <div className="info-box-view" style={{width:'30vw'}}>
      {infoBoxes.map((box, index) => {
        function replaceSingleQuotesWithDoubleQuotes(inputString: string) {
          return inputString.replace(/'/g, '"');
        }

        if (typeof box === "object") {
          const realData = JSON.parse(
            replaceSingleQuotesWithDoubleQuotes(box.data)
          );
          return (
            <SalesInfoBox
              key={index}
              salesInfo={{ ticker: box.ticker, data: realData }}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default InfoBoxView;
