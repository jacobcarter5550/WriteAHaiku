import { Option } from "../../types/types";
import {
  AdditionalAttributeMap,
  ClassificationHoldingView,
  Node,
} from "./portfolioTypes";
export function sumWeights(node: { [key: string]: any }): {
  preOptimizationWeight: number;
  postOptimizationWeight: number;
  tradingWeight: number;
} {
  let sums = {
    preOptimizationWeight: 0,
    postOptimizationWeight: 0,
    tradingWeight: 0,
  };

  if (node.hasOwnProperty("securityName")) {
    sums.preOptimizationWeight += node.preOptimizationWeight || 0;
    sums.postOptimizationWeight += node.postOptimizationWeight || 0;
    sums.tradingWeight += node.tradingWeight || 0;
  } else if (node.classificationHoldingViews) {
    for (const child of node.classificationHoldingViews) {
      const childSums = sumWeights(child);
      sums.preOptimizationWeight += childSums.preOptimizationWeight;
      sums.postOptimizationWeight += childSums.postOptimizationWeight;
      sums.tradingWeight += childSums.tradingWeight;
    }
  } else if (node.assetClassHoldingViews) {
    for (const child of node.assetClassHoldingViews) {
      const childSums = sumWeights(child);
      sums.preOptimizationWeight += childSums.preOptimizationWeight;
      sums.postOptimizationWeight += childSums.postOptimizationWeight;
      sums.tradingWeight += childSums.tradingWeight;
    }
  } else if (node.accountHoldingViews) {
    for (const child of node.accountHoldingViews) {
      sums.preOptimizationWeight += child.preOptimizationWeight || 0;
      sums.postOptimizationWeight += child.postOptimizationWeight || 0;
      sums.tradingWeight += child.tradingWeight || 0;
    }
  }

  if (node.top) {
    sums.postOptimizationWeight /= 100;
    sums.preOptimizationWeight /= 100;
    sums.tradingWeight /= 100;
  }

  return sums;
}

export const appendDataPathToRow = <T extends { [key: string]: any }>(
  data: T[],
  key: string,
  listName: string
) => {
  const flattenedData: T[] = [];

  const flattenRowRecursive = (row: T, parentPath: string[]) => {
    if (row["securityName"] && key === "assetClassName") {
      //@ts-ignore
      row["assetClassName"] = row["securityName"];
    }

    const dataPath = [...parentPath, row[key]];
    flattenedData.push({ ...row, dataPath });

    if (row[listName]) {
      row[listName].forEach((underling: T) => {
        flattenRowRecursive(underling, dataPath);
      });
    }

    if (row.accountHoldingViews) {
      row.accountHoldingViews.forEach((underling: T) => {
        flattenRowRecursive(underling, dataPath);
      });
    } else if (row.assetClassHoldingViews) {
      const { postOptimizationWeight, preOptimizationWeight, tradingWeight } =
        sumWeights(row);
      flattenedData[flattenedData.length - 1] = {
        ...flattenedData[flattenedData.length - 1],
        postOptimizationWeight,
        preOptimizationWeight,
        tradingWeight,
      };
    }
  };

  data.forEach((row) => flattenRowRecursive(row, []));
  return flattenedData;
};
export function filterTree(data: Node[]): Node[] {
  // Determines if a node or any of its children have leaves
  function hasLeaves(node: Node): boolean {
    if (node.accountHoldingViews) {
      // Node itself is a leaf
      return true;
    } else if (
      node.classificationHoldingViews &&
      Array.isArray(node.classificationHoldingViews)
    ) {
      // Check children for leaves
      return node.classificationHoldingViews.some(hasLeaves);
    }
    // Node has no leaves
    return false;
  }

  // Filters and retains branches with leaves, including leaves themselves
  function filterBranches(node: Node): Node | null {
    if (!node) return null;

    if (node.accountHoldingViews) {
      // Node itself is a leaf, return as is
      return node;
    } else if (
      node.classificationHoldingViews &&
      Array.isArray(node.classificationHoldingViews)
    ) {
      // It's a branch, filter its children
      let filteredChildren = node.classificationHoldingViews
        .filter(hasLeaves)
        .map(filterBranches);
      if (filteredChildren.length > 0) {
        // If there are valid children, keep this branch
        return {
          ...node,
          classificationHoldingViews: filteredChildren as Node[],
        };
      } else {
        // No valid children, this branch is removed
        return null;
      }
    }
    // If it doesn't match above, it's an edge case or error
    return null;
  }

  // Start by filtering the top-level nodes
  let filteredData = data.filter(hasLeaves);

  // Apply the filtering down through the branches
  return filteredData
    .map(filterBranches)
    .filter((node) => node !== null) as Node[];
}

export function decimalToPercentage(decimal: number): string {
  // Multiply the decimal by 100 to convert to percentage
  let percentage = decimal * 100;
  return percentage.toFixed(3) + "%"; // Round to 2 decimal places and add '%' sign
}

export const formatValue = (
  pointsView: string,
  value: number | undefined
): string => {
  if (pointsView === "percentage") {
    return value ? decimalToPercentage(value) : "";
  } else {
    return value ? formatNumber(value) : "";
  }
};

const formatNumber = (value: number): string => {
  const roundedValue = (value * 10000).toFixed(3);
  return roundedValue.toString();
};

export function returnParentPath(option: Option, row: any) {
  switch (option.id!) {
    case 0:
      return row.assetClassName;
    case 1:
      return row.securityName;
    case 2:
      return row.regionCd;
    case 3:
      return row.countryCd;
  }
}

export const processDataThree = (
  dataArrays: { id: string; data: any[] }[],
  option: Option
) => {
  const flattenedData: ClassificationHoldingView[] = [];
  const dataMap = new Map();

  const flattenRowRecursive = (
    row: any,
    parentPath: string[],
    accountId: string
  ) => {
    if (row["securityName"]) {
      row["sectorName"] = row["securityName"];
    }
    const dataPath = [...parentPath, row.sectorName];
    // console.log(option)
    let column =
      option.id === 2
        ? "regionCd"
        : option.id === 3
        ? "countryCd"
        : option.id === 1
        ? "default"
        : "assetClassName";

    const def = row.sectorName || row.securityName;
    if (def !== undefined) {
      row[column] = def;
    } else {
      row["top"] = true;
    }

    // Generate a key to uniquely identify this row
    const key = dataPath.join("|"); // For example, using the dataPath as a key
    let newRow;
    if (dataMap.has(key)) {
      newRow = dataMap.get(key);
    } else {
      newRow = { ...row, dataPath };
      dataMap.set(key, newRow);
    }

    const weights = sumWeights(row);
    [
      "postOptimizationWeight",
      "preOptimizationWeight",
      "tradingWeight",
    ].forEach((weightKey) => {
      newRow[`${weightKey}${accountId}`] = row[weightKey] = weights[weightKey];
    });

    ["quantity", "weight", "benchmarkWeight", "overrideWeight"].forEach(
      (field) => {
        if (row[field] !== undefined) {
          newRow[`${field}${accountId}`] = row[field];
        }
      }
    );

    [
      "classificationHoldingViews",
      "accountHoldingViews",
      "assetClassHoldingViews",
    ].forEach((viewType) => {
      if (row[viewType]) {
        row[viewType].forEach((underling: any) => {
          flattenRowRecursive(underling, dataPath, accountId);
        });
      }
    });
  };

  dataArrays.forEach((item, index) => {
    structuredClone(item.data).forEach((row) =>
      flattenRowRecursive(structuredClone(row), [], item.id)
    );
  });

  // Convert map to array
  flattenedData.push(...dataMap.values());
  return flattenedData;
};

export const processData = (data: any[], option: Option) => {
  const flattenedData: ClassificationHoldingView[] = [];
  const flattenRowRecursive = (row: any, parentPath: string[]) => {
    if (row["securityName"]) {
      row["sectorName"] = row["securityName"];
    }
    const dataPath = [...parentPath, row.sectorName];
    let column =
      option.id == 2
        ? "regionCd"
        : option.id == 3
        ? "countryCd"
        : option.id == 1
        ? "default"
        : "assetClassName";
    const def = row.sectorName ? row.sectorName : row.securityName;

    if (def !== undefined) {
      row[`${column}`] = def;
    } else {
      row["top"] = true;
    }
    const { postOptimizationWeight, preOptimizationWeight, tradingWeight } =
      sumWeights(row);
    row.postOptimizationWeight = postOptimizationWeight;
    row.preOptimizationWeight = preOptimizationWeight;
    row.tradingWeight = tradingWeight;
    flattenedData.push({ ...row, dataPath });
    if (row.classificationHoldingViews) {
      row.classificationHoldingViews.forEach((underling: any) => {
        flattenRowRecursive(underling, dataPath);
      });
    }
    if (row.accountHoldingViews) {
      row.accountHoldingViews.forEach((underling: any) => {
        flattenRowRecursive(underling, dataPath);
      });
    }
    if (row.assetClassHoldingViews) {
      row.assetClassHoldingViews.forEach((underling: any) => {
        flattenRowRecursive(underling, dataPath);
      });
    }
  };
  structuredClone(data)?.forEach((row) =>
    flattenRowRecursive(structuredClone(row), [])
  );
  console.log(flattenedData, "data");
  return flattenedData;
};

export function proccessSet(
  grid: React.MutableRefObject<any>,
  option: Option,
  data: any
) {
  console.log(data, "data");
  grid.current.api.setRowData(processDataThree(data, option));
  grid.current.api.hideOverlay();
  grid.current.api.expandAll();
}

export function toCamelCase(input: string): string {
  // Split the string into words using a regular expression that looks for spaces or underscores
  const words = input.split(/[\s_]+/);
  // Convert the array of words into CamelCase
  const camelCase = words
    .map((word, index) => {
      // Convert the first word to lowercase and the rest to Capitalized form
      if (index === 0) {
        return word.toLowerCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    })
    .join(""); // Join the words back together without spaces

  return camelCase;
}

export function drillDownAndExtract(
  obj: ClassificationHoldingView[]
): AdditionalAttributeMap[] | null {
  function recursiveDrill(
    currentObject: ClassificationHoldingView
  ): AdditionalAttributeMap[] | undefined {
    // Check if we have the 'classificationHoldingViews' to drill down further
    if (currentObject.classificationHoldingViews) {
      for (const child of currentObject.classificationHoldingViews) {
        const result = recursiveDrill(child);
        if (result) {
          return result; // Propagate the found result up the recursion chain
        }
      }
    } else if (
      currentObject.accountHoldingViews &&
      currentObject.accountHoldingViews.length > 0
    ) {
      // Found the accountHoldingViews, extract additionalAttributeMap
      const firstAccountHoldingView = currentObject.accountHoldingViews[0];
      if (firstAccountHoldingView.additionalAttributeMap) {
        console.log(firstAccountHoldingView.additionalAttributeMap);
        // Convert the map to an array of [key, value] pairs
        //@ts-ignore
        return Object.keys(firstAccountHoldingView.additionalAttributeMap);
      }
    }
    // Nothing found, return undefined
    //@ts-ignore
    return null;
  }

  // Iterate over the root array and start the recursive drilling
  for (const rootObject of obj) {
    const result = recursiveDrill(rootObject);
    if (result) {
      return result; // Return the first found result
    }
  }
  // If nothing is found in any of the objects
  return null;
}

export async function getPDF() {
  // setLoading(true);
  fetch(`${process.env.REACT_APP_AI_URL}/am-report/dynamic?acct_id=5`, {
    method: "POST",
  })
    .then((response) => response.arrayBuffer()) // Process the response as an ArrayBuffer
    .then((buffer) => {
      // setBinaryPDFData(buffer)
      const base64String = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      // setLoading(false);
      // setPDFData(base64String); // Now you can use this base64String as the source for your PDF viewer

      return { binaryPDFData: buffer, PDFData: base64String };
    });
}
