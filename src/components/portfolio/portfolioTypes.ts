import { Option } from "../../types/types";
import { Security } from "../modals/SecurityPreview/securtityViewTP";

export interface AdditionalAttributeMap {
  [key: string]: any;
}

export interface AccountHoldingView {
  additionalAttributeMap?: AdditionalAttributeMap;
}

// export interface ClassificationHoldingView {
//   classificationHoldingViews?: ClassificationHoldingView[];
//   accountHoldingViews?: AccountHoldingView[];
// }

export interface Node {
  securityName?: string;
  preOptimizationWeight: number;
  postOptimizationWeight: number;
  tradingWeight: number;
  classificationHoldingViews?: Node[];
  accountHoldingViews?: Node[];
  assetClassHoldingViews?: Node[];
  top?: boolean;
}

// Portfolio Summary Interface

export interface Portfolio {
  accountId: number;
  accountFullName: string;
  accountManagerId: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  id: string;
  managerName: string;
  regionCd: string;
}

// Portfolio Details Interfaces

export interface Account {
  value: string;
  label: string;
}

export interface ClassificationHoldingView {
  sectorName: string;
  securityName: string;
  classificationHoldingViews: ClassificationHoldingView[];
  accountHoldingViews: Security[];
  postOptimizationWeight: number;
  preOptimizationWeight: number;
  tradingWeight: number;
}

export interface RegionHoldingView {
  regionCd: string;
  accountHoldingViews: Security[];
}

export interface CountryHoldingView {
  countryCd: string;
  accountHoldingViews: Security[];
}

export interface PortfolioContainerProps {
  setSectorClassVal: any;
  setSecurities: any;
  ref: any;
  setReffo: React.Dispatch<any>;
  pointsView: string;
  sectorClassVal: Option | undefined;
  securities: Security[] | null;
}

// Breadcrumb Interface

export interface CurrentSelection {
  label: string;
}

export interface NodeData {
  dataPath: string[];
  default: string;
}

export interface CurrentNode {
  data: NodeData;
}

export interface BreadCrumbProps {
  currentSelection: CurrentSelection;
  currentNode: CurrentNode;
}
