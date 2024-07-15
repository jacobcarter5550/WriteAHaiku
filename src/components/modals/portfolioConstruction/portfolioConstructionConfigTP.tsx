import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import RestrictDialog from "./Restriction/restrictionsDialogTP.tsx";
import OptimisationDefinition from "./optimsationDefTP.tsx";
import PortfolioConstruction, {
  Select,
} from "./Form/portfolioConstructionTP.tsx";
import api from "../../../helpers/serviceTP.ts";

import { dummy2 } from "./dummy.ts";

import {
  createPayloadForUpdate,
  dictionaryToArray,
  filterSectorsByConstraints,
  findObjectsWithCacheOrRebalance,
  generateRandomFourDigitNumber,
} from "./lib.ts";
import { signal } from "@preact/signals-react";
import { Classification, Node, PortfolioCollection } from "./types.ts";
import { constructionFlowAccount } from "../../portfolio/grid/Grid.tsx";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountId } from "../../../store/portfolio/selector.ts";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import AggregateStep from "./AggregateStep.tsx";
import Button from "../../../ui-elements/buttonTP.tsx";
import { Stack } from "@mui/material";
import { useTheme } from "next-themes";
import { AxiosResponse } from "axios";
import { getCurrentDateFormatted } from "../../../helpers/lib.ts";
import { SelectOption } from "../../nav/Nav.tsx";
import { getForm } from "../../../store/nonPerstistant/selectors.ts";
import {
  setOpt,
  setShowOptimizationDefinition,
} from "../../../store/nonPerstistant/index.ts";
import { useDispatch } from "react-redux";

export type DialogContent = {
  alpha: number;
  te: number;
  vol: number;
  sectorConstraints: {
    sector: {
      label: string;
      radio1: string;
      radio2: string;
      slider: number;
      penalty: number;
    };
    subsector: {
      label: string;
      radio1: string;
      radio2: string;
      slider: number;
      penalty: number;
    };
    industry: {
      label: string;
      radio1: string;
      radio2: string;
      slider: number;
      penalty: number;
    };
  };
  factorConstraints: {
    value: {
      label: string;
      radio1: string;
      radio2: string;
      slider: number;
      penalty: number;
    };
    row: {
      label: string;
      radio1: string;
      radio2: string;
      slider: number;
      penalty: number;
    };
    size: {
      label: string;
      radio1: string;
      radio2: string;
      slider: number;
      penalty: number;
    };
  };
};

export type UUID = string;
export type Constraint = {
  constraintId: string;
  constraintTypeId: number | null;
  factorId: number | null;
  lowerOuter: number | null;
  lowerInner: number | null;
  upperInner: number | null;
  upperOuter: number | null;
  penalty: number | null;
  isSoft: boolean;
  isAbsolute: boolean;
  constraintType?: string;
  title?: string;
};

export type restrictionDefinition = {
  definitionId: number;
  securityId: UUID;
  holdOnly: boolean | null;
  buyNotSell: boolean | null;
  sellNotBuy: boolean | null;
  sellAll: boolean | null;
  validFrom: string;
  validTo: string;
};

export type Optimization = {
  optimizationDefinitionId: number | null;
  optimizationDefinitionName: string | null;
  optTypeCd: string | null;
  optStrategyTypeCd: string | null;
  optTaxStrategyTypeCd: string | null;
  targetTrackingError: number | null;
  targetAlpha: number | null;
  targetVol: number | null;

  objectMaxFunction: boolean | null;
  objectAlphaTerm: boolean | null;
  objectRiskTerm: boolean | null;
  objectTaxTerm: boolean | null;
  objectTCostTerm: boolean | null;
  objectCoefficientAlpha: number | null;
  objectCoefficientRisk: number | null;
  objectCoefficientTax: number | null;
  objectCoefficientTCost: number | null;
  capitalGainsTaxRate: number | null;
  nonCapitalGainsTaxRate: number | null;
  primaryBenchmarkId: number | null;
  secondaryBenchmarkId: number | null;
  universeId: number | null;
  modelAlphaCd: number | null;
  modelRiskCd: number | null;
  modelTCostCd: number | null;
  modelTaxCd: number | null;
  countryModelCd: number | null;
  esgModelCd: number | null;
  sectorModelCd: number | null;
  constraintPortfolioVesting: number | null;
  perSecurityActiveLowerBound: number | null;
  perSecurityActiveUpperBound: number | null;
  perSecurityAbsLowerBound: number | null;
  perSecurityAbsUpperBound: number | null;
  constraints: Constraint[];
  securityRestrictions: restrictionDefinition[];
  validFrom: string | null;
  validTo: string | null;
  createdBy: string | null;
  messages: any | null;
};

export type PartialSecurity = {
  buyNotSell: null | boolean;
  cik: string;
  composite_figi_id: string;
  cusip: string;
  definitionId: number;
  description: string;
  figi_id: string;
  founding_date: string;
  headquarter: string;
  holdOnly: null | boolean;
  id: number;
  isin: string;
  issuer_id: null | number;
  securityCd: string;
  securityId: string;
  securityName: string;
  security_type_cd: string;
  sedol: string;
  sellAll: null | boolean;
  sellNotBuy: null | boolean;
  shareclass_figi_id: string;
  validFrom: string;
  validTo: string;
};

export type OptimisationDefinitionProps = {
  incrementPage: () => void;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  nodes: Node[];
  setNodelets: React.Dispatch<React.SetStateAction<Node[]>>;
  definitions: any;
  setDefinitions: React.Dispatch<React.SetStateAction<any>>;
  setAccounts: React.Dispatch<React.SetStateAction<PortfolioCollection | null>>;
};

export interface ConstraintTypes {
  [key: string]: number;
}

export type ConstraintDialogProps = {
  incrementPage: () => void;
  decrementPage: () => void;
  optimizationDefinition: Optimization | null;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  setDialogState: React.Dispatch<React.SetStateAction<any>>;
  selectedPortfolio: any;
  constraintTypes: ConstraintTypes;
  portfolioHolding: Classification;
  state?: any;
  dif?: Classification;
  setDif?: React.Dispatch<React.SetStateAction<Classification>>;
  setPortfolioHolding: React.Dispatch<React.SetStateAction<Classification>>;
};
export type FactorDialogProps = {
  incrementPage: () => void;
  decrementPage: () => void;
  optimizationDefinition: Optimization | null;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  setDialogState: React.Dispatch<React.SetStateAction<any>>;
  selectedPortfolio: any;
  constraintTypes: ConstraintTypes;
  portfolioHolding: Classification;
  state?: any;
  dif?: Classification;
  setDif?: React.Dispatch<React.SetStateAction<Classification>>;
  setPortfolioHolding: React.Dispatch<React.SetStateAction<Classification>>;
  riskModels: any;
  esgModels: any;
};

type ConstructionConfigProps = {
  selectedPortfolio: SelectOption | {};
};

export type ModelCollection = {
  title: unknown;
  id: number;
}[];

export const portfolioHoldingSignal = signal<Classification | null>(null);

export default function PortfolioConstructionConfig({
  selectedPortfolio,
}: ConstructionConfigProps) {
  const dispatch = useDispatch();
  const accounts = useAppSelector(getAccountId);
  const theme = useTheme();

  function dispatchShowOptimizationDefinition(val: boolean) {
    dispatch(setShowOptimizationDefinition(val));
  }

  const close = () => {
    constructionFlowAccount.value = null;
    dispatchShowOptimizationDefinition(false);
  };

  const [factorConstraints, setFactorConstraints] = useState<any>(null);

  const [page, setPage] = useState<number>(1);

  const [multipleAccounts, setMultipleAccounts] =
    useState<PortfolioCollection | null>(null);

  const [nodes, setNodelets] = useState<Node[]>([]);

  const [optimizationDefinition, setOptimizationDefintion] =
    useState<Optimization | null>(null);

  const [dialogState, setDialogState] = useState<DialogContent>({
    alpha: 0.5,
    te: 0.5,
    vol: 0.5,
    sectorConstraints: {
      sector: {
        label: "sector",
        radio1: "ABS",
        radio2: "HARD",
        slider: 0,
        penalty: 0,
      },
      subsector: {
        label: "sub-sector",
        radio1: "REL",
        radio2: "SOFT",
        slider: 0,
        penalty: 0,
      },
      industry: {
        label: "industry",
        radio1: "REL",
        radio2: "SOFT",
        slider: 0,
        penalty: 0,
      },
    },
    factorConstraints: {
      value: {
        label: "Value",
        radio1: "ABS",
        radio2: "HARD",
        slider: 0,
        penalty: 0,
      },
      row: {
        label: "Rows",
        radio1: "REL",
        radio2: "SOFT",
        slider: 0,
        penalty: 0,
      },
      size: {
        label: "size non-linearality",
        radio1: "REL",
        radio2: "SOFT",
        slider: 0,
        penalty: 0,
      },
    },
  });

  const [edit, setEdit] = useState<boolean>(false);

  const [constraintTypes, setConstraintTypes] =
    useState<ConstraintTypes | null>(null);

  useEffect(() => {
    async function getConstraintTypes() {
      const response = await api.get("/constrainttypes/all");
      console.log(response);
      setConstraintTypes(response.data);
    }
    if (constraintTypes === null) {
      getConstraintTypes();
    }
  }, []);

  const [returnedSecurity, setReturnedSecurity] = useState<
    PartialSecurity[] | null
  >(null);

  useEffect(() => {
    async function handleID() {
      try {
        const promises: any = [];
        const rows = optimizationDefinition?.securityRestrictions;
        if (rows && returnedSecurity === null) {
          rows.forEach((row) => {
            const prom = api.get(`/security/${row.securityId}`);
            promises.push(prom);
          });
          const results = await Promise.all(promises);
          const combinedRows = rows.map((row, index) => {
            // try {
            const resultData = results.find((result) => {
              return result.data[0].securityId === row.securityId;
            });
            return {
              id: index + 1,
              ...row,
              ...resultData.data[0],
            };
          });

          setReturnedSecurity(combinedRows.filter(Boolean));
        }
      } catch (error) {
        console.error("Error occurred in handleID:", error);
      }
    }
    handleID();
  }, [optimizationDefinition]);

  const [portfolioHolding, setPortfolioHolding] =
    // @ts-ignore
    useState<Classification>(null);

  useEffect(() => {
    console.log("————————————————————————portfolioHolding", portfolioHolding);
  }, [portfolioHolding]);

  //@ts-ignore
  const [dif, setDif] = useState<Classification>(null);
  console.log(selectedPortfolio);
  //@ts-ignore
  const selectedAccount = accounts.find(
    (acct) => acct.label == constructionFlowAccount.value
  );
  const acct = selectedAccount ? selectedAccount : selectedPortfolio![0];
  useEffect(() => {
    async function getValues(optimizationDefinition: Optimization | null) {
      await api
        .get(`reference/classification/2`)
        //@ts-ignore
        .then((response: AxiosResponse<Classification, any>) => {
          console.log(response);
          const filteredSectors = filterSectorsByConstraints(
            response.data.sectorList,
            optimizationDefinition?.constraints!
          );

          setPortfolioHolding({ sectorList: filteredSectors, messages: {} });
          console.log(filteredSectors);
          portfolioHoldingSignal.value = {
            sectorList: filteredSectors,
            messages: {},
          };
          setDif(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (
      portfolioHolding == null &&
      selectedPortfolio &&
      optimizationDefinition !== null
    ) {
      getValues(optimizationDefinition);
    }
  }, [optimizationDefinition]);

  useEffect(() => {
    if (!dif) {
      setDif(dummy2);
    }
  }, [dif]);

  const [riskModels, setRiskModels] = useState<ModelCollection | null>(null);
  const [esgModels, setEsgModels] = useState<ModelCollection | null>(null);

  useEffect(() => {
    if (
      factorConstraints == null &&
      selectedPortfolio &&
      optimizationDefinition !== null
    ) {
      const promises = [
        api.get(`/riskmodels/all/${getCurrentDateFormatted()}`),
        api.get(`/esgmodels/all/${getCurrentDateFormatted()}`),
      ];

      Promise.all(promises)
        .then(async (results) => {
          let promises2: any = [];
          results.forEach((result) => {
            if (result.data) {
              const req = api.get(
                `/factormodel/${result.data[0].analyticModelId}`
              );
              promises2.push(req);
            } else {
              const req = api.get(
                `/factormodel/${result.data[0].analyticModelId}`
              );
              promises2.push(req);
            }
          });
          const modelResults = await Promise.all(promises2);

          modelResults.forEach((modelSet, index) => {
            switch (index) {
              case 0:
                setRiskModels(dictionaryToArray(modelSet.data));
                break;
              case 1:
                setEsgModels(dictionaryToArray(modelSet.data));
                break;
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [optimizationDefinition]);

  const incrementPage = () => setPage(page + 1);
  const decrementPage = () => setPage(page - 1);

  const [definitions, setDefinitions] = useState<any>();

  function addDefinition() {
    let newDefs = structuredClone(definitions);
    newDefs.unshift({ edit: true, val: "New Definition" });
    setDefinitions(newDefs);
  }

  function dispatchOpt(val: boolean) {
    dispatch(setOpt(val));
  }
  console.log("Node List -->", nodes);
  const pages = [
    <OptimisationDefinition
      incrementPage={incrementPage}
      setOptimizationDefintion={setOptimizationDefintion}
      edit={edit}
      setEdit={setEdit}
      nodes={nodes}
      setNodelets={setNodelets}
      definitions={definitions}
      setDefinitions={setDefinitions}
      setAccounts={setMultipleAccounts}
    />,
    <PortfolioConstruction
      incrementPage={incrementPage}
      decrementPage={decrementPage}
      optimizationDefinition={optimizationDefinition}
      setOptimizationDefintion={setOptimizationDefintion}
    />,
    <AggregateStep
      incrementPage={incrementPage}
      decrementPage={decrementPage}
      optimizationDefinition={optimizationDefinition}
      setOptimizationDefintion={setOptimizationDefintion}
      setDialogState={setDialogState}
      selectedPortfolio={[acct]}
      constraintTypes={constraintTypes}
      state={dialogState}
      setPortfolioHolding={setPortfolioHolding}
      portfolioHolding={portfolioHoldingSignal.value!}
      esgModels={esgModels}
      riskModels={riskModels}
      setDif={setDif}
      dif={dif}
    />,
    <RestrictDialog
      edit={edit}
      setEdit={setEdit}
      incrementPage={incrementPage}
      decrementPage={decrementPage}
      optimizationDefinition={optimizationDefinition}
      returnedSecurity={returnedSecurity}
      setReturnedSecurity={setReturnedSecurity}
      setOptimizationDefintion={setOptimizationDefintion}
      close={close}
      account={[acct]}
    />,
  ];

  const definitionButtons = (
    <div
      style={{
        width: "97%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <aside>
        <Button
          label={"Upload"}
          className={"pop-btn"}
          onClick={addDefinition}
        />
      </aside>
      <aside
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "410px",
        }}
      >
        <Button
          label={"Create New Definition"}
          className={
            theme.theme == "light"
              ? "pop-btnNeg buttonMarginHelper"
              : "pop-btnNeg-dark-mode buttonMarginHelper"
          }
          onClick={addDefinition}
        />
        <Button
          label={"Save"}
          className={"pop-btn buttonMarginHelper"}
          onClick={async () => {
            const payload = createPayloadForUpdate(
              findObjectsWithCacheOrRebalance(nodes),
              multipleAccounts
            );
            await api
              .post("account/updateOptDefinitions", payload)
              .then((reponse) => {
                console.log(reponse);
                close();
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      </aside>
    </div>
  );

  const restrictionsButtons = (
    <Stack direction="row-reverse" alignItems="center" width="95%" spacing={2}>
      {constructionFlowAccount.value && (
        <Button
          className={"pop-btn"}
          label="Optimize"
          onClick={async () => {
            const selectedAccount = accounts.find(
              (acct) => acct.label == constructionFlowAccount.value
            );

            const payload = {
              accountOptDefPairs: [
                {
                  accountId: selectedAccount!.value,
                  optDefId: 1,
                },
              ],
              name: `opt ${generateRandomFourDigitNumber()}`,
            };

            await api.post("/optevent/new", payload).then(() => {
              toast("Successfully Started Optimization");
              dispatchOpt(true);
              close();
            });
          }}
        />
      )}
      <Button
        className={"pop-btn"}
        label="Save"
        onClick={async () => {
          if (!edit) {
            api.put("/optimisationdefinition/update", optimizationDefinition);
            close();
          } else {
            api.post("/optimisationdefinition/new", optimizationDefinition);
            close();
          }
        }}
      />
      <Button
        className={
          theme.theme == "light"
            ? "pop-btnNeg buttonMarginHelper"
            : "pop-btnNeg-dark-mode buttonMarginHelper"
        }
        label="Back"
        onClick={decrementPage}
      />
    </Stack>
  );

  const form = useAppSelector(getForm);

  const formButtons = (
    <Stack direction="row-reverse" alignItems="center" width="95%" spacing={2}>
      <Button
        className={"pop-btn"}
        label="Next"
        onClick={() => {
          setOptimizationDefintion((optimizationDefinition) => {
            if (optimizationDefinition) {
              // —————— States ——————
              optimizationDefinition.optTypeCd = form.optTypeCd?.label!;
              optimizationDefinition.optStrategyTypeCd =
                form.optStrategyTypeCd?.label!;
              optimizationDefinition.primaryBenchmarkId =
                form.primaryBenchmarkId?.value!;
              optimizationDefinition.secondaryBenchmarkId =
                form.secondaryBenchmarkId?.value!;
              optimizationDefinition.universeId = form.universeId?.value!;
              optimizationDefinition.modelAlphaCd = form.modelAlphaCd?.value!;
              optimizationDefinition.modelRiskCd = form.modelRiskCd?.value!;
              optimizationDefinition.modelTaxCd = form.modelTaxCd?.value!;
              optimizationDefinition.modelTCostCd = form.modelTCostCd?.value!;
              optimizationDefinition.countryModelCd =
                form.countryModelCd?.value!;
              optimizationDefinition.esgModelCd = form.esgModelCd?.value!;
              optimizationDefinition.sectorModelCd = form.sectorModelCd?.value!;

              // —————— Strings ——————
              optimizationDefinition.objectCoefficientAlpha =
                form.alphaTermCoefficient as number;
              optimizationDefinition.objectCoefficientRisk =
                form.riskTermCoefficient as number;
              optimizationDefinition.objectCoefficientTax =
                form.taxTermCoefficient as number;
              optimizationDefinition.capitalGainsTaxRate =
                form.shortTermGainTaxRate as number;
              optimizationDefinition.nonCapitalGainsTaxRate =
                form.longTermGainTaxRate as number;
              optimizationDefinition.optimizationDefinitionName =
                form.optimizationDefinitionName;
            }

            return optimizationDefinition;
          });
          incrementPage();
        }}
      />

      <Button
        className={
          theme.theme == "light"
            ? "pop-btnNeg buttonMarginHelper"
            : "pop-btnNeg-dark-mode buttonMarginHelper"
        }
        label="Back"
        onClick={decrementPage}
      />
    </Stack>
  );

  function buttonSwitch(page: number): {
    buttons: any | null;
    styles: React.CSSProperties | null;
  } {
    switch (page) {
      case 1:
        return { buttons: definitionButtons, styles: null };
      case 2:
        return { buttons: formButtons, styles: { width: "90%" } };
      case 4:
        return { buttons: restrictionsButtons, styles: null };
      default:
        return { styles: null, buttons: null };
    }
  }
  console.log("page---------->", page);
  return (
    <>
      <ModalType
        buttonStyles={buttonSwitch(page).styles}
        buttons={buttonSwitch(page).buttons}
        incrementPage={incrementPage}
        decrementPage={decrementPage}
        type={page == 1 ? ModalTypeEnum.SMALL : ModalTypeEnum.MEDIUM}
        style={
          page === 4
            ? {
                minHeight: "60vh",
                // width: "1000px",
                overflowX: "visible",
                height: "85vh",
                background: "#F4F4F4",
              }
            : page === 2
            ? {
                minHeight: "60vh",
                background: "#F5F7F9",
                padding: "0 4rem",
                width: "55vw",
              }
            : { minHeight: "60vh", background: "#F5F7F9" }
        }
        open={page > 0 && page <= pages.length}
        closeDialog={() => {
          setPage(1);
          close();
          console.log("Close Request");
        }}
      >
        {pages[page - 1]}
      </ModalType>
    </>
  );
}
