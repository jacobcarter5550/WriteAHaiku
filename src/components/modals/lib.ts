import { AccountDetail, SimplifiedStrategy } from "./portfolioConstruction/types";

interface Strategy {
  strategyId?: number;
  parentStrategyId: number;
  name: string;
  accounts: string[];
}

interface Type {
  type: string;
  id: number;
}

interface Portfolio {
  accountId: string;
  accountFullName: string;
  strategyId: number;
  accountManagerId: string;
  regionCd: string;
}

export function createStrategyTree(
  strategyHierarchyViews: SimplifiedStrategy[],
  types: Type[],
  accountDetailViews: AccountDetail[]
) {
  const strategyMap = new Map<number, Strategy>();
  const accountMap = new Map<number, number[]>();
  const tree: { [key: string]: { [key: string]: { [key: string]: {} } } } = {};

  // Map each strategy by its ID for easy access
  strategyHierarchyViews.forEach((strategy) => {

    strategyMap.set(strategy.strategyId, {
      name: strategy.name,
      parentStrategyId: strategy.parentStrategyId,
      accounts: [] as string[],
    });
  });

  // Group accounts by strategyId
  accountDetailViews.forEach((account) => {
    console.log(account)
    if (accountMap.has(account.strategyId)) {
      accountMap.get(account.strategyId)?.push(account.accountFullName);
    } else {
      accountMap.set(account.strategyId, [account.accountFullName]);
    }
  });

  // Populate strategy nodes with accounts
  accountMap.forEach((accounts, strategyId) => {
    if (strategyMap.has(strategyId)) {
      strategyMap.get(strategyId).accounts = accounts;
    }
  });

  // Build the tree structure
  types.forEach((type) => {
    tree[type.type] = {};

    strategyMap.forEach((strategy, strategyId) => {
      if (strategy.parentStrategyId === type.id) {
        tree[type.type][strategy.name] = {};

        // Add accounts to the strategy node
        strategy.accounts.forEach((account) => {
          tree[type.type][strategy.name][account] = {};
        });
      }
    });
  });

  return transformData(tree).map((item) => {
    if (item.options.length === 0) {
      item.options[0] = "";
      return item;
    } else return item;
  });
}

function transformData(originalData: {
  [key: string]: { [key: string]: { [key: string]: {} } };
}) {
  const result: {
    label: string;
    options: { value: number; label: string }[];
  }[] = [];
  let valueCounter = 0;

  for (const strategyType in originalData) {
    const strategies = originalData[strategyType];
    let hasChildrenWithNames = false;

    // Check if the strategy type has children and if those children have names
    for (const strategy in strategies) {
      if (Object.keys(strategies[strategy]).length > 0) {
        hasChildrenWithNames = true;
        break;
      }
    }

    if (hasChildrenWithNames) {
      // Add an entry for the strategy type with no options
      result.push({ label: strategyType, options: [""] });

      for (const strategy in strategies) {
        const names = strategies[strategy];
        const options = Object.keys(names).map((name) => {
          return { value: valueCounter++, label: name };
        });

        // Only add if there are options
        if (options.length > 0) {
          result.push({ label: strategy, options: options });
        }
      }
    }
  }

  return result;
}

export function remapData(apiData: any): any[] {
  const remappedData: any[] = [];

  // Group portfolios by region
  const portfoliosByRegion: { [key: string]: Portfolio[] } =
    apiData.accountDetailViews.reduce(
      (acc: { [key: string]: Portfolio[] }, account: Portfolio) => {
        const portfolio = {
          id: account.accountId,
          name: account.accountFullName,
          managerId: account.accountManagerId,
          // Add other properties as needed
        };

        if (acc[account.regionCd]) {
          acc[account.regionCd].push(portfolio);
        } else {
          acc[account.regionCd] = [portfolio];
        }
console.log("acc-->",acc);
        return acc;
      },
      {}
    );

  // Convert the grouped portfolios into the desired format
  for (const [regionCd, portfolios] of Object.entries(portfoliosByRegion)) {
    remappedData.push({
      strategyType: "REGION",
      cd: regionCd,
      name: regionCd,
      portfolios: portfolios,
    });
  }
console.log("remappedData-->",remappedData);
  return remappedData;
}
