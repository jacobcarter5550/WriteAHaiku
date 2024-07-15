/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { Optimization } from "../portfolioConstructionConfigTP";
import { TextInput } from "@carbon/react";
import { v4 } from "uuid";
import { DraggableItemProps } from "./draggableTP";

const EditDraggableItem: React.FC<DraggableItemProps> = ({
  item,
  openModal,
  definitions,
  setDefinitions,
  index,
  edit,
  setEdit,
}) => {
  const startVal =
    item.val === "New Definition" ? item.val : `Copy ${item.val}`;
  const [value, setVal] = useState(startVal);

  const emptyDefinition: Optimization = {
    capitalGainsTaxRate: 0,
    constraintPortfolioVesting: 0,
    constraints: [],
    countryModelCd: 0,
    createdBy: "",
    esgModelCd: 0,
    messages: "",
    modelAlphaCd: 0,
    modelRiskCd: 0,
    modelTaxCd: 0,
    modelTCostCd: 0,
    nonCapitalGainsTaxRate: 0,
    objectAlphaTerm: false,
    objectRiskTerm: false,
    objectTaxTerm: false,
    objectTCostTerm: false,
    objectCoefficientAlpha: 0,
    objectCoefficientRisk: 0,
    objectCoefficientTax: 0,
    objectCoefficientTCost: 0,
    objectMaxFunction: false,
    optimizationDefinitionId: 0,
    optimizationDefinitionName: value,
    optStrategyTypeCd: "",
    optTaxStrategyTypeCd: "",
    optTypeCd: "",
    perSecurityAbsLowerBound: 0,
    perSecurityAbsUpperBound: 0,
    perSecurityActiveLowerBound: 0,
    perSecurityActiveUpperBound: 0,
    primaryBenchmarkId: 0,
    secondaryBenchmarkId: 0,
    securityRestrictions: [],
    sectorModelCd: 0,
    targetAlpha: 0,
    targetTrackingError: 0,
    targetVol: 0,
    universeId: 0,
    validFrom: "",
    validTo: "",
  };

  return (
    <li draggable>
      <TextInput
        size="sm"
        labelText=""
        hideLabel
        id={`${v4()}`}
        type="text"
        value={value}
        onChange={(e) => {
          setVal(e.target.value);
        }}
      />
      <div className="editIcons">
        <img
          style={{ width: "2em" }}
          src="/arrow--right--edit.svg"
          onClick={() => {
            setEdit(true);
            openModal(emptyDefinition);
          }}
          className=""
        />
        <img
          style={{ width: "2em" }}
          src="/close.svg"
          onClick={() => {
            const newDefinitions = structuredClone(definitions);
            newDefinitions.splice(index, 1);
            setDefinitions(newDefinitions);
          }}
        />
      </div>
    </li>
  );
};

export default EditDraggableItem;
