import React, { useState } from "react";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import { getShowNewAccountCreation } from "../../../store/nonPerstistant/selectors.ts";
import { setNewAccountCreation } from "../../../store/nonPerstistant/index.ts";
import { useAppSelector } from "../../../store/index.ts";
import { useDispatch } from "react-redux";
import { Stack } from "@mui/material";
import Button from "../../../ui-elements/buttonTP.tsx";
import AccountSetupFirst from "./AccountSetupFirst.tsx";
import AccountSetupSecond from "./AccountSetupSecond.tsx";
import { useTheme } from "next-themes";
import OptimisationDefinitionOcio from "../ocioConstruction/optimizationDefinitionOcio.tsx";
import AccountSetupThird from "./AccountSetupThird.tsx";
import { Optimization } from "../portfolioConstruction/portfolioConstructionConfigTP.tsx";
import { PortfolioCollection } from "../portfolioConstruction/types.ts";

type NewAccountCreationProps = {};

const NewAccountCreation = (props: NewAccountCreationProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const showNewAccountCreationModal = useAppSelector(getShowNewAccountCreation);
  const [accountSetupStep, setAccountSetupStep] = React.useState<number>(1);
  const [optimizationDefinition, setOptimizationDefintion] =
    useState<Optimization | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [nodes, setNodelets] = useState<Node[]>([]);
  const [definitions, setDefinitions] = useState<any>();
  const [multipleAccounts, setMultipleAccounts] =
    useState<PortfolioCollection | null>(null);

  const onCloseHandler = () => {
    dispatch(setNewAccountCreation(false));
  };

  const StepButtons1 = (
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
          onClick={() => setAccountSetupStep((prev) => prev + 1)}
          style={{
            height: "2.7rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
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
          className={
            theme.theme == "light" ? "pop-btnNeg" : "pop-btnNeg-dark-mode"
          }
          label="Cancel"
          onClick={() => {
            setAccountSetupStep(1);
            onCloseHandler();
          }}
          style={{
            height: "2.7rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <Button
          className={"pop-btn"}
          label="Next"
          onClick={() => setAccountSetupStep((prev) => prev + 1)}
          style={{
            height: "2.7rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </aside>
    </div>
  );
  const StepButtons2 = (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="end"
      style={{ width: "95%", marginTop: "3vh" }}
    >
      <Button
        className={
          theme.theme == "light" ? "pop-btnNeg" : "pop-btnNeg-dark-mode"
        }
        label="Back"
        onClick={() => {
          setAccountSetupStep((prev) => prev - 1);
        }}
        style={{
          height: "2.7rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      <Button
        className={"pop-btn"}
        label="Next"
        onClick={() => setAccountSetupStep((prev) => prev + 1)}
        style={{
          height: "2.7rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </Stack>
  );

  const StepButtons3 = (
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
          onClick={() => console.log("working")}
          style={{ height: "2.7rem" }}
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
          label={"Back"}
          className={
            theme.theme == "light"
              ? "pop-btnNeg buttonMarginHelper"
              : "pop-btnNeg-dark-mode buttonMarginHelper"
          }
          onClick={() => setAccountSetupStep((prev) => prev - 1)}
          style={{ height: "2.7rem" }}
        />
        <Button
          label={"Save"}
          className={"pop-btn buttonMarginHelper"}
          onClick={() => console.log("working")}
          style={{ height: "2.7rem" }}
        />
      </aside>
    </div>
  );

  const accountSetupSwitch = (step: number) => {
    switch (step) {
      case 1:
        return { buttons: StepButtons1 };
      case 2:
        return { buttons: StepButtons2 };
      case 3:
        return { buttons: StepButtons3 };
    }
  };

  return (
    <div className="new-account-creation-modal-container">
      <ModalType
        open={showNewAccountCreationModal}
        closeDialog={onCloseHandler}
        type={ModalTypeEnum.SMALL}
        buttons={accountSetupSwitch(accountSetupStep)?.buttons}
        style={{ width: "42vw" }}
      >
        {accountSetupStep === 1 ? (
          <AccountSetupFirst />
        ) : accountSetupStep === 2 ? (
          <AccountSetupSecond />
        ) : (
          <AccountSetupThird
            setOptimizationDefintion={setOptimizationDefintion}
            edit={edit}
            setEdit={setEdit}
            nodes={nodes}
            setNodelets={setNodelets}
            definitions={definitions}
            setDefinitions={setDefinitions}
            setAccounts={setMultipleAccounts}
          />
        )}
      </ModalType>
    </div>
  );
};

export default NewAccountCreation;
