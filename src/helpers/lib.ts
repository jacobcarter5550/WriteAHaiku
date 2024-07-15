import { Dispatch } from "redux";
import { PortfolioCollection } from "../components/modals/portfolioConstruction/types";
import { createStrategyTree, remapData } from "../components/modals/lib.ts";
import {
  Item,
  setPortfolioAction,
  setPortfolioSelectors,
  updateAccountId,
} from "../store/portfolio/index.ts";
import api from "./serviceTP.ts";
import { SelectOption } from "../components/nav/Nav.tsx";
import moment from "moment";

interface Type {
  type: string;
  id: number;
}

export const fetchPortfolioAction = () => (dispatch: Dispatch<any>) => {
  api.get("/opttype/all").then((res: any) => {
    const resultArray: Item[] = res.data.map((item) => ({
      item: item,
      label: item,
    }));
    dispatch(setPortfolioAction(resultArray));
  });
};

function updateData(incomingData, staleData):SelectOption[] {
  // Filter staleData to only include entries that exist in incomingData by both label and value
  const updatedStaleData = staleData?.filter((staleEntry) =>
    incomingData.some(
      (incomingEntry) =>
        incomingEntry.label === staleEntry.label &&
        incomingEntry.value === staleEntry.value
    )
  );

  return updatedStaleData;
}

export const fetchPortfolioSelectors =
  (staleSelections) => (dispatch: Dispatch<any>) => {
    api
      .get<PortfolioCollection>("/portfolio/all")
      .then(async (res) => {
        try {
          const upToDatelist = res.data.accountDetailViews.map((item) => ({
            label: item.accountFullName,
            value: item.accountId,
          }));
          const stratgyTypes = await api.get("/optstrategytype/all");
          let resultArray = remapData(res.data).map((item) => ({
            label: item.name,
            options: item.portfolios.map((portfolio) => ({
              value: portfolio.id,
              label: portfolio.name,
            })),
          }));

          const types: Type[] = stratgyTypes.data.map((item, index) => ({
            type: item,
            id: index,
          }));

          const strats = createStrategyTree(
            res.data.strategyHierarchyViews,
            types,
            res.data.accountDetailViews
          );

          const correlatedIds = updateValuesWithIds(
            structuredClone(strats),
            structuredClone(res.data.accountDetailViews)
          );

          resultArray.concat(strats);
          const newArr: Item[] = [
            { label: "Region", options: [""] },
            ...resultArray,
            { label: "Strategy", options: [""] },
            ...correlatedIds,
          ];

          const cleaned:SelectOption[] = updateData(upToDatelist, staleSelections ?? []);
          dispatch(updateAccountId(cleaned));
          dispatch(setPortfolioSelectors(newArr));
        } catch (error) {
          console.log("toasted");
        }
      })
      .catch((error) => {
        // Handle errors that occur during the API request or in the Promise chain.
        console.error("Failed to fetch portfolio selectors:", error);
        // Optionally dispatch an error action or update state to show an error message.
      });
  };

function updateValuesWithIds(originalData, idData) {
  // Create a mapping from names to account IDs for easier lookup
  const nameToIdMap = idData.reduce((map, item) => {
    map[item.accountFullName] = item.accountId;
    return map;
  }, {});

  // Iterate through each item in the original data
  originalData.forEach((group) => {
    if (group.options && group.options.length) {
      group.options.forEach((option) => {
        // Check if the option has a label that matches an entry in the ID data
        if (option.label && nameToIdMap.hasOwnProperty(option.label)) {
          // Update the value with the corresponding account ID
          option.value = nameToIdMap[option.label];
        }
      });
    }
  });

  return originalData;
}

export const getCurrentDateFormatted = () => {
  return moment().format("YYYYMMDD");
  // return "20230331";
};
