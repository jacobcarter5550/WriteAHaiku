import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import PortOptmHistSelect from "./Selection/OptimizationSelectionTP.js";
import OptmHistCompare from "./Comparison/ComparisonTableTP.tsx";
import PortSelect from "./Selection/PortfolioSelectionTP.tsx";
import "./optmHistStyle.scss";
import {
  Node,
  PortfolioCollection,
} from "../../modals/portfolioConstruction/types.ts";
import ComparisonStep from "./Comparison/ComparisonStepTP.tsx";
import { OptimizationSelection } from "./types.ts";
import SelectionStep from "./Selection/SelectionStepTP.tsx";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import api from "../../../helpers/serviceTP.ts";
import { createStrategyTree, remapData } from "../lib.ts";
import { processObject } from "../portfolioConstruction/lib.ts";
import { constructionFlowAccount } from "../../portfolio/grid/Grid.tsx";
import { AxiosResponse } from "axios";
import Button from "../../../ui-elements/buttonTP.tsx";
import { useTheme } from "next-themes";

export type HistoricalComparisonModalProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
};

const HistoricalComparisonModal = ({ page, setPage, onClose }) => {
  const theme = useTheme();
  const [selectedPorts, setSelectedPorts] = useState<Node[]>([{} as any]);
  const [optmHists, setOptmHists] = useState<OptimizationSelection[]>([]);
  const [inputOptmHists, setInputOptmHists] = useState<any>([]);

  const incrementPage = () => setPage(page + 1);
  const decrementPage = () => setPage(page - 1);

  const [nodeLets, setNodelets] = useState<Node[]>([]);
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

  useEffect(() => {
    async function handleREquests() {
      
      try {
        const strategyTypes = await api.get("/optstrategytype/all");
        api
          .get<PortfolioCollection>("/portfolio/all")
          .then((res) => {
            console.log(res);
            let obj: Node | any = {};
            remapData(res.data).forEach((item: string, index: number) => {
              const proccessed = processObject(item, nodeLets, index);
              if (index === 0) {
                obj = proccessed.topLevelNode!;
                obj.children!.push(proccessed.middleObject);
              } else {
                obj.children!.push(proccessed.middleObject);
              }
            });
            const preFormatted = createStrategyTree(
              res.data.strategyHierarchyViews,
              strategyTypes.data.map((item, index) => {
                return { type: item, id: index };
              }),
              res.data.accountDetailViews
            );
            const strategies = transformStrategyData(preFormatted);
            // if (constructionFlowAccount.value) {
            //   const pruned = structuredClone(strategies);
            //   const filtered = filterTreeByLeafValue(
            //     pruned,
            //     constructionFlowAccount.value
            //   );
            //   setNodelets([filtered]);
            // } else {
            setNodelets([strategies]);
            // }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log("toasted");
      }
    }
    handleREquests();
  }, []);
  // console.log(optmHists);
  const pages = [
    <SelectionStep
      selectedPorts={selectedPorts}
      setSelectedPorts={setSelectedPorts}
      optmHists={optmHists}
      setOptmHists={setOptmHists}
      incrementPage={incrementPage}
      setInputOptmHists={setInputOptmHists}
      close={onClose}
      nodeLets={nodeLets}
      setNodelets={setNodelets}
    />,
    <ComparisonStep decrementPage={decrementPage} optmHists={inputOptmHists} />,
  ];

  const handleProceed = () => {
    setInputOptmHists(optmHists);
    incrementPage();
  };

  const selectionButtons = (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="end"
      style={{ width: "95%" }}
    >
      <Button
        label="Proceed"
        disable={
          !optmHists ||
          typeof optmHists == "undefined" ||
          !optmHists[0] ||
          !optmHists[0]["portId"]
        }
        className={"pop-btn buttonMarginHelper"}
        onClick={handleProceed}
      />
    </Stack>
  );

  const compareButtons = (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="end"
      style={{ width: "95%" }}
    >
      <Button
        label="Back"
        className={
          theme.theme == "light"
            ? "pop-btnNeg buttonMarginHelper"
            : "pop-btnNeg-dark-mode buttonMarginHelper"
        }
        onClick={decrementPage}
      />
      <Button
        label="Edit Selection"
        className={"pop-btn buttonMarginHelper"}
        onClick={decrementPage}
      />
    </Stack>
  );

  function buttonSwitch(page) {
    switch (page) {
      case 1:
        return { buttons: selectionButtons };
      case 2:
        return { buttons: compareButtons };
    }
  }
  console.log(page);
  return (
    <ModalType
      buttons={buttonSwitch(page)?.buttons}
      type={ModalTypeEnum.MEDIUM}
      style={{ height: "85vh" }}
      open={page > 0 && page <= pages.length}
      closeDialog={() => {
        setPage(0);
        console.log("Close Request");
      }}
    >
      <h1>Optimization History</h1>
      {pages[page - 1]}
    </ModalType>
  );
};

export default HistoricalComparisonModal;
