/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { DialogTitle } from "@mui/material";
import { useEffect } from "react";
import api from "../../../helpers/serviceTP.ts";
//@ts-ignore
import { TreeView, TreeNode } from "@carbon/react";

import _ from "lodash";

import { createStrategyTree, remapData } from "../lib.ts";
import { constructionFlowAccount } from "../../portfolio/grid/Grid.tsx";
import { AxiosResponse } from "axios";
import "../../../styles/optimisationDefinition.scss";
import {
    OptimisationDefinitionProps,
    Optimization,
} from "../portfolioConstruction/portfolioConstructionConfigTP.tsx";
import EditDraggableItem from "../portfolioConstruction/draggable/editDraggableTP.tsx";
import DraggableItem from "../portfolioConstruction/draggable/draggableTP.tsx";
import { dictionaryToArray, processObject } from "../portfolioConstruction/lib.ts";
import { Node, PortfolioCollection } from "../portfolioConstruction/types.ts";
import OcioDestination from "./ocioDestination.tsx";
import DraggableItemOcio from "./draggableItemOcio.tsx";
type RenderTreeProps = {
    nodes: Node[];
    expanded?: boolean;
    withIcons?: boolean;
};
type Item = {
    id: number;
    title: string;
};
export type OptimisationDefinitionHighLevelOcio = {
    id: string;
    value: string;
    rebalance: any;
    children?: OptimisationDefinitionHighLevelOcio[];
};

const OptimisationDefinitionOcio: React.FC<OptimisationDefinitionProps> = ({
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
    function renderTree({ nodes, expanded = true, withIcons = false }: RenderTreeProps) {
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
                    <OcioDestination nodes={nodes} setNodes={setNodelets} node={nodeProps} />
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

    function filterTreeByLeafArray(root: Node, valuesToMatch: string[]): Node | undefined {
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

    function filterTreeByLeafValue(root: Node, valueToMatch: string): Node | undefined {
        // If the current node is a leaf
        if (!root.children || root.children.length === 0) {
            // Check if the leaf's value matches the specified string
            console.log(root.value, valueToMatch, _.isEqual(root.value, valueToMatch));
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
        const transformed: OptimisationDefinitionHighLevelOcio = {
            id: "2",
            value: "Strategy",
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
                    rebalance: {},
                    children: [],
                });
            } else if (item.options) {
                const subParent: OptimisationDefinitionHighLevelOcio = {
                    id: `2-${currentParentIndex}-${index}`,
                    value: item.label,
                    rebalance: {},
                    children: [],
                };
                transformed.children![currentParentIndex].children!.push(subParent);

                item.options.forEach((option, childIndex) => {
                    subParent.children!.push({
                        id: `${subParent.id}-${childIndex}`,
                        value: option.label,
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
            api.get("/optimisationdefinition/all")
                .then((res) => {
                    const defsArray = dictionaryToArray(res.data);
                    const modifiedArray = defsArray.map((item: Item) => {
                        const newTitle = `ACIO definition ${item.id}`;
                        return {
                            ...item,
                            title: newTitle,
                        };
                    });
                    setDefinitions(modifiedArray);
                    tempDefs = defsArray;
                })
                .catch((error) => {
                    console.log(error);
                });

            const strategyTypes = await api.get("/optstrategytype/all");
            //@ts-ignore
            api.get("/portfolio/all")
                .then((res: AxiosResponse<PortfolioCollection, any>) => {
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
                        // @ts-ignore
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
                Portfolio to ACIO Copilot Assignment{" "}
            </DialogTitle>
            <div className={`optimisation-container treeHelper`}>
                <div style={{ height: "70vh", overflow: "auto" }} className="optimisation-wrapper">
                    <div className="strategies" style={{ height: "100%", overflow: "scroll" }}>
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
                                            <DraggableItemOcio
                                                edit={edit}
                                                setEdit={setEdit}
                                                definitions={definitions}
                                                setDefinitions={setDefinitions}
                                                item={item}
                                                index={index}
                                                openModal={() => {
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

export default OptimisationDefinitionOcio;