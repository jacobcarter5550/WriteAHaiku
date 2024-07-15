import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import PortfolioSelection from "./PortfolioSelectionTP.tsx";
import OptmizationSelection from "./OptimizationSelectionTP.tsx";
import { Node } from "../../../modals/portfolioConstruction/types.ts";
import { OptimizationSelection } from "../types.ts";

export type PortfolioSelectionProps = {
  selectedPorts: Node[];
  setSelectedPorts: React.Dispatch<React.SetStateAction<Node[]>>;
  optmHists: OptimizationSelection[];
  setOptmHists: React.Dispatch<React.SetStateAction<OptimizationSelection[]>>;
  incrementPage: () => void;
  setInputOptmHists: React.Dispatch<React.SetStateAction<any[]>>;
  close: any;
  nodeLets: Node[];
  setNodelets: React.Dispatch<React.SetStateAction<Node[]>>;
};

const SelectionStep = ({
  selectedPorts,
  setSelectedPorts,
  optmHists,
  setOptmHists,
  incrementPage,
  setInputOptmHists,
  nodeLets,
  setNodelets,
}: PortfolioSelectionProps) => {
  const handleProceed = () => {
    setInputOptmHists(optmHists);
    incrementPage();
  };

  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <div
        style={{
          display: "block",
          paddingTop: 20,
          overflow: "auto",
        }}
        className={`${
          selectedPorts[0]?.id?.length > 0
            ? "portfolio-selection-container-half"
            : "portfolio-selection-container"
        }`}
      >
        <PortfolioSelection
          selectedPorts={selectedPorts}
          setSelectedPorts={setSelectedPorts}
          nodeLets={nodeLets}
          setNodelets={setNodelets}
        />
      </div>

      {selectedPorts[0]?.id?.length > 0 && (
        <div
          style={{ display: "block" }}
          className="optimization-selection-container"
        >
          <OptmizationSelection
            selectedPorts={selectedPorts}
            // optmHists={optmHists}
            setOptmHists={setOptmHists}
          />
        </div>
      )}
    </div>
  );
};

export default SelectionStep;
