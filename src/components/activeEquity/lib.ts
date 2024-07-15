import { ClassificationHoldingView, Option } from "../portfolio/portfolioLib";

interface Node {
  securityName?: string;
  preOptimizationWeight: number;
  postOptimizationWeight: number;
  tradingWeight: number;
  classificationHoldingViews?: Node[];
  accountHoldingViews?: Node[];
  benchmarkWeight: number;
  overrideWeight: number;
  top?: boolean;
  assetClassHoldingViews?: Node[];
}

export function sumWeights(node: Node): {
  preOptimizationWeight: number;
  postOptimizationWeight: number;
  tradingWeight: number;
  benchmarkWeight: number;
  overrideWeight: number;
} {
  let sums = {
    preOptimizationWeight: 0,
    postOptimizationWeight: 0,
    tradingWeight: 0,
    benchmarkWeight: 0,
    overrideWeight: 0,
  };

  if (node.hasOwnProperty("securityName")) {
    sums.preOptimizationWeight += node.preOptimizationWeight;
    sums.postOptimizationWeight += node.postOptimizationWeight;
    sums.benchmarkWeight += node.benchmarkWeight;
    sums.overrideWeight += node.overrideWeight;
    sums.tradingWeight += node.preOptimizationWeight - node.benchmarkWeight;
  } else if (node.classificationHoldingViews) {
    for (const child of node.classificationHoldingViews) {
      const childSums = sumWeights(child);
      sums.preOptimizationWeight += childSums.preOptimizationWeight;
      sums.postOptimizationWeight += childSums.postOptimizationWeight;
      sums.tradingWeight +=
        childSums.preOptimizationWeight - childSums.benchmarkWeight;
      sums.benchmarkWeight += childSums.benchmarkWeight;
      sums.overrideWeight += childSums.overrideWeight;
    }
  } else if (node.assetClassHoldingViews) {
    for (const child of node.assetClassHoldingViews) {
      const childSums = sumWeights(child);
      sums.preOptimizationWeight += childSums.preOptimizationWeight;
      sums.postOptimizationWeight += childSums.postOptimizationWeight;
      sums.tradingWeight +=
        childSums.preOptimizationWeight - childSums.benchmarkWeight;
      sums.benchmarkWeight += childSums.benchmarkWeight;
      sums.overrideWeight += childSums.overrideWeight;
    }
  } else if (node.accountHoldingViews) {
    for (const child of node.accountHoldingViews) {
      sums.preOptimizationWeight += child.preOptimizationWeight;
      sums.postOptimizationWeight += child.postOptimizationWeight;
      sums.tradingWeight += child.preOptimizationWeight - child.benchmarkWeight;
      sums.benchmarkWeight += child.benchmarkWeight;
      sums.overrideWeight += child.overrideWeight;
    }
  }
  if (node.top) {
    sums.preOptimizationWeight = sums.preOptimizationWeight / 100;
    sums.postOptimizationWeight = sums.postOptimizationWeight / 100;
    sums.tradingWeight =
      (sums.preOptimizationWeight - sums.benchmarkWeight) / 100;
    sums.benchmarkWeight = sums.benchmarkWeight / 100;
    sums.overrideWeight = sums.overrideWeight / 100;
  }

  return sums;
}

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

    const {
      postOptimizationWeight,
      preOptimizationWeight,
      tradingWeight,
      benchmarkWeight,
      overrideWeight,
    } = sumWeights(row);
    row.postOptimizationWeight = postOptimizationWeight;
    row.preOptimizationWeight = preOptimizationWeight;
    row.tradingWeight = tradingWeight;
    row.overrideWeight = overrideWeight;
    row.benchmarkWeight = benchmarkWeight;
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
  structuredClone(data).forEach((row) =>
    flattenRowRecursive(structuredClone(row), [])
  );
  return flattenedData;
};

export function formatApiChartResponse(apiResponse) {
  // Assuming the default values should be used if not provided in the response
  const defaultValues = {
    expectedReturn: 0,
    expectedVolatility: 0,
    trackingError: 0,
    taxCost: 0,
    transactionCost: 0,
  };

  // Deconstructing the original response, using default values if keys are missing
  const {
    expectedReturn: preExpectedReturn = defaultValues.expectedReturn,
    expectedVolatility:
      preExpectedVolatility = defaultValues.expectedVolatility,
    trackingError: preTrackingError = defaultValues.trackingError,
    taxCost: preTaxCost = defaultValues.taxCost,
    transactionCost: preTransactionCost = defaultValues.transactionCost,
  } = apiResponse.PreOpt;

  const {
    expectedReturn: postExpectedReturn = defaultValues.expectedReturn,
    expectedVolatility:
      postExpectedVolatility = defaultValues.expectedVolatility,
    trackingError: postTrackingError = defaultValues.trackingError,
    taxCost: postTaxCost = defaultValues.taxCost,
    transactionCost: postTransactionCost = defaultValues.transactionCost,
  } = apiResponse.PostOpt;

  // Creating the new object with values formatted to a fixed number of decimal places
  return {
    postOptExpectedReturn: parseFloat(postExpectedReturn.toFixed(4)),
    postOptExpectedVolatility: parseFloat(postExpectedVolatility.toFixed(4)),
    postOptTrackingError: parseFloat(postTrackingError.toFixed(4)),
    postOptTaxCost: parseFloat(postTaxCost.toFixed(4)),
    postOptTransactionCost: parseFloat(postTransactionCost.toFixed(4)),
    preOptExpectedReturn: parseFloat(preExpectedReturn.toFixed(4)),
    preOptExpectedVolatility: parseFloat(preExpectedVolatility.toFixed(4)),
    preOptTrackingError: parseFloat(preTrackingError.toFixed(4)),
    preOptTaxCost: parseFloat(preTaxCost.toFixed(4)),
    preOptTransactionCost: parseFloat(preTransactionCost.toFixed(4)),
  };
}

export function checkValidationResults(response) {
  // Access the validationResults array from the response data
  const validationResults = response.data.validationResults;

  // Initialize an array to store the results of each check
  let results: any[] = [];

  // Loop through each validation result
  for (let validationResult of validationResults) {
    // Check if securityValidationDataList is not empty and check the status of 'valid'
    if (
      validationResult.securityValidationDataList.length > 0 &&
      !validationResult.valid
    ) {
      results.push({
        validationType: validationResult.validationType,
        isValid: validationResult.valid,
        hasData: validationResult.securityValidationDataList.length > 0,
        data: validationResult.securityValidationDataList,
      });
    }
  }

  const validation = {
    passed: results.length == 0,
    data: results.map((item) => item.data).flat(),
  };

  // Return the array of results
  return validation;
}
