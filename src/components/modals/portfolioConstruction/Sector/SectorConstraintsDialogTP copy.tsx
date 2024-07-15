import React, { useEffect, useState } from "react";
import { TableContainer } from "../Constraint/constraintDialogTP.tsx";
import Button from "../../../../ui-elements/buttonTP.tsx";
import {
  ConstraintDialogProps,
  portfolioHoldingSignal,
} from "../portfolioConstructionConfigTP.tsx";
//@ts-ignore
import { AccordionItem } from "@carbon/react";
import { Sector } from "../types.ts";
import {
  MappableTableAccordionProps,
  findAllTopSectors,
  findDeepestSectorLevel,
  handleAddMissingItem,
  setAllNodes,
} from "./libSectorConstraints.tsx";
import { FactorTableRow } from "../row.tsx";
import { Accordion as CarbAccordion } from "@carbon/react";
import { useAppSelector } from "../../../../store/index.ts";
import { getAccordianVisibility } from "../../../../store/nonPerstistant/selectors.ts";
import { useDispatch } from "react-redux";
import { setAccordianVisbility } from "../../../../store/nonPerstistant/index.ts";
import ImageComponent from "../../../../ui-elements/ImageComponent.tsx";

function MappableTableAccordion({
  node,
  top,
  index,
  addData,
  handleAddMissingItem,
  sets,
  marker,
}: MappableTableAccordionProps) {
  const visibility = useAppSelector(getAccordianVisibility);
  const isTrue = top ? true : false;
  const [open, setOpen] = useState(isTrue);

  const [showChildren, setShowChildren] = useState<boolean>(isTrue);

  const openFunc = () => {
    setShowChildren(!showChildren);
  };

  const [topClass, setTopClass] = useState<string>("accordHelper");
  const [rowClass, setRowClass] = useState<string>("accordHelper");

  useEffect(() => {
    if (!top) {
      openFunc();
    }
  }, [visibility]);

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

const SectorConstraintsContent: React.FC<ConstraintDialogProps> = ({
  constraintTypes,
  decrementPage,
  incrementPage,
  optimizationDefinition,
  setOptimizationDefintion,
  portfolioHolding,
  selectedPortfolio,
  setDialogState,
  setDif,
  dif,
  setPortfolioHolding,
}) => {
  const dispatch = useDispatch();
  const depth = findDeepestSectorLevel(dif?.sectorList);

  return (
    <aside style={{ width: "100%" }}>
      <aside
        style={{
          padding: "1em",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight:"0px"
        }}
      >
        <section style={{ display: "flex" }}>
          <p>Sector Constraints</p>
          <p style={{ marginLeft: "2em" }}>
            {`Sector Model Name: ${optimizationDefinition?.optimizationDefinitionName}`}
          </p>
        </section>
        <section style={{ display: "flex" }}>
          <div></div>
          <Button
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageComponent
                  style={{ width: "1.4rem" }}
                  src="expandAll.svg"
                  alt="expandAll-icon"
                />
                <p style={{ position: "relative", top: "-1px" }}>Expand All</p>
              </div>
            }
            onClick={() => {
              console.log("here");
              dispatch(setAccordianVisbility(true));
            }}
          />
          <Button
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageComponent
                  style={{ width: "1.4rem" }}
                  src="collapseAll2.svg"
                  alt="collapseAll-icon"
                />
                <p style={{ position: "relative", top: "-1px" }}>
                  Collapse All
                </p>
              </div>
            }
            onClick={() => {
              dispatch(setAccordianVisbility(false));
            }}
          />
        </section>
      </aside>

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
            {portfolioHoldingSignal.value &&
              portfolioHoldingSignal.value.sectorList && (
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
                      opt: optimizationDefinition?.constraints,
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
              )}
          </span>
        </TableContainer>
      )}
    </aside>
  );
};

export default SectorConstraintsContent;
