export type Characteristic = {
  id: number;
  name: string;
  checkboxState: boolean;
  textInputFirst: string;
  textInputSecond: string;
  toggleInputFirst: string;
  toggleInputSecond: string;
  category: string;
};

export type InitialState = {
  [category: string]: {
      outerCheckBoxState: boolean;
      [subcategory: string]: Characteristic[] | boolean;
  };
};

export type ListData = {
  [category: string]: any | { outerCheckBoxState: boolean; characteristics: Characteristic[] };
};

export type Data = {
  characteristics: string[];
  fundamentalCharacteristics: string[];
  riskModelCharacteristics: string[];
  balanceSheetCharacteristics: string[];
  cashFlowCharacteristics: string[];
  message: string | null;
};

export type FilterableData = {
  outerCheckBoxState: boolean;
  characteristics: (string | Characteristic)[];
}


export type Payload = {
  customViewCharacteristics: any[];
  productTypeId: number;
  preferenceName: string;
  preferenceId?: number;
}

export type IndividualCustomView = {
  name: string;
  lower_bound: string;
  upper_bound: string;
};