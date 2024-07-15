import { Security } from "../SecurityPreview/securtityViewTP";
import { PayloadItem } from "./optimsationDefTP";
import {
  Constraint,
  Optimization,
  PartialSecurity,
  restrictionDefinition,
} from "./portfolioConstructionConfigTP";
import { Sector, Node, PortfolioCollection } from "./types";

export function pruneSecurityToRestrictionDefinition(
  securities: PartialSecurity[]
): restrictionDefinition[] {
  return securities.map((security) => {
    return {
      definitionId: security.definitionId,
      securityId: security.securityId,
      holdOnly: security.holdOnly,
      buyNotSell: security.buyNotSell,
      sellNotBuy: security.sellNotBuy,
      sellAll: security.sellAll,
      validFrom: security.validFrom,
      validTo: security.validTo,
    };
  });
}

export function filterSectorsByConstraints(
  sectors: Sector[],
  constraints: Constraint[]
) {
  const factorIds = constraints?.map((constraint) =>
    constraint.factorId!.toString()
  );

  function sectorMatchesOrDescends(factorId, sectorCode) {
    return factorId.startsWith(sectorCode);
  }

  function filterSectorTree(tree: Sector[]) {
    return tree.filter((sector) => {
      // Check if the current sector or any of its descendants have a matching factorId
      const hasMatchingFactor = factorIds?.some((factorId) =>
        sectorMatchesOrDescends(factorId, sector.sectorCode)
      );
      if (!hasMatchingFactor) return false;

      // If the sector has children, apply the filter recursively
      if (sector.childSectors && sector.childSectors.length > 0) {
        sector.childSectors = filterSectorTree(sector.childSectors);
      }

      return true;
    });
  }

  return filterSectorTree(sectors);
}

export default function findId(nodes: Sector[], id: string) {
  return nodes.map((node) => {
    if (node.sectorCode === id) {
      return node;
    } else if (node.childSectors) {
      return findId(node.childSectors, id);
    }
  });
}

export function dictionaryToArray(dictionary) {
  // Use Object.entries to convert dictionary to array of [key, value] pairs
  // Then map each pair to an object with { title, id }
  return Object.entries(dictionary).map(([key, value]) => ({
    title: value,
    id: parseInt(key, 10), // Ensure the key is converted to a number
  }));
}

export function enrichConstraints(
  complexConstraints: Constraint[],
  simplifiedConstraints: { title: string; id: number }[]
) {
  // Iterate over the complexConstraints array
  return complexConstraints
    .map((complexConstraint) => {
      // Find a matching simplified constraint
      const matchingSimplified = simplifiedConstraints?.find(
        (simplified) => simplified.id === complexConstraint.factorId
      );

      // If a match is found, add the title to the complex constraint
      if (matchingSimplified) {
        return { ...complexConstraint, title: matchingSimplified.title };
      } else {
        return undefined;
      }
    })
    .filter((item) => item !== undefined);
}

export function collectLeaves(nodes) {
  let leaves: any[] = [];

  // Helper function to recursively collect leaves
  function traverse(node) {
    if (node.accountHoldingViews) {
      // Node is a leaf; collect its accountHoldingViews
      node.accountHoldingViews.forEach((leaf) => {
        if (leaves.includes(leaf)) return;
        leaves.push(leaf);
      });
    } else if (node.classificationHoldingViews) {
      // Node has children; recurse into each
      node.classificationHoldingViews.forEach(traverse);
    }
  }

  // Start the traversal from the root nodes
  nodes.forEach(traverse);

  return leaves;
}

export function extendWithUpdateProperty(node: Node) {
  node.updateProperty = function (propertyId: number, newValue: object) {
    console.log(propertyId);
    switch (propertyId) {
      case 1:
        this.cacheIn = newValue;
        break;
      case 2:
        this.cacheOut = newValue;
        break;
      case 3:
        this.rebalance = newValue;
        break;
      default:
        console.log("Invalid property ID");
    }
  };
}

export function extendWithDeleteProperty(node: Node) {
  node.deleteProperty = function (propertyId: number) {
    switch (propertyId) {
      case 1:
        this.cacheIn = "";
        break;
      case 2:
        this.cacheOut = "";
        break;
      case 3:
        this.rebalance = "";
        break;
      default:
        console.log("Invalid property ID");
    }
  };
}

export function processObject(obj, definitions, index) {
  const strategyTypeKey = obj.strategyType;
  let topLevelNode: Node | null = null;

  // Process top-level node
  if (!definitions.some((def) => def.value === strategyTypeKey)) {
    topLevelNode = {
      id: `${definitions.length + 1}`,
      value: strategyTypeKey,
      cacheIn: {},
      cacheOut: {},
      rebalance: {},
      children: [],
    };
  }

  const middleObject: Node = {
    id: `1-${index}`,
    value: obj.name,
    cacheIn: {},
    cacheOut: {},
    rebalance: {},
    children: [],
  };

  obj.portfolios.forEach((portfolio, portfolioIndex) => {
    const childObject: Node = {
      id: `${middleObject.id}-${portfolioIndex}`,
      value: portfolio.name,
      cacheIn: {},
      cacheOut: {},
      rebalance: {},
    };
    middleObject.children!.push(childObject);
  });

  return { topLevelNode, middleObject };
}

export function transformSecurityToPartialSecurity(
  security: Security
): PartialSecurity {
  return {
    validFrom: "null",
    validTo: "null",
    definitionId: security.accountId,
    id: security.id!,
    securityId: security.securityId,
    holdOnly: false,
    buyNotSell: false,
    sellNotBuy: false,
    sellAll: false,
    securityCd: security.securityCd,
    securityName: security.securityName,
    security_type_cd: security.securityTypeCd,
    issuer_id: security.issuerId,
    cusip: security.cusip,
    sedol: security.sedol,
    isin: security.isin,
    cik: security.cik,
    headquarter: security.headquarter,
    founding_date: security.foundingDate,
    description: security.securityDescription,
    figi_id: security.figiId,
    shareclass_figi_id: security.shareclassFigiId,
    composite_figi_id: security.compositeFigiId,
  };
}

export function generateRandomFourDigitNumber(): number {
  console.log(Math.floor(1000 + Math.random() * 9000));
  return Math.floor(1000 + Math.random() * 9000);
}

export function createPayloadForUpdate(
  baseTree: Node[],
  accounts: PortfolioCollection | null
) {
  return baseTree
    .map((item) => {
      let finale: Partial<PayloadItem> = {};
      finale["accountId"] = accounts?.accountDetailViews.find(
        (account) => account.accountFullName === item.value
      )?.accountId;
      finale["strategyId"] = accounts?.accountDetailViews.find(
        (account) => account.accountFullName === item.value
      )?.strategyId;
      finale["rebalanceOptDefId"] = item.rebalance.id ?? null;
      finale["cashInOptDefId"] = item.cacheIn.id ?? null;
      finale["cashOutOptDefId"] = item.cacheOut.id ?? null;
      return finale;
    })
    .filter(
      (item) => item.accountId !== undefined && item.strategyId !== undefined
    );
}

export function findObjectsWithCacheOrRebalance(tree) {
  const result: any[] = [];
  function traverse(node) {
    if (
      Object.keys(node.cacheIn).length > 0 ||
      Object.keys(node.cacheOut).length > 0 ||
      Object.keys(node.rebalance).length > 0
    ) {
      const { children, ...nodeWithoutChildren } = node;

      result.push(nodeWithoutChildren);
    }

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => traverse(child));
    }
  }

  // Start the traversal from the root node(s)
  tree.forEach((node) => traverse(node));
  return result;
}
