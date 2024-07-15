import React, { useEffect, useState } from "react";
import MultipleSelectCheckmarks from "../../ui-elements/multiselect.tsx";
import Button from "../../ui-elements/buttonTP.tsx";
import CustomSelect from "../../ui-elements/selectTP.tsx";
import { SelectOption } from "../nav/Nav.tsx";
import { updateAccountId } from "../../store/portfolio/index.ts";
import { useAppSelector } from "../../store/index.ts";

import {
  fetchPortfolioAction,
  fetchPortfolioSelectors,
} from "../../helpers/lib.ts";
import {
  getAccountId,
  getPortfolioActions,
  portfolioSelectors,
} from "../../store/portfolio/selector.ts";
import api, { getLocalAccessToken } from "../../helpers/serviceTP.ts";
import { signal } from "@preact/signals-react";
import { generateRandomFourDigitNumber } from "../modals/portfolioConstruction/lib.ts";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import OverrideConstructionConfig from "./overrideConstructionConfig.tsx";
import PortfolioConstructionConfig, {
  Optimization,
} from "../modals/portfolioConstruction/portfolioConstructionConfigTP.tsx";
import { useDispatch } from "react-redux";
import {
  setCurrentOpen,
  setCurrentSelection,
} from "../../store/nonPerstistant/index.ts";
import {
  getCurrentOpen,
  getShowOcioOptimizationDefinition,
  getShowOptimizationDefinition,
  getShowOverrideConfiguration,
} from "../../store/nonPerstistant/selectors.ts";
import { Option } from "../portfolio/portfolioLib.tsx";
import { useOptContext } from "../../providers/contexts/optContext.ts";
import OcioConstructionConfig from "../modals/ocioConstruction/ocioConstructionConfig.tsx";

export const modalOpen = signal<boolean>(false);

const constraintsArray = [
  {
    constraintId: "334",
    constraintTypeId: 4,
    factorId: 0,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: -2,
    penalty: 0,
    upperInner: null,
    upperOuter: 2,
  },
  {
    constraintId: "335",
    constraintTypeId: 5,
    factorId: 0,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: -1.5,
    penalty: 0,
    upperInner: null,
    upperOuter: 1.5,
  },
  {
    constraintId: "336",
    constraintTypeId: 6,
    factorId: 0,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: -0.5,
    penalty: 0,
    upperInner: null,
    upperOuter: 0.5,
  },
  {
    constraintId: "337",
    constraintTypeId: 7,
    factorId: 88,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: -0.5,
    penalty: 0,
    upperInner: null,
    upperOuter: 0.5,
  },
  {
    constraintId: "338",
    constraintTypeId: 7,
    factorId: 89,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: -1,
    penalty: 0,
    upperInner: null,
    upperOuter: 1,
  },
  {
    constraintId: "339",
    constraintTypeId: 8,
    factorId: 94,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: -0.2,
    penalty: 0,
    upperInner: null,
    upperOuter: 0.2,
  },
  {
    constraintId: "340",
    constraintTypeId: 9,
    factorId: 90,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: -0.05,
    penalty: 0,
    upperInner: null,
    upperOuter: 0.05,
  },
  {
    constraintId: "341",
    constraintTypeId: 10,
    factorId: 20,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: 0,
    penalty: 0,
    upperInner: null,
    upperOuter: 5,
  },
  {
    constraintId: "342",
    constraintTypeId: 11,
    factorId: 2010,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: 0,
    penalty: 0,
    upperInner: null,
    upperOuter: 3,
  },
  {
    constraintId: "343",
    constraintTypeId: 12,
    factorId: 151010,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: 0,
    penalty: 0,
    upperInner: null,
    upperOuter: 0.5,
  },
  {
    constraintId: "344",
    constraintTypeId: 3,
    factorId: 0,
    isAbsolute: true,
    isSoft: false,
    lowerInner: null,
    lowerOuter: 0,
    penalty: 0,
    upperInner: null,
    upperOuter: 0.1,
  },
  {
    constraintId: "345",
    constraintTypeId: 8,
    factorId: 91,
    isAbsolute: false,
    isSoft: false,
    lowerInner: null,
    lowerOuter: 0,
    penalty: 0,
    upperInner: null,
    upperOuter: 0,
  },
  {
    constraintId: "346",
    constraintTypeId: 8,
    factorId: 92,
    isAbsolute: false,
    isSoft: false,
    lowerInner: null,
    lowerOuter: 0,
    penalty: 0,
    upperInner: null,
    upperOuter: 0,
  },
  {
    constraintId: "347",
    constraintTypeId: 8,
    factorId: 93,
    isAbsolute: false,
    isSoft: false,
    lowerInner: null,
    lowerOuter: 0,
    penalty: 0,
    upperInner: null,
    upperOuter: 0,
  },
];

const emptyDefinition: Optimization = {
  capitalGainsTaxRate: 0,
  constraintPortfolioVesting: 0,
  constraints: constraintsArray,
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
  optimizationDefinitionName: "Test Optimisation 1",
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
const AEHeader: React.FC<{}> = ({}) => {
  const listedAccounts = useAppSelector(getAccountId);

  const [portfolioSelectedValue, setPortfolioSelected] = useState<
    SelectOption | {}
  >(listedAccounts);

  function dispatchOpen(val: boolean) {
    dispatch(setCurrentOpen(val));
  }

  const currentOpen = useAppSelector(getCurrentOpen);

  const dispatch = useDispatch();
  const stale = useAppSelector(getAccountId);
  useEffect(() => {
    console.log(stale);
    fetchPortfolioAction()(dispatch);
    fetchPortfolioSelectors(stale)(dispatch);
  }, []);

  const selectPortfolioSelector = (data: SelectOption[]) => {
    console.log(data);
    dispatchCurrentSelection({
      id: 1,
      value: "GICS",
      label: "GICS Sector",
    });
    setPortfolioSelected(data);
    dispatch(updateAccountId(data));
  };

  function dispatchCurrentSelection(val: Option) {
    dispatch(setCurrentSelection(val));
  }
  const [optimizationDefinition, setOptimizationDefintion] =
    useState<Optimization | null>(null);
  const updateOptions = (definition: Optimization) => {
    setOptimizationDefintion(definition);
  };
  useEffect(() => {
    updateOptions(emptyDefinition);
  }, []);

  const { optVal, setOptVal, setOpt } = useOptContext();

  const showOverrideConfiguration = useAppSelector(
    getShowOverrideConfiguration
  );

  const showOcioOptimizationDefinition = useAppSelector(
    getShowOcioOptimizationDefinition
  );

  const showOptimizationDefinition = useAppSelector(
    getShowOptimizationDefinition
  );
  useEffect(() => {
    // Find the element with the class name
    const element = document.querySelector(".max");

    // Define the click handler function
    const handleOpenClick = (e) => {
      console.log("Div clicked!");
      dispatchOpen(!currentOpen);
    };

    // Check if the element exists before adding the event listener
    if (element) {
      element.addEventListener("click", handleOpenClick);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (element) {
        element.removeEventListener("click", handleOpenClick);
      }
    };
  }, [currentOpen]);

  return (
    <>
      <div className="sub-header">
        <div className="dropdowns-section-one">
          <MultipleSelectCheckmarks
            changeFunction={(data) => selectPortfolioSelector(data)}
          />
          {showOverrideConfiguration ? (
            <OverrideConstructionConfig
              selectedPortfolio={portfolioSelectedValue}
              optimizationDefinition={optimizationDefinition}
              setOptimizationDefintion={setOptimizationDefintion}
            />
          ) : (
            <></>
          )}

          {showOcioOptimizationDefinition && (
            <OcioConstructionConfig
              selectedPortfolio={portfolioSelectedValue}
            />
          )}

          {showOptimizationDefinition && (
            <PortfolioConstructionConfig
              selectedPortfolio={portfolioSelectedValue}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AEHeader;
