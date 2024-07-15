import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "../../../ui-elements/buttonTP.tsx";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import { GroupedBarChart, LineChart } from "@carbon/charts-react";
import SecurityMenuBar from "./SecurityMenuBar.tsx";
import SecurityDetails from "./SecurityDetails.tsx";
import BalanceSheet from "./views/BalanceSheet.tsx";
import ButtonMenu from "./ButtonMenu.tsx";
import GenericTable from "./views/GenericTable.tsx";
import CashFlow from "./views/CashFlow.tsx";
import Financials from "./views/Financials.tsx";
import { Tabs, Tab, TabList } from "@carbon/react";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import RatiosOverviewComp from "./views/RatiosOverviewComp.tsx";
import { useDispatch } from "react-redux";
import {
  setSecurityDetails,
  setSecurityModal,
} from "../../../store/nonPerstistant/index.ts";
import { useAppSelector } from "../../../store/index.ts";
import {
  getSecurityDetails,
  getSecurityModal,
} from "../../../store/nonPerstistant/selectors.ts";
import { Theme } from "@carbon/react";
import { useTheme } from "next-themes";

const style = {
  width: "100%",
  bgcolor: "#F5F7F9",
  border: "2px solid #000",
  height: "96vh",
  overflow: "hidden",
  boxShadow: 24,
};

export type Security = {
  id?: number;
  accountId: number;
  securityId: string;
  quantity: number;
  price: number;
  weight: number;
  preOptimizationWeight: number;
  postOptimizationWeight: number;
  tradingWeight: number;
  securityCd: string;
  securityName: string;
  securityTypeCd: string;
  issuerId: number | null;
  cusip: string;
  sedol: string;
  isin: string;
  cik: string;
  regionModelId: number;
  regionCd: string;
  headquarter: string;
  foundingDate: string;
  securityDescription: string;
  figiId: string;
  shareclassFigiId: string;
  compositeFigiId: string;
  countryModelId: number;
  countryCd: string;
  assetClassCd: string;
  assetClassModelId: number;
  sectorModelId: number;
  sectorCd: string;
  sectorLevel: number;
  default: string;
  additionalAttributeMap?: any;
};

export enum SecViewOptions {
  OVERVIEW = "Overview",
  BALANCESHEET = "Balance Sheet",
  FINANCIALS = "Income Statement",
  CASHFLOW = "Cash Flow",
}

// We are using the enum values directly as tab labels for simplicity and direct mapping
export const tabData = [
  SecViewOptions.OVERVIEW,
  SecViewOptions.BALANCESHEET,
  SecViewOptions.FINANCIALS,
  SecViewOptions.CASHFLOW,
];

export type SecurityViewProps = {
  securities: Security[];
  close: () => void;
};

export default function StockReview({ securities, close }: SecurityViewProps) {
  const dispatch = useDispatch();
  const nextTheme = useTheme();

  function dispatchSecurityDetails(data: Security | null) {
    dispatch(setSecurityDetails(data));
  }

  const securityDetails = useAppSelector(getSecurityDetails);
  const index = securities?.findIndex(
    (sec) => sec.securityName === securityDetails
  );
  const individualSecurity = securities[index];
  function moveTo(increment: boolean) {
    const nextPage = increment ? index + 1 : index - 1;
    const nextSec = securities[nextPage];
    dispatchSecurityDetails(nextSec?.securityName);
  }

  const [selectedTab, setSelectedTab] = useState<SecViewOptions>(
    SecViewOptions.OVERVIEW
  );

  const handleTabChange = (selectedIndex: number) => {
    setSelectedTab(tabData[selectedIndex]); // Convert index to enum value
  };

  // Function to find the index of the current selected enum in tabData
  const findTabIndex = (currentEnum: SecViewOptions): number => {
    return tabData.indexOf(currentEnum);
  };

  const buttons = <></>;
  return (
    <div>
      <ModalType
        buttons={buttons}
        style={{ padding: "0px", minHeight: "96vh" }}
        type={ModalTypeEnum.LARGE}
        open
        closeDialog={close}
        hideCloseButton={true}
        aria-labelledby="security-view-modal-title"
        aria-describedby="security-view-modal-description"
      >
        <Box
          // style={{ paddingTop: "0px", height: "100%", overflow: "hidden" }}
          sx={style}
          className="securityView"
        >
          <SecurityMenuBar moveSec={moveTo} secDetails={securityDetails!} />
          <aside className="security-view-main">
            <SecurityDetails
              secDetails={securityDetails!}
              selectedTab={selectedTab}
              findTabIndex={findTabIndex}
              handleTabChange={handleTabChange}
              tabData={tabData}
            />
            <div className="security-view-tab-body">
              {viewRenderer(selectedTab, individualSecurity)}
            </div>
          </aside>
        </Box>
      </ModalType>
    </div>
  );
}

function viewRenderer(secState: SecViewOptions, individualSecurity: Security) {
  switch (secState) {
    case SecViewOptions.OVERVIEW: {
      return <RatiosOverviewComp individualSecurity={individualSecurity} />;
    }
    case SecViewOptions.BALANCESHEET: {
      return <BalanceSheet individualSecurity={individualSecurity} />;
    }
    case SecViewOptions.CASHFLOW: {
      return <CashFlow individualSecurity={individualSecurity} />;
    }
    case SecViewOptions.FINANCIALS: {
      return <Financials individualSecurity={individualSecurity} />;
    }
  }
}
