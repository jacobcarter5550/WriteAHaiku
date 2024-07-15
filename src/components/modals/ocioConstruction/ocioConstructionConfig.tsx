import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../../helpers/serviceTP.ts";

import { signal } from "@preact/signals-react";
import { constructionFlowAccount } from "../../portfolio/grid/Grid.tsx";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountId } from "../../../store/portfolio/selector.ts";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import Button from "../../../ui-elements/buttonTP.tsx";
import { Stack } from "@mui/material";
import { useTheme } from "next-themes";
import { AxiosResponse } from "axios";
import { getCurrentDateFormatted } from "../../../helpers/lib.ts";
import { SelectOption } from "../../nav/Nav.tsx";
import { getForm } from "../../../store/nonPerstistant/selectors.ts";
import {
  setOpt,
  setShowOcioOptimizationDefinition,
  setShowOptimizationDefinition,
} from "../../../store/nonPerstistant/index.ts";
import { useDispatch } from "react-redux";
import {
  Classification,
  Node,
  PortfolioCollection,
} from "../portfolioConstruction/types.ts";
import {
  createPayloadForUpdate,
  dictionaryToArray,
  filterSectorsByConstraints,
  findObjectsWithCacheOrRebalance,
  generateRandomFourDigitNumber,
} from "../portfolioConstruction/lib.ts";
import { dummy2 } from "../portfolioConstruction/dummy.ts";
import PortfolioConstruction from "../portfolioConstruction/Form/portfolioConstructionTP.tsx";
import AggregateStep from "../portfolioConstruction/AggregateStep.tsx";
import RestrictDialog from "../portfolioConstruction/Restriction/restrictionsDialogTP.tsx";
import {
  ConstraintTypes,
  DialogContent,
  ModelCollection,
  Optimization,
  PartialSecurity,
} from "../portfolioConstruction/portfolioConstructionConfigTP.tsx";
import OptimisationDefinitionOcio from "./optimizationDefinitionOcio.tsx";
import OptimisationDefinition from "../portfolioConstruction/optimsationDefTP.tsx";
import OcioDefinition from "./ocioDefinition.tsx";
type ConstructionConfigProps = {
  selectedPortfolio: SelectOption | {};
};

export const portfolioHoldingSignal = signal<Classification | null>(null);

export default function OcioConstructionConfig({
  selectedPortfolio,
}: ConstructionConfigProps) {
  const dispatch = useDispatch();
  const accounts = useAppSelector(getAccountId);
  const theme = useTheme();

  function dispatchShowOptimizationDefinition(val: boolean) {
    dispatch(setShowOptimizationDefinition(val));
  }

  const [factorConstraints, setFactorConstraints] = useState<any>(null);

  const [page, setPage] = useState<number>(1);

  const [multipleAccounts, setMultipleAccounts] =
    useState<PortfolioCollection | null>(null);

  const [nodes, setNodelets] = useState<Node[]>([]);

  const [optimizationDefinition, setOptimizationDefintion] =
    useState<Optimization | null>(null);
  function dispatchShowOcioOptimizationDefinition(val: boolean) {
    dispatch(setShowOcioOptimizationDefinition(val));
  }
  const close = () => {
    dispatchShowOcioOptimizationDefinition(false);
  };

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

  const pages = [
    <OptimisationDefinitionOcio
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

    <OcioDefinition
      incrementPage={incrementPage}
      decrementPage={decrementPage}
      page={page}
      setPage={setPage}
    />,
    // <PortfolioConstruction
    //   incrementPage={incrementPage}
    //   decrementPage={decrementPage}
    //   optimizationDefinition={optimizationDefinition}
    //   setOptimizationDefintion={setOptimizationDefintion}
    // />,
    // <AggregateStep
    //   incrementPage={incrementPage}
    //   decrementPage={decrementPage}
    //   optimizationDefinition={optimizationDefinition}
    //   setOptimizationDefintion={setOptimizationDefintion}
    //   setDialogState={setDialogState}
    //   selectedPortfolio={[acct]}
    //   constraintTypes={constraintTypes}
    //   state={dialogState}
    //   setPortfolioHolding={setPortfolioHolding}
    //   portfolioHolding={portfolioHoldingSignal.value!}
    //   esgModels={esgModels}
    //   riskModels={riskModels}
    //   setDif={setDif}
    //   dif={dif}
    // />,
    // <RestrictDialog
    //   edit={edit}
    //   setEdit={setEdit}
    //   incrementPage={incrementPage}
    //   decrementPage={decrementPage}
    //   optimizationDefinition={optimizationDefinition}
    //   returnedSecurity={returnedSecurity}
    //   setReturnedSecurity={setReturnedSecurity}
    //   setOptimizationDefintion={setOptimizationDefintion}
    //   close={close}
    //   account={[acct]}
    // />,
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
    <Stack
      direction="row-reverse"
      alignItems="center"
      width="95%"
      mt="1em"
      spacing={2}
    >
      <Button
        className={"pop-btn"}
        label="Save"
        onClick={() => {
          setPage(1);
          close();
        }}
      />

      <Button
        className={
          theme.theme == "light"
            ? "pop-btnNeg buttonMarginHelper"
            : "pop-btnNeg-dark-mode buttonMarginHelper"
        }
        label="Cancel"
        onClick={() => {
          setPage(1);
          close();
        }}
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
        type={
          page == 1 || page == 2 ? ModalTypeEnum.SMALL : ModalTypeEnum.MEDIUM
        }
        style={
          page === 4
            ? {
                minHeight: "60vh",
                // width: "1000px",
                overflowX: "visible",
                height: "85vh",
                background: "#F4F4F4",
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
