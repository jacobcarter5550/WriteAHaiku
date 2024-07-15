import { DialogTitle, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
// @ts-ignore

import {
  ConstraintTypes,
  ModelCollection,
  Optimization,
} from "../portfolioConstruction/portfolioConstructionConfigTP.tsx";
import { Classification } from "../portfolioConstruction/types.ts";
import Select from "react-select/dist/declarations/src/Select";
import SectorConstraintsEquityPMContent from "../../activeEquity/sectorConstraintsEquityPM.tsx";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import FactorConstraintsContentEquity from "../../activeEquity/FactorConstraintsDialogEquity.tsx";
import { getCurrentDateFormatted } from "../../../helpers/lib.ts";
import api from "../../../helpers/serviceTP.ts";
import { SelectOption } from "../../nav/Nav.tsx";
import { dictionaryToArray } from "../portfolioConstruction/lib.ts";
import Button from "../../../ui-elements/buttonTP.tsx";
import { useAppSelector } from "../../../store/index.ts";
import { getOverrideConfigAccount } from "../../../store/nonPerstistant/selectors.ts";

type OverrideConfigurationProps = {
  optimizationDefinition: Optimization | null;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  setPortfolioHolding: React.Dispatch<React.SetStateAction<Classification>>;
  selectedPortfolio: SelectOption;
  setDif: React.Dispatch<React.SetStateAction<Classification>>;
  dif: Classification;
  handleClose: () => void;
  open: boolean;
};

const OverrideConfiguration: React.FC<OverrideConfigurationProps> = ({
  optimizationDefinition,
  setOptimizationDefintion,
  setPortfolioHolding,
  setDif,
  dif,
  handleClose,
  open,
  selectedPortfolio,
}) => {
  const [rebalanceDefinition, setRebalanceDefinition] =
    useState<Optimization | null>(null);

  const [constraintTypes, setConstraintTypes] =
    useState<ConstraintTypes | null>(null);

  const [riskModels, setRiskModels] = useState<ModelCollection | null>(null);
  const [esgModels, setEsgModels] = useState<ModelCollection | null>(null);
  const [factorConstraints, setFactorConstraints] = useState<any>(null);

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

      Promise.all(promises).then(async (results) => {
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
      }).catch((error)=>{console.log(error)});
    }
  }, [optimizationDefinition]);

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

  async function getAccountsAndConstraints(account) {
    const res = await api.get("portfolio/all");
    const acc = res.data.accountDetailViews.find(
      (details) => details.accountFullName === account.split(" +")[0]
    );

    await api
      .get(`optimisationdefinition/${acc.rebalOptDefId}`)
      .then((resp) => {
        const dup = structuredClone(resp);
        console.log(dup);
        console.log(structuredClone(resp));

        setRebalanceDefinition(
          (prevState) => (prevState = structuredClone(resp.data))
        );
      }).catch((error)=>{console.log(error)});
  }

  const overrideConfigAccount = useAppSelector(getOverrideConfigAccount)

  useEffect(() => {
    if (overrideConfigAccount) {
      getAccountsAndConstraints(overrideConfigAccount);
    }
  }, [overrideConfigAccount]);

  console.log(rebalanceDefinition);

  const saveButton = (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="end"
      style={{ width: "95%", marginTop: "3vh" }}
    >
      <Button
        label={"Save"}
        className={"pop-btn buttonMarginHelper"}
        onClick={() => console.log("save")}
      />
    </Stack>
  );
  return (
    <>
      <ModalType
        type={ModalTypeEnum.MEDIUM}
        buttons={saveButton}
        open={open}
        // style={styles.modal}
        closeDialog={handleClose}
      >
        <aside
          style={{
            width: "95%",
            height: "100%",
            overflowX: "visible",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="portfolio-construction ">
            <DialogTitle
              textAlign="center"
              mt="1em"
              fontSize={"2rem"}
              fontWeight={"500"}
            >
              Override Configuration
            </DialogTitle>
            {rebalanceDefinition && (
              <>
                <SectorConstraintsEquityPMContent
                  optimizationDefinition={rebalanceDefinition}
                  setOptimizationDefintion={setOptimizationDefintion}
                  setDif={setDif}
                  dif={dif}
                  setPortfolioHolding={setPortfolioHolding}
                />
                <FactorConstraintsContentEquity
                  optimizationDefinition={rebalanceDefinition}
                  setOptimizationDefintion={setOptimizationDefintion}
                  constraintTypes={constraintTypes!}
                  setPortfolioHolding={setPortfolioHolding}
                  esgModels={esgModels}
                  riskModels={riskModels}
                />
              </>
            )}
          </div>
        </aside>
      </ModalType>
    </>
  );
};

export default OverrideConfiguration;
