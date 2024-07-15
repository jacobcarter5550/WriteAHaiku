import { DialogTitle } from "@mui/material";
import React from "react";
// @ts-ignore
import SectorConstraintsContent from "./Sector/SectorConstraintsDialogTP copy.tsx";
import FactorConstraintsContent from "./Factor/FactorConstraintsDialogTP copy.tsx";
import ConstraintDialogContent from "./Constraint/constraintDialogTP copy.tsx";
import {
  ConstraintTypes,
  DialogContent,
  ModelCollection,
  Optimization,
} from "./portfolioConstructionConfigTP.tsx";
import { Select } from "./Form/portfolioConstructionTP.tsx";
import { Classification } from "./types.ts";

type AggregateStepProps = {
  incrementPage: () => void;
  decrementPage: () => void;
  optimizationDefinition: Optimization | null;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  setDialogState: React.Dispatch<React.SetStateAction<DialogContent>>;
  selectedPortfolio: Select[];
  constraintTypes: ConstraintTypes | null;
  state: DialogContent;
  setPortfolioHolding: React.Dispatch<React.SetStateAction<Classification>>;
  portfolioHolding: Classification | null;
  esgModels: ModelCollection | null;
  riskModels: ModelCollection | null;
  setDif: React.Dispatch<React.SetStateAction<Classification>>;
  dif: Classification;
};

const AggregateStep: React.FC<AggregateStepProps> = ({
  incrementPage,
  decrementPage,
  optimizationDefinition,
  setOptimizationDefintion,
  setDialogState,
  selectedPortfolio,
  constraintTypes,
  portfolioHolding,
  state,
  setPortfolioHolding,
  esgModels,
  riskModels,
  setDif,
  dif,
}) => {
  return (
    <>
      <aside
        style={{
          width: "95%",
          height: "100%",
          overflowX: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="portfolio-construction">
          <DialogTitle
            textAlign="center"
            mt="1em"
            fontSize={"2rem"}
            fontWeight={"500"}
          >
            Portfolio Construction (Object and Constraint Setup)
          </DialogTitle>
          <ConstraintDialogContent
            incrementPage={incrementPage}
            decrementPage={decrementPage}
            optimizationDefinition={optimizationDefinition}
            setOptimizationDefintion={setOptimizationDefintion}
            setDialogState={setDialogState}
            selectedPortfolio={selectedPortfolio}
            constraintTypes={constraintTypes!}
            portfolioHolding={portfolioHolding!}
            state={state}
            setPortfolioHolding={setPortfolioHolding}
          />
          <SectorConstraintsContent
            incrementPage={incrementPage}
            decrementPage={decrementPage}
            optimizationDefinition={optimizationDefinition}
            setOptimizationDefintion={setOptimizationDefintion}
            setDialogState={setDialogState}
            selectedPortfolio={selectedPortfolio}
            constraintTypes={constraintTypes!}
            portfolioHolding={portfolioHolding!}
            setDif={setDif}
            dif={dif}
            setPortfolioHolding={setPortfolioHolding}
          />
          <FactorConstraintsContent
            incrementPage={incrementPage}
            decrementPage={decrementPage}
            optimizationDefinition={optimizationDefinition}
            setOptimizationDefintion={setOptimizationDefintion}
            setDialogState={setDialogState}
            selectedPortfolio={selectedPortfolio}
            constraintTypes={constraintTypes!}
            portfolioHolding={portfolioHolding!}
            state={state}
            setPortfolioHolding={setPortfolioHolding}
            esgModels={esgModels}
            riskModels={riskModels}
          />
        </div>
      </aside>
    </>
  );
};

export default AggregateStep;
