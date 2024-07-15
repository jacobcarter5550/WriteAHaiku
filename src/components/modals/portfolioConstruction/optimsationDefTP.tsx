/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import DraggableItem from "./draggable/draggableTP.tsx";
import Button from "../../../ui-elements/buttonTP.tsx";
import { DialogTitle } from "@mui/material";
import { useEffect } from "react";
import api from "../../../helpers/serviceTP.ts";
//@ts-ignore
import { TreeView, TreeNode } from "@carbon/react";
import DefinitionDesination from "./draggable/DefinitionDestinationTP.tsx";
import EditDraggableItem from "./draggable/editDraggableTP.tsx";
import _ from "lodash";

import {
  OptimisationDefinitionProps,
  Optimization,
} from "./portfolioConstructionConfigTP.tsx";
import { dictionaryToArray, processObject } from "./lib.ts";
import { Node, PortfolioCollection } from "./types.ts";
import { createStrategyTree, remapData } from "../lib.ts";
import { constructionFlowAccount } from "../../portfolio/grid/Grid.tsx";
import { AxiosResponse } from "axios";
import "../../../styles/optimisationDefinition.scss";
type RenderTreeProps = {
  nodes: Node[];
  expanded?: boolean;
  withIcons?: boolean;
};

export type PayloadItem = {
  accountId: number;
  strategyId: number;
  rebalanceOptDefId: number;
  cashInOptDefId: number;
  cashOutOptDefId: number;
};

export type OptimisationDefinitionHighLevel = {
  id: string;
  value: string;
  cacheIn: any;
  cacheOut: any;
  rebalance: any;
  children?: OptimisationDefinitionHighLevel[];
};

const OptimisationDefinition: React.FC<OptimisationDefinitionProps> = ({
  incrementPage,
  setOptimizationDefintion,
  edit,
  setEdit,
  nodes,
  setNodelets,
  definitions,
  setDefinitions,
  setAccounts,
}) => {
  function renderTree({
    nodes,
    expanded = true,
    withIcons = false,
  }: RenderTreeProps) {
    if (!nodes) {
      return null;
    }
    console.log(nodes);
    return nodes.map(({ children, renderIcon, value, ...nodeProps }) => {
      nodeProps.label = (
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          {value}{" "}
          <DefinitionDesination
            nodes={nodes}
            setNodes={setNodelets}
            node={nodeProps}
          />
        </span>
      );
      return (
        <TreeNode key={nodeProps.id} isExpanded={expanded} {...nodeProps}>
          {renderTree({
            nodes: children!,
            expanded,
            withIcons,
          })}
        </TreeNode>
      );
    });
  }

  function filterTreeByLeafArray(
    root: Node,
    valuesToMatch: string[]
  ): Node | undefined {
    // If the current node is a leaf
    if (!root.children || root.children.length === 0) {
      // Check if the leaf's value matches any of the specified strings
      console.log(
        root.value,
        valuesToMatch,
        valuesToMatch.some((value) => _.isEqual(root.value, value))
      );
      if (valuesToMatch.some((value) => _.isEqual(root.value, value))) {
        return root; // Return the leaf if it matches
      } else {
        console.log("TF");
        return undefined; // Return undefined if it doesn't match, indicating it should be pruned
      }
    } else {
      // If the current node is not a leaf, recursively filter its children
      const filteredChildren = root.children
        .map((child) => filterTreeByLeafArray(child, valuesToMatch))
        .filter((child): child is Node => child !== undefined); // Remove undefined values

      // If after filtering, the node has no children that lead to a matching leaf, it should also be pruned
      if (filteredChildren.length === 0) {
        return undefined;
      } else {
        // Otherwise, return a version of the node with its children filtered
        return {
          ...root,
          children: filteredChildren,
        };
      }
    }
  }

  function filterTreeByLeafValue(
    root: Node,
    valueToMatch: string
  ): Node | undefined {
    // If the current node is a leaf
    if (!root.children || root.children.length === 0) {
      // Check if the leaf's value matches the specified string
      console.log(
        root.value,
        valueToMatch,
        _.isEqual(root.value, valueToMatch)
      );
      if (_.isEqual(root.value, valueToMatch)) {
        return root; // Return the leaf if it matches
      } else {
        console.log("TF");
        return undefined; // Return undefined if it doesn't match, indicating it should be pruned
      }
    } else {
      // If the current node is not a leaf, recursively filter its children
      const filteredChildren = root.children
        .map((child) => filterTreeByLeafValue(child, valueToMatch))
        .filter((child): child is Node => child !== undefined); // Remove undefined values

      // If after filtering, the node has no children that lead to a matching leaf, it should also be pruned
      if (filteredChildren.length === 0) {
        return undefined;
      } else {
        // Otherwise, return a version of the node with its children filtered
        return {
          ...root,
          children: filteredChildren,
        };
      }
    }
  }

  function transformStrategyData(strategyData, accountDetails, definitions) {
    const transformed: OptimisationDefinitionHighLevel = {
      id: "2",
      value: "Strategy",
      cacheIn: {},
      cacheOut: {},
      rebalance: {},
      children: [],
    };

    let currentParentIndex = -1;
    strategyData.forEach((item, index) => {
      if (item.options && item.options[0] === "") {
        currentParentIndex++;
        transformed.children!.push({
          id: `2-${currentParentIndex}`,
          value: item.label,
          cacheIn: {},
          cacheOut: {},
          rebalance: {},
          children: [],
        });
      } else if (item.options) {
        const subParent: OptimisationDefinitionHighLevel = {
          id: `2-${currentParentIndex}-${index}`,
          value: item.label,
          cacheIn: {},
          cacheOut: {},
          rebalance: {},
          children: [],
        };
        transformed.children![currentParentIndex].children!.push(subParent);

        item.options.forEach((option, childIndex) => {
          subParent.children!.push({
            id: `${subParent.id}-${childIndex}`,
            value: option.label,
            cacheIn: {},
            cacheOut: {},
            rebalance: {},
          });
        });
      }
    });

    function fillInDetails(node) {
      accountDetails.forEach((account) => {
        if (node.value === account.accountFullName) {
          const rebalanceDefinition = definitions?.find(
            (d) => d.id === account.rebalOptDefId
          );
          const cashInDefinition = definitions?.find(
            (d) => d.id === account.cashInOptDefId
          );
          const cashOutDefinition = definitions?.find(
            (d) => d.id === account.cashOutOptDefId
          );

          if (rebalanceDefinition) {
            node.rebalance = {
              name: rebalanceDefinition.title,
              id: rebalanceDefinition.id,
            };
          }
          if (cashInDefinition) {
            node.cacheIn = {
              name: cashInDefinition.title,
              id: cashInDefinition.id,
            };
          }
          if (cashOutDefinition) {
            node.cacheOut = {
              name: cashOutDefinition.title,
              id: cashOutDefinition.id,
            };
          }
        }
      });

      node.children?.forEach((child) => fillInDetails(child));
    }

    fillInDetails(transformed);

    return transformed;
  }
  useEffect(() => {
    async function handleREquests() {
      let tempDefs;
      api
        .get("/optimisationdefinition/all")
        .then((res) => {
          const defsArray = dictionaryToArray(res.data);
          setDefinitions(defsArray);
          tempDefs = defsArray;
        })
        .catch((error) => {
          console.log(error);
        });

      const strategyTypes = await api.get("/optstrategytype/all");
      //@ts-ignore
      api
        .get<PortfolioCollection>("/portfolio/all")
        .then((res) => {
          let obj: Node | any = {};
          setAccounts(res.data);
          console.log(res);
          // @ts-ignore
          remapData(res.data).forEach((item: string, index: number) => {
            const proccessed = processObject(item, nodes, index);
            if (index === 0) {
              obj = proccessed.topLevelNode!;
              obj.children!.push(proccessed.middleObject);
            } else {
              obj.children!.push(proccessed.middleObject);
            }
          });

          const preFormatted = createStrategyTree(
            res.data.strategyHierarchyViews,
            // @ts-ignore
            strategyTypes.data.map((item, index) => {
              return { type: item, id: index };
            }),
            res.data.accountDetailViews
          );
          console.log(tempDefs);
          const strategies = transformStrategyData(
            preFormatted,
            res.data.accountDetailViews,
            tempDefs
          );
          console.log(strategies);

          if (constructionFlowAccount.value) {
            if (
              constructionFlowAccount.value.length > 0 &&
              typeof constructionFlowAccount.value != "string"
            ) {
              const pruned = structuredClone(strategies);
              const filtered = filterTreeByLeafArray(
                pruned,
                constructionFlowAccount.value
              );
              setNodelets([filtered!]);
            } else if (typeof constructionFlowAccount.value == "string") {
              const pruned = structuredClone(strategies);
              const filtered = filterTreeByLeafValue(
                pruned,
                constructionFlowAccount.value
              );
              setNodelets([filtered!]);
            }
          } else {
            setNodelets([strategies]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    handleREquests();
  }, []);

  const updateOptions = (definition: Optimization) => {
    setOptimizationDefintion(definition);
    incrementPage();
  };

  return (
    <>
      <DialogTitle
        textAlign="center"
        fontSize={"2rem"}
        fontWeight={"500"}
        style={{ paddingTop: "0" }}
      >
        Select Optimization Definition
      </DialogTitle>
      <div className={`optimisation-container treeHelper`}>
        <div style={{ height: "70vh" }} className="optimisation-wrapper">
          <div
            className="strategies"
            style={{ height: "100%", overflow: "scroll" }}
          >
            <TreeView hideLabel>
              {renderTree({
                nodes,
              })}
            </TreeView>
          </div>
          <div
            style={{ height: "100%", overflow: "scroll", minHeight: "410px" }}
            className="optimisations"
          >
            <ul>
              {definitions &&
                definitions.map((item: any, index: number) => {
                  // console.log(item);
                  if (typeof item.title == "string") {
                    return (
                      <DraggableItem
                        edit={edit}
                        setEdit={setEdit}
                        definitions={definitions}
                        setDefinitions={setDefinitions}
                        item={item}
                        index={index}
                        openModal={async () => {
                          const definition = (await api.get(
                            `/optimisationdefinition/${index + 1}`
                          )) as AxiosResponse<Optimization, any>;
                          setOptimizationDefintion(definition.data);
                          incrementPage();
                        }}
                      />
                    );
                  } else {
                    return (
                      <EditDraggableItem
                        edit={edit}
                        setEdit={setEdit}
                        openModal={updateOptions as any}
                        item={item}
                        index={index}
                        definitions={definitions}
                        setDefinitions={setDefinitions}
                      />
                    );
                  }
                })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default OptimisationDefinition;
