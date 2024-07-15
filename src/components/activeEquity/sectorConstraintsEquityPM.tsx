import React, { useState } from "react";

//@ts-ignore
import { AccordionItem } from "@carbon/react";

import { Accordion as CarbAccordion } from "@carbon/react";
import {
  MappableTableAccordionProps,
  findAllTopSectors,
  findDeepestSectorLevel,
  handleAddMissingItem,
  setAllNodes,
} from "../modals/portfolioConstruction/Sector/libSectorConstraints.tsx";
import { FactorTableRow } from "../modals/portfolioConstruction/row.tsx";
import {
  ConstraintDialogProps,
  Optimization,
  portfolioHoldingSignal,
} from "../modals/portfolioConstruction/portfolioConstructionConfigTP.tsx";
import { TableContainer } from "../modals/portfolioConstruction/Constraint/constraintDialogTP.tsx";
import {
  Classification,
  Sector,
} from "../modals/portfolioConstruction/types.ts";
import { portfolioHoldingSignalEquity } from "./overrideConstructionConfig.tsx";

export type ConstraintDialogEquityPMProps = {
  optimizationDefinition: Optimization | null;
  setOptimizationDefintion: React.Dispatch<
    React.SetStateAction<Optimization | null>
  >;
  dif?: Classification;
  setDif?: React.Dispatch<React.SetStateAction<Classification>>;
  setPortfolioHolding: React.Dispatch<React.SetStateAction<Classification>>;
};
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

const SectorConstraintsEquityPMContent: React.FC<
  ConstraintDialogEquityPMProps
> = ({
  optimizationDefinition,
  setOptimizationDefintion,
  setDif,
  dif,
  setPortfolioHolding,
}) => {
  console.log(optimizationDefinition);
  const depth = findDeepestSectorLevel(dif?.sectorList);

  return (
    <aside style={{ width: "100%", marginBottom: "1rem" }}>
      <label
        style={{
          padding: "1em",
          display: "block",
          justifyContent: "space-evenly",
          border: "1px solid #C8C9CA",
          marginBottom: "1rem",
          backgroundColor: "#fff",
        }}
      >
        <span>Portfolio Constraints</span>
        <span style={{ marginLeft: "2em" }}>
          {`Portfolio Name: ${optimizationDefinition?.optimizationDefinitionName}`}
        </span>
      </label>

      {dif && (
        <TableContainer
          style={{
            padding: "0px",
            borderRight: "solid 1px rgba(0,0,0,0.15)",
            borderLeft: "solid 1px rgba(0,0,0,0.15)",
            overflowY: "visible",
          }}
        >
          <span className="arrowHelper">
            {portfolioHoldingSignalEquity?.value?.sectorList && (
              <CarbAccordion>
                <MappableTableAccordion
                  sets={{
                    opt: setOptimizationDefintion,
                    port: setPortfolioHolding,
                  }}
                  node={{
                    childSectors:
                      portfolioHoldingSignalEquity?.value?.sectorList,
                  }}
                  dif={dif}
                  setDif={setDif}
                  addData={{
                    opt: optimizationDefinition?.constraints,
                    portfolio: portfolioHoldingSignalEquity.value!,
                    dif: dif!.sectorList,
                    maxDepth: depth,
                  }}
                  top
                  handleAddMissingItem={() => {
                    handleAddMissingItem(
                      dif,
                      structuredClone(portfolioHoldingSignalEquity.value)!,
                      setPortfolioHolding
                    );
                  }}
                  marker={1}
                />
              </CarbAccordion>
            )}
          </span>
        </TableContainer>
      )}
    </aside>
  );
};

export default SectorConstraintsEquityPMContent;
