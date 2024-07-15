import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  DialogTitle,
  Stack,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { TableContainer } from "../Constraint/constraintDialogTP.tsx";
import Button from "../../../../ui-elements/buttonTP.tsx";
import { v4 } from "uuid";
import {
  ConstraintDialogProps,
  Optimization,
  portfolioHoldingSignal,
} from "../portfolioConstructionConfigTP.tsx";
// @ts-ignore
import { Slider, Checkbox, TextInput } from "@carbon/react";
//@ts-ignore
import { CheckboxGroup, AccordionItem } from "@carbon/react";
import { Classification, Sector } from "../types.ts";
import {
  AddData,
  MappableTableAccordionProps,
  Sets,
  findAllTopSectors,
  findDeepestSectorLevel,
  handleAddMissingItem,
  handleAddSingleMissingChild,
  handleCheckBox,
  handleRowClick,
  onPenaltyChange,
  onSliderChange,
  removeNodeFromTree,
  setAllNodes,
} from "./libSectorConstraints.tsx";
import { FactorTableRow } from "../row.tsx";
import { Accordion as CarbAccordion } from "@carbon/react";

function MappableTableAccordion({
  node,
  top,
  index,
  addData,
  handleAddMissingItem,
  sets,
  marker,
}: MappableTableAccordionProps) {
  const isTrue = top ? true : false;
  const [open, setOpen] = useState(isTrue);

  const [showChildren, setShowChildren] = useState<boolean>(isTrue);

  const openFunc = () => {
    setShowChildren(!showChildren);
  };

  const [topClass, setTopClass] = useState<string>("accordHelper");
  const [rowClass, setRowClass] = useState<string>("accordHelper");

  return (
    <>
      <AccordionItem
        className={topClass}
        open={false}
        onClick={(e) => {
          setShowChildren(!showChildren);
          setOpen(!open);
          console.log(node, top, index, addData);
        }}
        title={
          <>
            <FactorTableRow
              findAllTopSectors={() =>
                findAllTopSectors(addData?.dif!, addData?.portfolio!)
              }
              sets={sets}
              handleAddMissingItem={handleAddMissingItem}
              node={node as Sector}
              addData={addData}
              index={index}
              openFunc={openFunc}
              top={top ? top : false}
              topFunction={setAllNodes}
              setClass={setTopClass}
            />
          </>
        }
      />
      {showChildren && (
        <>
          {node.childSectors && node.childSectors.length > 0 ? (
            [
              ...node.childSectors.map((childNode, indo) => {
                console.log(childNode, indo);
                return (
                  <>
                    {indo == 0 && !top && (
                      <AccordionItem
                        className={rowClass}
                        title={
                          <FactorTableRow
                            sets={sets}
                            handleAddMissingItem={handleAddMissingItem}
                            node={node as Sector}
                            addData={addData}
                            index={index}
                            openFunc={openFunc}
                            row={true}
                            setClass={setRowClass}
                          />
                        }
                      />
                    )}
                    <MappableTableAccordion
                      node={structuredClone(childNode)}
                      sets={sets}
                      addData={addData}
                      handleAddMissingItem={handleAddMissingItem}
                      index={indo}
                      marker={marker!++}
                    />
                  </>
                );
              }),
            ]
          ) : (
            <AccordionItem
              className={rowClass}
              title={
                <FactorTableRow
                  sets={sets}
                  handleAddMissingItem={handleAddMissingItem}
                  node={node as Sector}
                  addData={addData}
                  index={index}
                  openFunc={openFunc}
                  row={true}
                  setClass={setRowClass}
                />
              }
            />
          )}
        </>
      )}
    </>
  );
}

const SectorConstraintsDialog: React.FC<ConstraintDialogProps> = ({
  constraintTypes,
  decrementPage,
  incrementPage,
  optimizationDefintion,
  setOptimizationDefintion,
  portfolioHolding,
  selectedPortfolio,
  setDialogState,
  setDif,
  dif,
  setPortfolioHolding,
}) => {
  console.log(dif);
  const depth = findDeepestSectorLevel(dif?.sectorList);
  console.log(depth);

  
  return (
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
      <div>
        <DialogTitle
          textAlign="center"
          mt="1em"
          fontSize={"2rem"}
          fontWeight={"500"}
        >
          Portfolio Construction (Object and Constraint Setup)
        </DialogTitle>

        <aside style={{ width: "100%", border: "1px solid black" }}>
          <label
            style={{
              padding: "1em",
              display: "block",
              justifyContent: "space-evenly",
            }}
          >
            <span>Sector Constraints</span>
            <span style={{ marginLeft: "2em" }}>
              {`Sector Model Name: ${optimizationDefintion?.optimizationDefinitionName}`}
            </span>
          </label>

          {dif && (
            <TableContainer
              style={{
                padding: "0px",
                border: "solid 1px black",
                overflowY: "visible",
              }}
            >
              <span className="arrowHelper">
                <CarbAccordion>
                  <MappableTableAccordion
                    sets={{
                      opt: setOptimizationDefintion,
                      port: setPortfolioHolding,
                    }}
                    node={{
                      childSectors: portfolioHoldingSignal.value!.sectorList,
                    }}
                    dif={dif}
                    setDif={setDif}
                    addData={{
                      opt: optimizationDefintion?.constraints,
                      portfolio: portfolioHoldingSignal.value!,
                      dif: dif!.sectorList,
                      maxDepth: depth,
                    }}
                    top
                    handleAddMissingItem={() => {
                      handleAddMissingItem(
                        dif,
                        structuredClone(portfolioHoldingSignal.value)!,
                        setPortfolioHolding
                      );
                    }}
                    marker={1}
                  />
                </CarbAccordion>
              </span>
            </TableContainer>
          )}
        </aside>
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
    </aside>
  );
};

export default SectorConstraintsDialog;
