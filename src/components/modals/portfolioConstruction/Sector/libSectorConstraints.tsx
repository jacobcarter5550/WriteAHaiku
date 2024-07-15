import { ChangeEvent } from "react";
import findId from "../lib.ts";
import { toast } from "react-toastify";
import {
  Constraint,
  Optimization,
  portfolioHoldingSignal,
} from "../portfolioConstructionConfigTP.tsx";
import { Classification, Sector } from "../types.ts";

export interface Sets {
  opt: React.Dispatch<React.SetStateAction<Optimization | null>>;
  port: React.Dispatch<React.SetStateAction<Classification>>;
}

export interface AddData {
  opt: Constraint[] | undefined;
  portfolio: Classification;
  dif: Sector[];
  maxDepth: number;
}

export interface MappableTableAccordionProps {
  node: Partial<Sector>;
  top?: boolean;
  index?: number;
  addData?: AddData;
  dif?: any;
  setDif?: any;
  handleAddMissingItem?: any;
  sets: Sets;
  marker?: number;
}

export function setAllNodes(
  type: string,
  value: boolean,
  node: Sector,
  sets: Sets
) {
  const reValue = value === (null || undefined) ? false : value;
  // @ts-ignore
  sets.opt((prev) => {
    return {
      ...prev,
      constraints: prev!.constraints.map((item) => {
        if (
          item &&
          node.childSectors &&
          node.childSectors.find(
            (child) => child.sectorCode === item.factorId?.toString()
          )
        ) {
          console.log("found");
          if (type === "isSoft") {
            item.isSoft = reValue;
            console.log(item, reValue, type);
            return item;
          } else {
            item.isAbsolute = reValue;
            return item;
          }
        } else {
          return item;
        }
      }),
    };
  });
}

export function handleRowClick(
  boolean: boolean,
  type: string,
  node: Sector,
  sets: Sets
) {
  sets.opt(
    (prevState) =>
      prevState && {
        ...prevState,
        constraints: prevState.constraints.map((item) => {
          if (
            node.childSectors!.find(
              (nodeChild) => nodeChild.sectorCode === item.factorId?.toString()
            )
          ) {
            if (type === "abs") {
              item.isAbsolute = boolean;
              return item;
            } else {
              item.isSoft = boolean;
              return item;
            }
          } else {
            return item;
          }
        }),
      }
  );
}

export const handleAddMissingItem = (
  dif: Classification | undefined,
  portfolioHolding: Classification,
  setPortfolioHolding: React.Dispatch<React.SetStateAction<Classification>>
) => {
  if (!dif) return;
  if (dif.sectorList.length === portfolioHolding.sectorList.length) {
    console.log("No missing items");
    console.log(dif.sectorList, portfolioHolding.sectorList);
    return;
  }
  const dup = structuredClone(portfolioHoldingSignal.value);

  if (dup) {
    const nextItemToAdd = dif.sectorList.find(
      (difItem) =>
        !portfolioHolding.sectorList.some(
          (portfolioItem) => portfolioItem.sectorCode === difItem.sectorCode
        )
    );

    // If such an item is found, add it to portfolioHolding.sectorList
    if (nextItemToAdd !== undefined) {
      const itemToAdd: Sector = {
        ...nextItemToAdd,
        childSectors: [],
      };

      const itemToAddSig: Sector = {
        ...nextItemToAdd,
        childSectors: [],
      };

      portfolioHoldingSignal.value = {
        ...dup,
        sectorList: [...dup.sectorList, itemToAddSig],
      };

      setPortfolioHolding((prevState: Classification) => {
        const newState = {
          ...prevState!,
          sectorList: [...prevState.sectorList, itemToAdd], // Add the missing item
        };

        return newState;
      });
    }
    // Find the first item in dif.sectorList not present in portfolioHolding.sectorList by factorId
  }
};

export const updateSectorChildren = (
  sectors: Sector[],
  targetCode: string,
  newChild: Sector,
  node: Sector,
  addData: AddData
): Sector[] => {
  const newMap = sectors.map((sector) => {
    const cloneone = structuredClone(sector);
    if (cloneone.sectorCode === targetCode) {
      const returnObject = {
        ...cloneone,
        childSectors: [...(cloneone.childSectors || []), newChild],
      };
      return structuredClone(returnObject);
    } else if (cloneone.childSectors) {
      return structuredClone({
        ...cloneone,
        childSectors: updateSectorChildren(
          cloneone.childSectors,
          targetCode,
          newChild,
          node,
          addData
        ),
      });
    } else {
      return cloneone;
    }
  });

  return newMap;
};

export const findMatchingItemOrChildren = (list, sectorCode) => {
  for (const item of list) {
    if (item.sectorCode === sectorCode) {
      return item;
    } else if (item.childSectors && item.childSectors.length > 0) {
      const foundInChildren = findMatchingItemOrChildren(
        item.childSectors,
        sectorCode
      );
      if (foundInChildren) return foundInChildren;
    }
  }
  return null; // Return null if no match is found
};

export enum ItemUpdateEnum {
  ISSOFT = "isSoft",
  ISABSOLUTE = "isAbsolute",
  LBUB = "lb/ub",
  PENALTY = "penalty",
}

export function handleCheckBox(
  type: ItemUpdateEnum,
  node: Sector,
  sets: Sets,
  row?: boolean,
  top?: boolean,
  data?: Constraint,
  passedData?: any
) {
  // Recursive function to find the matching item or its children

  // Case when top is true and data is undefined or null
  if ((top && !data) || (!top && !data)) {
    const bools =
      type == ItemUpdateEnum.ISSOFT
        ? { isSoft: true, isAbsolute: false }
        : { isSoft: false, isAbsolute: true };

    const newConstraint: Constraint = {
      constraintId: "20",
      constraintTypeId: 3,
      factorId: parseInt(node.sectorCode, 10), // Assuming sectorCode is always a string that can be converted to a number
      lowerOuter: 0,
      lowerInner: null,
      upperInner: null,
      upperOuter: 100,
      penalty: 0,
      ...bools,
      constraintType: "Level1",
    };

    sets.opt(
      (prevState) =>
        prevState && {
          ...prevState,
          constraints: [...prevState.constraints, newConstraint],
        }
    );
  }

  // Case when top is false and data is defined
  if (!top && data && !row) {
    let updatedData = findMatchingItemOrChildren(
      portfolioHoldingSignal.value!.sectorList,
      data.factorId!.toString()
    );

    if (updatedData) {
      // Existing logic to toggle 'isSoft' and 'isAbsolute'
      if (
        type === ItemUpdateEnum.ISSOFT ||
        type === ItemUpdateEnum.ISABSOLUTE
      ) {
        if (type === ItemUpdateEnum.ISSOFT) {
          updatedData.isSoft =
            updatedData.isSoft != null ? !updatedData.isSoft : true;
        } else if (type === ItemUpdateEnum.ISABSOLUTE) {
          updatedData.isAbsolute =
            updatedData.isAbsolute != null ? !updatedData.isAbsolute : true;
        }
      } else if (type === ItemUpdateEnum.LBUB && passedData) {
        // Handle 'lb/ub' type
        if ("lowerOuter" in passedData && "upperOuter" in passedData) {
          updatedData.lowerOuter = passedData.lowerOuter;
          updatedData.upperOuter = passedData.upperOuter;
        }
      } else if (type === ItemUpdateEnum.PENALTY && passedData) {
        // Handle 'penalty' type
        if ("penalty" in passedData) {
          updatedData.penalty = passedData.penalty;
        }
      }

      // Update the constraints in sets with the updatedData
      console.log(updatedData);
      sets.opt(
        (prevState) =>
          prevState && {
            ...prevState,
            constraints: prevState.constraints.map((item) => {
              if (item.factorId?.toString() === updatedData.sectorCode) {
                if (
                  type === ItemUpdateEnum.ISABSOLUTE ||
                  type === ItemUpdateEnum.ISSOFT ||
                  type === ItemUpdateEnum.LBUB ||
                  type === ItemUpdateEnum.PENALTY
                ) {
                  return { ...item, ...updatedData };
                }
                return item;
              } else {
                return item;
              }
            }),
          }
      );
    }
  }
}

export const findNodeInDif = (
  sectors: Sector[],
  sectorCode: string
): Sector | undefined => {
  for (const sector of sectors) {
    if (sector.sectorCode === sectorCode) {
      return sector;
    }
    const foundInChild = findNodeInDif(sector.childSectors, sectorCode);
    if (foundInChild) return foundInChild;
  }
  return undefined;
};

export const handleAddSingleMissingChild = (
  node: Sector,
  addData: AddData,
  sets: Sets
) => {
  console.log(node);
  const difNode = findNodeInDif(addData!.dif, node.sectorCode);
  if (!difNode) return;

  const missingChild = difNode.childSectors.find(
    (difChild) =>
      !node.childSectors.some(
        (nodeChild) => nodeChild.sectorCode === difChild.sectorCode
      )
  );

  if (!missingChild) {
    console.log("No more factors to add");
    toast.info("No more factors to add");
    return;
  }
  console.log(missingChild);

  const newChild = {
    ...missingChild,
    childSectors: [],
  };

  const newSectorList = updateSectorChildren(
    addData?.portfolio!.sectorList!,
    node.sectorCode,
    newChild,
    node,
    addData!
  );
  sets.port({ sectorList: structuredClone(newSectorList), messages: "" });

  portfolioHoldingSignal.value = {
    sectorList: structuredClone(newSectorList),
    messages: "",
  };
};

export const findAllMissingChildren = (
  node: Sector,
  addData: AddData
): Sector[] => {
  console.log(node);
  // Find the corresponding node in the differential data structure
  const difNode = findNodeInDif(addData.dif, node.sectorCode);
  if (!difNode) {
    // If no corresponding node is found, return an empty array indicating no missing children
    return [];
  }

  // Filter out children present in difNode but missing from the node
  const missingChildren = difNode.childSectors.filter(
    (difChild) =>
      !node.childSectors.some(
        (nodeChild) => nodeChild.sectorCode === difChild.sectorCode
      )
  );

  // Return the list of missing children
  return missingChildren;
};

export const findAllTopSectors = (
  dif: Sector[] | undefined,
  portfolioHolding: Classification
): Sector[] => {
  // Return an empty array if dif is undefined or if there are no missing items
  if (!dif || dif.length === portfolioHolding.sectorList.length) {
    console.log("No missing items");
    toast.info("No Missing Items");
    return [];
  }

  // Find all sectors present in dif but missing from portfolioHolding
  const missingSectors = dif.filter(
    (difItem) =>
      !portfolioHolding.sectorList.some(
        (portfolioItem) => portfolioItem.sectorCode === difItem.sectorCode
      )
  );

  // Return the list of missing sectors
  return missingSectors;
};

export const handleAddSectorToTree = (
  newSector: Sector,
  parentNodeSectorCode: string,
  addData: AddData,
  sets: Sets
) => {
  console.log(newSector, parentNodeSectorCode);
  // Attempt to find the parent node in the portfolio's sector list
  let parentNode = findNodeInDif(
    addData?.portfolio!.sectorList!,
    parentNodeSectorCode
  );

  // If parent node is not found, add newSector to the top level of sectorList
  if (!parentNode) {
    console.error("Parent node not found, adding sector to top level");
    const updatedSectorList = [
      ...addData.portfolio.sectorList,
      { ...newSector, childSectors: [] }, // Initialize childSectors as empty
    ];

    // Update the states for top-level addition
    sets.port({ sectorList: structuredClone(updatedSectorList), messages: "" });
    portfolioHoldingSignal.value = {
      sectorList: structuredClone(updatedSectorList),
      messages: "",
    };
    return;
  }

  // Check if the new sector is already a child of the parent node
  const isAlreadyChild = parentNode.childSectors.some(
    (child) => child.sectorCode === newSector.sectorCode
  );
  if (isAlreadyChild) {
    console.log("Sector already exists as a child");
    return;
  }

  // Add the new sector as a child of the parent node
  const updatedChildSectors = [
    ...parentNode.childSectors,
    { ...newSector, childSectors: [] },
  ];
  parentNode.childSectors = updatedChildSectors;

  // Update the entire sector list recursively
  const updatedSectorList = updateSectorChildrenSecondary(
    addData?.portfolio!.sectorList!,
    parentNodeSectorCode,
    newSector,
    parentNode,
    addData!
  );

  // Update the states
  sets.port({ sectorList: structuredClone(updatedSectorList), messages: "" });
  portfolioHoldingSignal.value = {
    sectorList: structuredClone(updatedSectorList),
    messages: "",
  };
};

export function findDeepestSectorLevel(data) {
  let maxLevel = 0;

  function traverse(node) {
    // Update maxLevel if the current node's sectorLevel is greater
    if (node.sectorLevel > maxLevel) {
      maxLevel = node.sectorLevel;
    }

    // If the node has children, recursively traverse them
    const children = node.childSectors || [];
    children?.forEach(traverse);
  }

  // Start the traversal from the root node(s)
  data?.forEach(traverse);

  return maxLevel;
}

export function removeNodeFromTree(sectorModelId, sectorLevel, sectorCode) {
  const findAndRemoveNode = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      // Check if the current node is the one to remove
      if (
        node.sectorModelId === sectorModelId &&
        node.sectorLevel === sectorLevel &&
        node.sectorCode === sectorCode
      ) {
        // Remove the node from the array
        nodes.splice(i, 1);
        return true; // Node found and removed
      }
      // Otherwise, recurse on childSectors
      if (node.childSectors && findAndRemoveNode(node.childSectors)) {
        return true; // Node found and removed in a recursive call
      }
    }
    return false; // Node not found in this branch
  };

  // Assuming portfolioHoldingSignal is a signal containing the tree,
  // and we can get its current value and set a new one directly.
  // This is a generic approach; adapt the get/set mechanism as needed for your framework.
  const currentTree = structuredClone(portfolioHoldingSignal.value); // Get the current tree from the signal
  findAndRemoveNode(currentTree?.sectorList);

  return currentTree;
}

export const onPenaltyChange = (
  e: ChangeEvent<HTMLInputElement>,
  addData: AddData,
  sets: Sets,
  thisConstaint: Constraint
) => {
  sets.opt(
    (prevState) =>
      prevState && {
        ...prevState,
        constraints: prevState.constraints.map((item) => {
          if (item.factorId === thisConstaint.factorId) {
            item.penalty = parseInt((e.target as HTMLInputElement).value);
            return item;
          } else {
            return item;
          }
        }),
      }
  );
};
export const onSliderChange = (
  e: {
    value: number;
    valueUpper: number | undefined;
  },
  sets: Sets,
  thisConstaint: Constraint
) => {
  if (thisConstaint) {
    sets.opt(
      (prevState) =>
        prevState && {
          ...prevState,
          constraints: prevState.constraints.map((item) => {
            if (item?.factorId === thisConstaint?.factorId) {
              item.upperOuter = e.value;
              return item;
            } else {
              return item;
            }
          }),
        }
    );
  }
};

export const updateSectorChildrenSecondary = (
  sectors: Sector[],
  targetCode: string,
  newChild: Sector,
  node: Sector,
  addData: AddData
): Sector[] => {
  return sectors.map((sector) => {
    // No need to clone here if we're going to potentially replace childSectors or return a modified sector.
    if (sector.sectorCode === targetCode) {
      // Check if the newChild is already a child to prevent duplicates
      const childAlreadyExists = sector.childSectors.some(
        (child) => child.sectorCode === newChild.sectorCode
      );

      if (!childAlreadyExists) {
        // Only add newChild if it does not already exist
        return {
          ...sector,
          childSectors: [...sector.childSectors, newChild],
        };
      }
      // Return the sector unmodified if newChild already exists
      return sector;
    }

    // If not the target sector, but has children, recurse into childSectors
    if (sector.childSectors.length > 0) {
      return {
        ...sector,
        childSectors: updateSectorChildrenSecondary(
          sector.childSectors,
          targetCode,
          newChild,
          node,
          addData
        ),
      };
    }

    // If not the target sector and no children to recurse into, return sector as is
    return sector;
  });
};
