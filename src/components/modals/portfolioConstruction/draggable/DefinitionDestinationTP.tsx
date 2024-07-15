/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import DroppableContainer from "./DroppableContainerTP.tsx";
import { extendWithDeleteProperty, extendWithUpdateProperty } from "../lib.ts";
import { useTheme } from "next-themes";
import { Node } from "../types.ts";

const DefinitionDestination: React.FC<{
  nodes: Node[];
  node: Partial<Node>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}> = ({ node, setNodes }) => {
  const theme = useTheme();
  console.log(node)

  function findNodeById(nodeId: string, nodes: Node[]) {
    // Split the nodeId into parts
    const ids = nodeId.split("-");

    // Recursive function to search for the node
    function searchNode(currentNodes: Node[], index: number) {
      if (index >= ids.length || !currentNodes) return null;

      const node =
        ids.length > 1
          ? currentNodes.find((node) => node.id === nodeId)
          : currentNodes.find((node) => node.id === ids[index]);
      if (node === undefined) {
        // If node is undefined, continue searching in the children of the current nodes
        for (let childNode of currentNodes) {
          // @ts-ignore
          const result = searchNode(childNode.children, index + 1);
          if (result !== null) {
            return result;
          }
        }
        // If no children contain the node, return null
        return null;
      } else if (index === ids.length - 1) {
        // If this is the last id part, return the found node
        return node;
      } else {
        // Otherwise, continue searching in the children
        // @ts-ignore
        return searchNode(node.children, index + 1);
      }
    }

    return searchNode(nodes, 0);
  }

   const newDoc =
    theme.theme === "light" ? "/new-document.svg" : "/dark-new-document.svg";

  const filledDoc =
    theme.theme === "light" ? "/filled-document.svg" : "/dark-filled-document.svg";
  // const newDoc = "/new-document.svg";

  // const filledDoc = "/filled-document.svg";

  function handleDrop(item: string, id: number, node: Node) {
    setNodes((prevNodes) => {
      const resultNode = findNodeById(node.id, prevNodes);

      const updateNodeAndChildren = (currentNode: Node, item: any) => {
        extendWithUpdateProperty(currentNode);
        currentNode.updateProperty!(id, item);

        if (currentNode.children) {
          currentNode.children.forEach((child) =>
            updateNodeAndChildren(child, item)
          );
        }
      };

      updateNodeAndChildren(resultNode, item);
      console.log(prevNodes);
      return [...prevNodes];
    });
  }
  function handleDeselectNode(id: number, node: Node) {
    setNodes((prevNodes) => {
      const resultNode = findNodeById(node.id, prevNodes);
      const updateNodeAndChildren = (currentNode: Node) => {
        extendWithDeleteProperty(currentNode);
        currentNode.deleteProperty!(id);
        if (currentNode.children) {
          currentNode.children.forEach((child) => updateNodeAndChildren(child));
        }
      };
      updateNodeAndChildren(resultNode);
      return [...prevNodes];
    });
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "75px",
          alignItems: "center",
        }}
      >
        <DroppableContainer
          node={node}
          id={1}
          onDrop={handleDrop}
          toolTip="Cache-in"
          handleDeselectNode={handleDeselectNode}
        >
          <img
            style={{ marginTop: ".5em" }}
            onClick={() => {
              console.log(node);
            }}
            src={Object.keys(node.cacheIn).length === 0 ? newDoc : filledDoc}
          />
        </DroppableContainer>
        <DroppableContainer
          node={node}
          id={2}
          onDrop={handleDrop}
          toolTip="Cache-out"
          handleDeselectNode={handleDeselectNode}
        >
          <img
            style={{ marginTop: ".5em" }}
            src={Object.keys(node.cacheOut).length === 0 ? newDoc : filledDoc}
          />
        </DroppableContainer>
        <DroppableContainer
          node={node}
          id={3}
          onDrop={handleDrop}
          toolTip="Rebalance"
          handleDeselectNode={handleDeselectNode}
        >
          <img
            style={{ marginTop: ".5em" }}
            src={Object.keys(node.rebalance).length === 0 ? newDoc : filledDoc}
          />
        </DroppableContainer>
      </div>
    </>
  );
};

export default DefinitionDestination;
