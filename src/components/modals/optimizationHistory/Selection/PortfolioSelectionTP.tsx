import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "../optmHistStyle.scss";
//import DocumentIcon from '../../assests/filled-document.svg';
//import DocumentBlankIcon from '../../assests/new-document.svg';
import api from "../../../../helpers/serviceTP.ts";
//@ts-ignore
import { TreeView, TreeNode } from "@carbon/react";

import { processObject } from "../../../modals/portfolioConstruction/lib.ts";

import { StrategyType } from "../types.ts";
import { Node, PortfolioCollection } from "../../../modals/portfolioConstruction/types.ts";
import { useToastContext } from "../../../../providers/contexts/toastcontextTP.ts";

import _ from "lodash";
import { Theme } from "@carbon/react";
import { useTheme } from "next-themes";

type strategyData = {
    label: string;
    options: (
        | {
              value: number;
              label: string;
          }
        | ""
    )[];
}[];

type DefinitonSlot = {
    id: string;
    value: string;
    cacheIn: object;
    cacheOut: object;
    rebalance: object;
    children?: DefinitonSlot[];
};

type PortfolioSelectionProps = {
    selectedPorts: Node[];
    setSelectedPorts: React.Dispatch<React.SetStateAction<Node[]>>;
    nodeLets: Node[];
    setNodelets: React.Dispatch<React.SetStateAction<Node[]>>;
};

const PortfolioSelection = ({
    selectedPorts,
    setSelectedPorts,
    nodeLets,
    setNodelets,
}: PortfolioSelectionProps) => {
    const theme = useTheme();
    const [count, setCount] = useState<number>(0);

    const colorCodes = [
        {
            color: "selected",
            backgroundColor: "#f4f4f4",
        },
    ];
    const highlightBackgroundColor = (root: Node, nodeId: string) => {
        if (root) {
            if (nodeId == root.id) {
                if (!root.children || root.children == undefined) {
                    if (root.background_color) {
                        const index = Math.abs((count - 1) % 3);
                        setCount(index);
                        delete root.background_color;
                    } else {
                        root.background_color = colorCodes[0].backgroundColor;
                        const index = count + 1;
                        setCount(index);
                    }
                }
            } else if (root.children && root.children.length > 0) {
                root.children.forEach((child) => {
                    highlightBackgroundColor(child, nodeId);
                });
            }
        }
    };

    const { showToast } = useToastContext();

    const handleShowToast = () => {
        showToast("Can't select more than 3 portfolios");
    };

    const handleSelect = (nodeId: string) => {
        if (!nodeId) return;
        const nodeIdExists = selectedPorts?.some((item) => item.id === nodeId);
        if (selectedPorts?.length == 3 && !nodeIdExists) {
            handleShowToast();
            return;
        }
        const newTreeData = structuredClone(nodeLets);
        newTreeData.forEach((tree) => {
            highlightBackgroundColor(tree, nodeId);
        });
        setNodelets(newTreeData);
        let selectedPortfolios: Node[] = [];
        newTreeData.forEach((tree) => {
            getSelectedPorts(tree, selectedPortfolios);
        });
        console.log(selectedPortfolios);
        const newArray = selectedPortfolios.map((obj) => {
            console.log(obj);
            return { ...obj, name: obj.value };
        });

        if (selectedPortfolios && selectedPortfolios.length > 0) {
            setSelectedPorts(newArray);
        } else {
            setSelectedPorts([{} as Node]);
        }
    };

    const getSelectedPorts = (root: Node, ports: Node[]) => {
        if (root) {
            if (root.background_color) {
                const havingPorts = ports.filter((pt) => pt.id === root.id);
                if (!havingPorts || havingPorts.length === 0) {
                    ports.push(root);
                }
            } else if (
                typeof root.children !== "undefined" &&
                root.children &&
                root.children.length > 0
            ) {
                root.children.forEach((child) => {
                    getSelectedPorts(child, ports);
                });
            }
        }
    };

    function transformStrategyData(strategyData) {
        const transformed = {
            id: "2",
            value: "Strategy",
            cacheIn: {},
            cacheOut: {},
            rebalance: {},
            children: [] as any[],
        };

        let currentParentIndex = -1;
        strategyData.forEach((item, index) => {
            if (item.options && item.options[0] === "") {
                // Add a new parent node under Strategy
                currentParentIndex++;
                transformed.children.push({
                    id: `2-${currentParentIndex}`,
                    value: item.label,
                    cacheIn: {},
                    cacheOut: {},
                    rebalance: {},
                    children: [],
                });
            } else if (item.options) {
                // Add a new parent node under the last parent node
                const subParent = {
                    id: `2-${currentParentIndex}-${index}`,
                    value: item.label,
                    cacheIn: {},
                    cacheOut: {},
                    rebalance: {},
                    children: [] as any[],
                };
                transformed.children[currentParentIndex].children.push(subParent);

                // Add children to this new parent node
                item.options.forEach((option, childIndex) => {
                    subParent.children.push({
                        id: `${subParent.id}-${childIndex}`,
                        value: option.label,
                        cacheIn: {},
                        cacheOut: {},
                        rebalance: {},
                    });
                });
            }
        });

        return transformed;
    }

    function filterTreeByLeafValue(root: Node, valueToMatch: string): Node | undefined {
        if (!root.children || root.children.length === 0) {
            console.log(root.value, valueToMatch, _.isEqual(root.value, valueToMatch));
            if (_.isEqual(root.value, valueToMatch)) {
                return root;
            } else {
                console.log("TF");
                return undefined;
            }
        } else {
            const filteredChildren = root.children
                .map((child) => filterTreeByLeafValue(child, valueToMatch))
                .filter((child): child is Node => child !== undefined);

            if (filteredChildren.length === 0) {
                return undefined;
            } else {
                return {
                    ...root,
                    children: filteredChildren,
                };
            }
        }
    }

    interface RenderTreeProps {
        nodes: Node[];
        expanded: boolean;
        withIcons: boolean;
    }

    function renderTree({ nodes, expanded = true, withIcons = false }: RenderTreeProps) {
        if (!nodes) {
            return null;
        }

        return nodes.map(({ children, renderIcon, value, ...nodeProps }) => {
            nodeProps.label = React.createElement(
                "span",
                {
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        // backgroundColor: "red" || "transparent",
                    },
                },
                value,
                " "
            );
            return (
                <TreeNode
                    key={nodeProps.id}
                    isExpanded={expanded}
                    onSelect={() => handleSelect(nodeProps.id)}
                    className={
                        selectedPorts.some((nod) => nod.id === nodeProps.id)
                            ? "custom--tree-node--selected custom-tree-node"
                            : "custom-tree-node"
                    }
                    {...nodeProps}
                    // onToggle={() => handleToggle(nodeProps.id)}
                >
                    {renderTree({
                        nodes: children!,
                        expanded,
                        withIcons,
                    })}
                </TreeNode>
            );
        });
    }
    console.log("selectedPorts--->", selectedPorts);
    return (
        <Box sx={{ overflow: "auto", flex: 1, minWidth: 600 }}>
            <div className="container">
                <div
                    style={{
                        textAlign: "center",
                        paddingTop: 10,
                    }}
                >
                    <span id="oh_main_heading_1" style={{ fontSize: "1.2rem", fontWeight: "800" }}>
                        Select Portfolio
                        <span style={{ fontWeight: "500" }}> (up to 3 portfolios)</span>
                    </span>
                </div>
            </div>
            <TreeView hideLabel multiselect={true}>
                {renderTree({
                    nodes: nodeLets,
                    expanded: true,
                    withIcons: false,
                })}
            </TreeView>
        </Box>
    );
};

export default PortfolioSelection;
