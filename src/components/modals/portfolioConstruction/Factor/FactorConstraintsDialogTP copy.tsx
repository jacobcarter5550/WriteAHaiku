import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  BootStrappedStack,
  DialogSection,
  TableContainer,
  getKeyByValue,
} from "../Constraint/constraintDialogTP.tsx";

import { v4 } from "uuid";
import {
  Constraint,
  ConstraintDialogProps,
  FactorDialogProps,
  Optimization,
} from "../portfolioConstructionConfigTP.tsx";
// @ts-ignore
import { CheckboxGroup, Toggle } from "@carbon/react";
import { AccordionItem, Slider, TextInput, Dropdown } from "@carbon/react";
import { Accordion as CarbAccordion } from "@carbon/react";
import { enrichConstraints } from "../lib.ts";
import { GenericSelctionOption, Sector } from "../types.ts";
import SideModal from "../../../../ui-elements/SideModal.tsx";
import Button from "../../../../ui-elements/buttonTP.tsx";
import CustomSelect from "../../../../ui-elements/selectTP.tsx";

function setConstraint(
  value: string | number | boolean,
  field: string,
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >,
  constraint: Constraint,
  optDef: Optimization
) {
  let dup = structuredClone(optDef);
  const reconstructedConstraints = dup.constraints.map((cons) => {
    if (cons.constraintId === constraint.constraintId) {
      cons[field] = value;
      console.log(cons);
    }
    return cons;
  });
  dup.constraints = reconstructedConstraints;
  setOptimizationDefintion(dup);
}

function removeFromConstraint(
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >,
  constraint: Constraint,
  optDef: Optimization,
  setFilteredModels: React.Dispatch<React.SetStateAction<Constraint[] | null>>,
  filteredModels: Constraint[]
) {
  let clone = structuredClone(optDef);
  const removed = clone.constraints
    .map((cons) => {
      if (cons.constraintId !== constraint.constraintId) {
        return cons;
      } else {
        return undefined;
      }
    })
    .filter((cons) => cons !== undefined);
  clone.constraints = removed as Constraint[];
  let filteredClone = structuredClone(filteredModels);
  const removedFiltered = filteredClone
    .map((cons) => {
      if (cons.constraintId !== constraint.constraintId) {
        return cons;
      } else {
        return undefined;
      }
    })
    .filter((cons) => cons !== undefined);
  setFilteredModels(removedFiltered as Constraint[]);
  setOptimizationDefintion(clone);
}

interface TableRowProps {
  index?: number;
  top?: boolean;
  node: Constraint;
  addData?: any;
  sets?: any;
  handleAddMissingItem?: any;
  row?: boolean;
  optimizationDefinition: Optimization;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  filteredModels: Constraint[];
  setFilteredModels: React.Dispatch<React.SetStateAction<Constraint[] | null>>;
  findAllTopSectors?: () => Sector[];
}

export function FactorTableRow({
  node,
  index,
  top,
  addData,
  optimizationDefinition,
  setOptimizationDefintion,
  filteredModels,
  setFilteredModels,
  findAllTopSectors,
  handleAddMissingItem,
}: TableRowProps) {
  const absolute = node.isAbsolute;
  const soft = node.isSoft;

  const [absFallback, setAbsFallback] = useState<boolean>(absolute ?? false);
  const [softFallback, setSoftFallback] = useState<boolean>(soft ?? false);

  // @ts-ignore
  const title = node?.title;

  console.log(node);
  const identifier = v4();

  return (
    <div
      className={"radioHelper arrowHelper"}
      style={{
        position: "relative",
        zIndex: "3",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        // onClick={(e) => {
        //     e.stopPropagation();
        //     console.log(node, addData);
        // }}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <aside style={{ display: "flex", width: "30%" }}>
          <div
            style={{
              width: `38px`,
              flexDirection: "row-reverse",
              display: "flex",
            }}
          />
          <p
            style={{
              wordWrap: "break-word",
              textOverflow: "ellipsis",
            }}
          >
            {top ? "Apply to All" : `${title}`}
          </p>
        </aside>
        <section
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "65%",
          }}
        >
          <aside
            className="toggleHelper"
            style={{
              display: "flex",
              width: "20%",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "0.25em",
            }}
          >
            <Toggle
              size="sm"
              id={`ABS-cb${identifier}`}
              defaultToggled={absolute}
              toggled={absFallback}
              labelB="REL"
              labelA="ABS"
              onToggle={(b) => {
                setAbsFallback(b);
                setConstraint(
                  b,
                  "isAbsolute",
                  setOptimizationDefintion,
                  node,
                  optimizationDefinition
                );
              }}
            />
            <Toggle
              size="sm"
              id={`Hard-cb${identifier}`}
              defaultToggled={soft}
              toggled={softFallback}
              labelB="Soft"
              labelA={`Hard`}
              onToggle={(b) => {
                console.log(b);
                setSoftFallback(b);
                setConstraint(
                  b,
                  "isSoft",
                  setOptimizationDefintion,
                  node,
                  optimizationDefinition
                );
              }}
            />
          </aside>
          <aside style={{ display: "flex", alignItems: "center" }}>
            <p style={{ marginRight: "1vw" }}>LB/UB</p>
            <Slider
              className="sliderHelper slideHelper"
              value={10}
              unstable_valueUpper={90}
              min={0}
              max={100}
              step={1}
              hideTextInput
            />
          </aside>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifySelf: "end",
            }}
          >
            <label style={{ marginRight: "1em" }}> Penalty </label>
            <TextInput
              hideLabel
              labelText=""
              size="sm"
              className="inpHelper"
              id={`text-input-${index}`}
            />
          </div>
          {top ? (
            <img
              style={{ width: "1em" }}
              src="/add.svg"
              onClick={handleAddMissingItem}
              alt=""
            />
          ) : (
            <img
              src="/trash-can.svg"
              style={{ width: "1em" }}
              onClick={() => {
                removeFromConstraint(
                  setOptimizationDefintion,
                  node,
                  optimizationDefinition,
                  setFilteredModels,
                  filteredModels
                );
              }}
              alt=""
            />
          )}
        </section>
      </div>
      <div style={{ width: "2rem" }} />
    </div>
  );
}

type TableAccordianProps = {
  index: number;
  node: Constraint;
  esgModels: Object;
  riskModels: Object;
  section: string;
  optimizationDefinition: Optimization;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  filteredModels: Constraint[];
  setFilteredModels: React.Dispatch<React.SetStateAction<Constraint[] | null>>;
};

const TableAccordion: React.FC<TableAccordianProps> = ({
  node,
  index,
  setOptimizationDefintion,
  optimizationDefinition,
  filteredModels,
  setFilteredModels,
  esgModels,
  riskModels,
}) => {
  const [modelState, setModelState] = useState("ESG");
  const [constraint, setConstraint] = useState<object>({});
  const [open, setOpen] = useState(false);

  const handleAddFactor = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the accordion from expanding
    const currentModels = modelState === "ESG" ? esgModels : riskModels;

    const firstMissingModel = currentModels.find(
      (model) => !filteredModels.some((fm) => fm.factorId === model.id)
    );

    if (firstMissingModel) {
      const clone = structuredClone(optimizationDefinition!);
      let lastConstraint = clone.constraints.slice(-1);
      setConstraint(lastConstraint);
      let newID = Number(lastConstraint[0].constraintId),
        added = newID + 1;
      const newModel = {
        constraintId: added.toString(),
        constraintTypeId: 8,
        factorId: firstMissingModel.id,
        lowerOuter: 0,
        lowerInner: null,
        upperInner: null,
        upperOuter: 0,
        penalty: 0,
        isSoft: false,
        isAbsolute: false,
        constraintType: modelState.toUpperCase(),
        title: firstMissingModel.title,
      };

      let dup = structuredClone(optimizationDefinition!);

      dup.constraints = [...dup.constraints, newModel];

      setOptimizationDefintion(dup);
      setFilteredModels([...filteredModels, newModel]);
    }
  };

  return (
    <span className="arrowHelper">
      <CarbAccordion>
        {index === 0 && (
          <>
            <FactorTableRow
              filteredModels={filteredModels}
              setFilteredModels={setFilteredModels}
              node={constraint}
              index={1}
              handleAddMissingItem={handleAddFactor}
              top={true}
              setOptimizationDefintion={setOptimizationDefintion}
              optimizationDefinition={optimizationDefinition}
            />
            {filteredModels.length > 0 ? (
              filteredModels.map((constraint, idx) => (
                <FactorTableRow
                  key={constraint.constraintId}
                  filteredModels={filteredModels}
                  setFilteredModels={setFilteredModels}
                  node={constraint}
                  handleAddMissingItem={handleAddFactor}
                  index={idx}
                  setOptimizationDefintion={setOptimizationDefintion}
                  optimizationDefinition={optimizationDefinition}
                />
              ))
            ) : (
              <div>No factors available</div>
            )}
          </>
        )}
      </CarbAccordion>
    </span>
  );
};

const FactorConstraintsContent: React.FC<FactorDialogProps> = ({
  constraintTypes,
  decrementPage,
  incrementPage,
  optimizationDefinition,
  portfolioHolding,
  selectedPortfolio,
  setDialogState,
  state,
  esgModels,
  riskModels,
  setOptimizationDefintion,
}) => {
  const [constraints, setConstraints] = useState<Constraint[] | null>(null);
  const [modelState, setModelState] = useState("ESG");

  const [filteredESG, setFilteredESG] = useState<Constraint[] | null>(null);
  const [filteredRisk, setFilteredRisk] = useState<Constraint[] | null>(null);

  useEffect(() => {
    if (filteredESG == null) {
      const esgEnriched = enrichConstraints(
        optimizationDefinition!.constraints,
        esgModels
      ) as Constraint[];
      setFilteredESG(esgEnriched);
    }
    if (filteredRisk == null) {
      const riskEnriched = enrichConstraints(
        optimizationDefinition!.constraints,
        riskModels
      ) as Constraint[];
      setFilteredRisk(riskEnriched);
    }
  }, []);

  const filteredModels =
    modelState === "ESG"
      ? structuredClone(filteredESG)!
      : structuredClone(filteredRisk)!;
  const setFilteredModels =
    modelState === "ESG" ? setFilteredESG : setFilteredRisk;

  return (
    <>
      <BootStrappedStack
        direction="row"
        style={{
          backgroundColor: "#f4f6f8",
          marginTop: "0",
          alignItems: "center",
          width: "100%",
          paddingRight: "0px",
        }}
      >
        <label
          style={{
            width: "10rem",
            fontSize: "1.2rem",
            fontWeight: "500",
            marginRight: "1em",
          }}
        >
          Factor Model
        </label>
        <CustomSelect
          defaultValue={{ label: "ESG", value: "ESG" }}
          value={modelState}
          options={[
            { label: "ESG", value: "ESG" },
            { label: "Risk", value: "Risk" },
          ]}
          onChange={(e, val) => {
            setModelState(e.value);
          }}
          isSearchable={false}
          placeholder={modelState}
        />

        <aside
          style={{
            display: "flex",
            alignItems: "center",
            visibility: modelState === "RISK" ? "initial" : "hidden",
          }}
        >
          <label
            style={{
              fontSize: "1.2rem",
              fontWeight: "500",
              marginLeft: "1em",
              marginRight: "1em",
            }}
          >
            Factor Type
          </label>
          <Dropdown label="Style" defaultValue={"Style"} id="here" items={[]} />
        </aside>


      </BootStrappedStack>

      <TableContainer
        style={{
          padding: "0px",
          border: "1px solid rgba(0,0,0,0.15)",
          width: "100%",
          overflow: "visible",
        }}
      >
        {filteredModels?.length > 0 && (
          <TableAccordion
            setFilteredModels={setFilteredModels}
            filteredModels={filteredModels}
            index={0}
            node={filteredModels[0]}
            esgModels={esgModels}
            riskModels={riskModels}
            section={"factorConstraints"}
            optimizationDefinition={structuredClone(optimizationDefinition)!}
            setOptimizationDefintion={setOptimizationDefintion}
          />
        )}
      </TableContainer>
    </>
  );
};

export default FactorConstraintsContent;
