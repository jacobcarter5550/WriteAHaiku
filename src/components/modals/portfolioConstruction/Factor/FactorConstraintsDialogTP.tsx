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
        onClick={(e) => {
          e.stopPropagation();
          console.log(node, addData);
        }}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <p
          style={{
            width: "20%",
            wordWrap: "break-word",
            textOverflow: "ellipsis",
          }}
        >
          {top ? "Apply to All" : `${title}`}
        </p>
        <aside
          className="toggleHelper"
          style={{
            display: "flex",
            width: "12.5%",
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
          style={{ display: "flex", alignItems: "center", justifySelf: "end" }}
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
          <button
            onClick={() => {
              console.log("clicking");
              // handleAddMissingItem();
            }}
            style={{ backgroundColor: "blue", color: "white" }}
          >
            +
          </button>
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
      </div>
    </div>
  );
}

type TableAccordianProps = {
  index: number;
  node: Constraint;
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
}) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="arrowHelper">
      <CarbAccordion>
        <AccordionItem
          open={open}
          onHeadingClick={(e) => {
            setOpen(!open);
          }}
          onClick={(e) => {}}
          title={
            <span className="arrowHelper">
              <FactorTableRow
                filteredModels={filteredModels}
                setFilteredModels={setFilteredModels}
                node={node}
                index={index}
                setOptimizationDefintion={setOptimizationDefintion}
                optimizationDefinition={optimizationDefinition}
              />
            </span>
          }
        />
      </CarbAccordion>
    </span>
  );
};

const FactorConstraintsDialog: React.FC<FactorDialogProps> = ({
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
  console.log("000", optimizationDefinition?.constraints, optimizationDefinition);

  const [constraints, setConstraints] = useState<Constraint[] | null>(null);

  useEffect(() => {
    function constuctConstraints(consts: Constraint[]) {
      const map = consts
        .map((con) => {
          if (con.constraintTypeId) {
            con.constraintType = getKeyByValue(
              constraintTypes,
              con.constraintTypeId
            );
            // console.log(con);
            return con;
          } else {
            return undefined;
          }
        })
        .filter((con) => con !== undefined);
      return map as Constraint[];
    }
    const constructed = constuctConstraints(optimizationDefinition!.constraints);

    if (constraints == null) {
      setConstraints(constructed);
    }
  }, []);

  const [modelState, setModelState] = useState("ESG");

  const [filteredESG, setFilteredESG] = useState<Constraint[] | null>(null);
  const [filteredRisk, setFilteredRisk] = useState<Constraint[] | null>(null);

  const [missingModels, setMissingModels] = useState<
    GenericSelctionOption[] | null
  >(null);

  useEffect(() => {
    if (filteredESG == null) {
      const esgEnriched = enrichConstraints(
        optimizationDefinition!.constraints,
        esgModels
      ) as Constraint[];
      console.log("ESG", esgEnriched, esgModels);
      setFilteredESG(esgEnriched);
    }
    if (filteredRisk == null) {
      const riskEnriched = enrichConstraints(
        optimizationDefinition!.constraints,
        riskModels
      ) as Constraint[];
      console.log("RISK", riskEnriched);
      setFilteredRisk(riskEnriched);
    }
  }, []);

  const filteredModels =
    modelState === "ESG"
      ? structuredClone(filteredESG)!
      : structuredClone(filteredRisk)!;
  const setFilteredModels =
    modelState === "ESG" ? setFilteredESG : setFilteredRisk;

  const updateFilteredModels = () => {
    const currentModels = modelState === "ESG" ? esgModels : riskModels;

    const firstMissingModel = currentModels.find(
      (model) => !filteredModels.some((fm) => fm.factorId === model.id)
    );

    if (firstMissingModel) {
      const clone = structuredClone(optimizationDefinition!);
      let lastConstraint = clone.constraints.slice(-1);
      let newID = Number(lastConstraint[0].constraintId),
        added = newID + 1;
      const newModel = {
        constraintId: added.toString(), // Generate or adjust as needed
        constraintTypeId: 8, // Default value, adjust as necessary
        factorId: firstMissingModel.id,
        lowerOuter: 0,
        lowerInner: null,
        upperInner: null,
        upperOuter: 0,
        penalty: 0,
        isSoft: false,
        isAbsolute: false, // Adjust based on your requirements
        constraintType: modelState.toUpperCase(),
        title: firstMissingModel.title,
      };

      let dup = structuredClone(optimizationDefinition!);

      dup.constraints = [...dup.constraints, newModel];

      setOptimizationDefintion(dup);

      setFilteredModels([...filteredModels, newModel]);
    }
  };

  function addIndiModel(item: GenericSelctionOption) {
    const setFilteredModels =
      modelState === "ESG" ? setFilteredESG : setFilteredRisk;

    const clone = structuredClone(optimizationDefinition!);
    let lastConstraint = clone.constraints.slice(-1);
    let newID = Number(lastConstraint[0].constraintId),
      added = newID + 1;
    const newModel = {
      constraintId: added.toString(), // Generate or adjust as needed
      constraintTypeId: 8, // Default value, adjust as necessary
      factorId: item.id!,
      lowerOuter: 0,
      lowerInner: null,
      upperInner: null,
      upperOuter: 0,
      penalty: 0,
      isSoft: false,
      isAbsolute: false, // Adjust based on your requirements
      constraintType: modelState.toUpperCase(),
      title: item.title,
    };

    let dup = structuredClone(optimizationDefinition!);

    dup.constraints = [...dup.constraints, newModel];

    setOptimizationDefintion(dup);

    setFilteredModels([...filteredModels, newModel]);
    setShowModal(false);
  }

  const [holdTimer, setHoldTimer] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  function filterConstraints(constraints, scores) {
    // Extract factorId from constraints
    const factorIds = constraints.map((constraint) => constraint.factorId);

    // Filter scores not in factorIds
    const filteredScores = scores.filter(
      (score) => !factorIds.includes(score.id)
    );

    return filteredScores;
  }

  const handleMouseDown = () => {
    // Start the timer
    const timer = setTimeout(() => {
      const currentModels = modelState === "ESG" ? esgModels : riskModels;
      const currentFiltered = modelState === "ESG" ? filteredESG : filteredRisk;
      const toShow = filterConstraints(currentFiltered, currentModels);
      console.log(toShow);
      setMissingModels(toShow);

      setShowModal(true); // Show modal after 500ms
      setHoldTimer(null); // Reset timer state
    }, 500); // Adjust time as needed
    setHoldTimer(timer);
  };

  const handleMouseUp = () => {
    // Clear timer on mouse up
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleClick = (e) => {
    // Prevent the default action if it's a quick click
    if (holdTimer !== null) {
      updateFilteredModels();
      e.preventDefault(); // This prevents the click action if the mouse is quickly released
    } else {
      updateFilteredModels();
    }
  };

  const dd3Items = [
    {
      id: "option-0",
      text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      id: "option-1",
      text: "Option 1",
    },
    {
      id: "option-2",
      text: "Option 2",
    },
    {
      id: "option-3",
      text: "Option 3 - a disabled item",
      disabled: true,
    },
    {
      id: "option-4",
      text: "Option 4",
    },
  ];

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "95%",
        height: "57vh",
      }}
    >
      <div>
        <DialogTitle
          textAlign="center"
          mt="1em"
          fontSize={"2rem"}
          fontWeight={"500"}
        >
          Portfolio Construction (Object and Constraint Setup)
        </DialogTitle>
        <BootStrappedStack
          direction="row"
          style={{
            backgroundColor: "#f4f4f4",
            marginTop: "0",
            alignItems: "center",
            width: "100%",
            paddingRight: "0px",
          }}
        >
          <label
            style={{
              fontSize: "1.2rem",
              fontWeight: "500",
              marginRight: "1em",
            }}
          >
            Factor Model
          </label>
          <Select
            value={modelState}
            SelectDisplayProps={{
              style: {
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
                width: "100px",
              },
            }}
          >
            <MenuItem
              value={"ESG"}
              onClick={() => {
                modelState !== "ESG" && setModelState("ESG");
              }}
            >
              ESG
            </MenuItem>
            <MenuItem
              value={"RISK"}
              onClick={() => {
                modelState !== "RISK" && setModelState("RISK");
              }}
            >
              Risk
            </MenuItem>
          </Select>

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
            <Dropdown
              label="Style"
              defaultValue={"Style"}
              id="here"
              items={dd3Items}
            />
          </aside>

          <span
            style={{
              display: "flex",
              width: "62%",
              position: "relative",
              flexDirection: "row-reverse",
            }}
          >
            <button
              className={"pop-btn helper"}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onClick={handleClick}
            >
              +
            </button>
            {showModal && (
              <SideModal
                style={{ right: "0" }}
                close={() => {
                  // setClass && setClass("accordHelper");
                  setShowModal(!showModal);
                }}
              >
                {
                  <>
                    {missingModels?.map((item) => {
                      console.log(item);
                      return (
                        <p
                          onClick={() => {
                            console.log(item);
                            addIndiModel(item);
                          }}
                        >
                          {item.title}
                        </p>
                      );
                    })}
                  </>
                }
              </SideModal>
            )}
          </span>
        </BootStrappedStack>
        <TableContainer
          style={{
            padding: "0px",
            border: "1px solid black",
            width: "100%",
            overflow: "visible",
          }}
        >
          {modelState == "ESG"
            ? filteredESG?.map((constraint, index) => (
                <TableAccordion
                  setFilteredModels={setFilteredModels}
                  filteredModels={filteredModels}
                  index={index}
                  node={constraint}
                  section={"factorConstraints"}
                  optimizationDefinition={
                    structuredClone(optimizationDefinition)!
                  }
                  setOptimizationDefintion={setOptimizationDefintion}
                />
              ))
            : filteredRisk?.map((constraint, index) => (
                <TableAccordion
                  setFilteredModels={setFilteredModels}
                  filteredModels={filteredModels}
                  index={index}
                  node={constraint}
                  section={"factorConstraints"}
                  optimizationDefinition={
                    structuredClone(optimizationDefinition)!
                  }
                  setOptimizationDefintion={setOptimizationDefintion}
                />
              ))}
        </TableContainer>
      </div>
      <Stack
        direction="row-reverse"
        alignItems="center"
        width="100%"
        mt="1em"
        spacing={2}
      >
        <Button className={"pop-btn"} label="Next" onClick={incrementPage} />

        <Button className={"pop-btnNeg"} label="Back" onClick={decrementPage} />
      </Stack>
    </section>
  );
};

export default FactorConstraintsDialog;
