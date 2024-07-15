import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PortOptmHistSelect from "../Selection/OptimizationSelectionTP.js";
import ComparisonTable from "./ComparisonTableTP.tsx";
import PortSelect from "../Selection/PortfolioSelectionTP.tsx";
import "../optmHistStyle.scss";
import PortSelectStep from "../Selection/SelectionStepTP.tsx";
import { OptimizationSelection } from "../types.ts";

const style = {
  width: "95%",
  bgcolor: "background.paper",
  mt: 2,
  height: "95%",
};

type CoparisonStepProps = {
  optmHists: OptimizationSelection[];
  decrementPage: () => void;
};

const ComparisonStep = ({ optmHists, decrementPage }: CoparisonStepProps) => {
  return (
    <Box sx={{ ...style }}>
      <div style={{ display: "block" }}>
        <ComparisonTable optmHists={optmHists} />
      </div>
    </Box>
  );
};

export default ComparisonStep;
