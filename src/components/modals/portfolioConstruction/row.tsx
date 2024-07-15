import React, { useEffect, useMemo, useState } from "react";
import {
  Optimization,
  portfolioHoldingSignal,
} from "./portfolioConstructionConfigTP.tsx";
import { v4 } from "uuid";
import { Slider, TextInput, Toggle } from "@carbon/react";
import { Classification, Sector } from "./types.ts";
import {
  AddData,
  ItemUpdateEnum,
  Sets,
  findAllMissingChildren,
  findNodeInDif,
  handleAddSectorToTree,
  handleAddSingleMissingChild,
  handleCheckBox,
  handleRowClick,
  removeNodeFromTree,
} from "./Sector/libSectorConstraints.tsx";
import SideModal from "../../../ui-elements/SideModal.tsx";
//@ts-ignore
import _ from "lodash";

interface TableRowProps {
  index?: number;
  top?: boolean;
  row?: boolean;
  node: Partial<Sector>;
  addData?: AddData;
  dif?: any;
  setDif?: any;
  handleAddMissingItem?: any;
  findAllTopSectors?: () => Sector[];
  sets: Sets;
  topFunction?: (
    type: string,
    value: boolean,
    node: Sector,
    sets: {
      opt: React.Dispatch<React.SetStateAction<Optimization | null>>;
      port: React.Dispatch<React.SetStateAction<Classification>>;
    }
  ) => void;
  openFunc?: () => void;
  setClass?: React.Dispatch<React.SetStateAction<string>>;
}

export function FactorTableRow({
  node,
  index,
  top,
  addData,
  sets,
  dif,
  handleAddMissingItem,
  row,
  setDif,
  topFunction,
  openFunc,
  setClass,
  findAllTopSectors,
}: TableRowProps) {
  const [absFallback, setAbsFallback] = useState<boolean>(false);
  const [softFallback, setSoftFallback] = useState<boolean>(false);
  // @ts-ignore
  const title = node?.sectorName;

  const [showChildren, setShowChildren] = useState<boolean>(false);

  const secLevel = node.sectorLevel !== undefined ? node.sectorLevel : 0;
  const width = secLevel * 20;
  const rowWidth = (secLevel + 1) * 20;

  const data = useMemo(() => {
    return addData!.opt?.find(
      (item: any) => item?.factorId?.toString() === node.sectorCode
    );
  }, [addData, node]);

  const [penaltyVal, setPenaltyVal] = useState<number | null>(
    data?.penalty ?? null
  );

  const absolute = useMemo(
    () =>
      data?.isAbsolute === (null || undefined) || row
        ? absFallback
        : data?.isAbsolute,
    [data, absFallback, row]
  );
  const soft =
    data?.isSoft === (null || undefined) || row ? softFallback : data?.isSoft;

  const identifier = row ? v4() : node.sectorCode;

  useEffect(() => {
    if (data && !row) {
      console.log(data.isAbsolute, absFallback);
      if (data?.isAbsolute !== absFallback) {
        setAbsFallback(data!.isAbsolute);
      }
      console.log(data.isSoft, softFallback);
      if (data?.isSoft !== softFallback) {
        setSoftFallback(data!.isSoft);
      }
    }
  }, [node]);

  const [holdTimer, setHoldTimer] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toShow, setToShow] = useState<Sector[] | null>(null);

  useEffect(() => {
    return () => {
      if (holdTimer) {
        clearTimeout(holdTimer);
      }
    };
  }, [holdTimer]);

  const handleMouseDown = () => {
    // Start the timer
    const timer = setTimeout(() => {
      if (top) {
        const items = findAllTopSectors!();
        if (items.length === 0) {
          setShowModal(true);
          setToShow(items);
        } else {
          setToShow(items);
        }
      }
      if (row) {
        setToShow(findAllMissingChildren(node as Sector, addData!));
      }
      setClass && setClass("accordHelper zHelper");
      if (!setClass) {
        console.log("none");
      }
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
      e.preventDefault(); // This prevents the click action if the mouse is quickly released
    } else {
      if (top) {
        handleAddMissingItem();
      } else if (row) {
        const response = handleAddSingleMissingChild(
          node as Sector,
          addData!,
          sets
        );
        console.log(response);
      }
    }
  };

  return (
    <>
      <div
        className={
          !data && !top && !row
            ? "radioHelper disabledHelper"
            : "radioHelper arrowHelper"
        }
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <aside style={{ display: "flex", width: "30%" }}>
            <div
              style={{
                width: row || top ? `${rowWidth}px` : `${width}px`,
                flexDirection: "row-reverse",
                display: "flex",
              }}
            />
            <p
              className={`titleHeader ${
                (node.sectorLevel == addData?.maxDepth || row) && "titleRemover"
              }`}
              onClick={(e) => {
                if (!top && !row && node.sectorLevel !== addData?.maxDepth) {
                  console.log(node.sectorLevel, addData?.maxDepth);
                  setShowChildren(!showChildren);
                  openFunc!();
                }
              }}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "90%",
                overflowWrap: "anywhere",
              }}
            >
              {top || row ? "Apply to All" : `${title}`}
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
                paddingTop: "0.5em",
              }}
            >
              <Toggle
                size="sm"
                id={`ABS-cb${identifier}`}
                defaultToggled={absolute}
                toggled={absolute}
                labelB="REL"
                labelA="ABS"
                onToggle={() => {
                  if (top) {
                    setAbsFallback((bool) => {
                      bool = !bool;
                      topFunction!("isAbsolute", bool, node as Sector, sets);
                      return bool;
                    });
                  } else if (row) {
                    setAbsFallback((bool) => {
                      bool = !bool;
                      handleRowClick(bool, "abs", node as Sector, sets);
                      return bool;
                    });
                  } else {
                    setAbsFallback(true);
                    handleCheckBox(
                      ItemUpdateEnum.ISABSOLUTE,
                      node as Sector,
                      sets,
                      row,
                      top,
                      data
                    );
                  }
                }}
              />
              <Toggle
                size="sm"
                id={`Hard-cb${identifier}`}
                toggled={soft}
                labelB="Soft"
                labelA={`Hard`}
                onToggle={() => {
                  if (top) {
                    setSoftFallback((bool) => {
                      bool = !bool;
                      topFunction!("isSoft", bool, node as Sector, sets);
                      return bool;
                    });
                  } else if (row) {
                    setSoftFallback((bool) => {
                      bool = !bool;
                      handleRowClick(bool, "soft", node as Sector, sets);
                      return bool;
                    });
                  } else {
                    setSoftFallback((bool) => !bool);
                    handleCheckBox(
                      ItemUpdateEnum.ISSOFT,
                      node as Sector,
                      sets,
                      row,
                      top,
                      data
                    );
                  }
                }}
              />
            </aside>
            <aside style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: "1vw" }}>LB/UB</p>
              <Slider
                onRelease={(e) => {
                  if (top) {
                  } else if (row) {
                  } else {
                    handleCheckBox(
                      ItemUpdateEnum.LBUB,
                      node as Sector,
                      sets,
                      row,
                      top,
                      data,
                      { upperOuter: e.valueUpper, lowerOuter: e.value }
                    );
                  }
                }}
                className="sliderHelper slideHelper"
                value={data?.lowerOuter ?? 0}
                unstable_valueUpper={data?.upperOuter ?? 100}
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
                onBlur={(e) => {
                  if (top) {
                  } else if (row) {
                  } else {
                    handleCheckBox(
                      ItemUpdateEnum.PENALTY,
                      node as Sector,
                      sets,
                      row,
                      top,
                      data,
                      { penalty: e.target.value }
                    );
                  }
                }}
                type="number"
                onChange={(e) => {
                  setPenaltyVal(Number(e.target.value));
                }}
                //@ts-ignore
                value={penaltyVal}
                hideLabel
                labelText=""
                size="sm"
                className="inpHelper"
                id={`text-input-${index}`}
              />
            </div>
            {top || row ? (
              <span style={{ display: "flex" }}>
                <img
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onClick={handleClick}
                  style={{ width: "1em" }}
                  src="/add.svg"
                  alt=""
                />
                {showModal && (
                  <SideModal
                    style={{ right: "0" }}
                    close={() => {
                      setClass && setClass("accordHelper");
                      setShowModal(!showModal);
                    }}
                  >
                    {
                      <>
                        {toShow?.map((item) => {
                          console.log(item);
                          return (
                            <p
                              onClick={() => {
                                setShowModal(false);
                                handleAddSectorToTree(
                                  structuredClone(item),
                                  structuredClone(node.sectorCode!),
                                  structuredClone(addData!),
                                  sets
                                );
                              }}
                            >
                              {item.sectorName}
                            </p>
                          );
                        })}
                      </>
                    }
                  </SideModal>
                )}
              </span>
            ) : (
              <img
                src="/trash-can.svg"
                onClick={() => {
                  const fixedTree = removeNodeFromTree(
                    node.sectorModelId,
                    node.sectorLevel,
                    node.sectorCode
                  );
                  sets.port(fixedTree!);
                  portfolioHoldingSignal.value = fixedTree;
                }}
                style={{ width: "1em" }}
                alt=""
              />
            )}
          </section>
        </div>
        <div style={{ width: "2rem" }} />
      </div>
    </>
  );
}
