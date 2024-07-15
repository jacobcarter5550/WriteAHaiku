import React, { useEffect, useState } from "react";
import {
  ConstraintTypes,
  ModelCollection,
  Optimization,
} from "../modals/portfolioConstruction/portfolioConstructionConfigTP.tsx";
import OverrideConfiguration from "../modals/equityPM/overrideConfiguration.tsx";
import {
  dictionaryToArray,
  filterSectorsByConstraints,
} from "../modals/portfolioConstruction/lib.ts";
import { SelectOption } from "../nav/Nav";
import { getAccountId } from "../../store/portfolio/selector.ts";
import { dummy2 } from "../modals/portfolioConstruction/dummy.ts";
import api from "../../helpers/serviceTP.ts";
import { useAppSelector } from "../../store/index.ts";
import { signal } from "@preact/signals-react";
import { Classification } from "../modals/portfolioConstruction/types.ts";
import { getCurrentDateFormatted } from "../../helpers/lib.ts";
import FactorConstraintsContentEquity from "./FactorConstraintsDialogEquity.tsx";
import { useDispatch } from "react-redux";
import { setShowOverrideConfiguration } from "../../store/nonPerstistant/index.ts";
import { getShowOverrideConfiguration } from "../../store/nonPerstistant/selectors.ts";

export const portfolioHoldingSignalEquity = signal<Classification | null>(null);

export type FactorDialogEquityProps = {
  optimizationDefinition: Optimization | null;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  constraintTypes: ConstraintTypes;

  dif?: Classification;
  setDif?: React.Dispatch<React.SetStateAction<Classification>>;
  setPortfolioHolding: React.Dispatch<React.SetStateAction<Classification>>;
  riskModels: any;
  esgModels: any;
};
export default function OverrideConstructionConfig({
  selectedPortfolio,
  optimizationDefinition,
  setOptimizationDefintion,
}) {
  const dispatch = useDispatch();

  const [portfolioHolding, setPortfolioHolding] =
    // @ts-ignore
    useState<Classification>(null);
  //@ts-ignore
  const [dif, setDif] = useState<Classification>(null);

  function dispatchShowOverrideConfig(val: boolean) {
    dispatch(setShowOverrideConfiguration(val));
  }

  const showOverrideConfiguration = useAppSelector(
    getShowOverrideConfiguration
  );

  useEffect(() => {
    console.log(showOverrideConfiguration);
  }, [showOverrideConfiguration]);
  const handleCloseOverrideConfiguration = () => {
    dispatchShowOverrideConfig(false);
  };

  useEffect(() => {
    if (!dif) {
      setDif(dummy2);
    }
  }, [dif]);

  useEffect(() => {
    async function getValues(optimizationDefinition: Optimization | null) {
      console.log(optimizationDefinition);
      await api
        .get(`reference/classification/2`)
        //@ts-ignore
        .then((response: AxiosResponse<Classification, any>) => {
          console.log(optimizationDefinition?.constraints);
          const filteredSectors = filterSectorsByConstraints(
            response.data.sectorList,
            optimizationDefinition?.constraints!
          );

          setPortfolioHolding({ sectorList: filteredSectors, messages: {} });
          console.log(filteredSectors);
          portfolioHoldingSignalEquity.value = {
            sectorList: filteredSectors,
            messages: {},
          };
          setDif(response.data);
          console.log("called", portfolioHoldingSignalEquity);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (portfolioHolding == null && selectedPortfolio) {
      getValues(optimizationDefinition);
    }
  }, [showOverrideConfiguration]);

  return (
    <>
      <OverrideConfiguration
        optimizationDefinition={optimizationDefinition}
        setOptimizationDefintion={setOptimizationDefintion}
        setPortfolioHolding={setPortfolioHolding}
        setDif={setDif}
        dif={dif}
        open={showOverrideConfiguration}
        handleClose={handleCloseOverrideConfiguration}
        selectedPortfolio={selectedPortfolio}
      />
    </>
  );
}
