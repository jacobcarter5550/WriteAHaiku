export enum WidgetType {
  TAB = 'tab',
  DROPDOWN = 'dropdown',
  TABLE = "Table",
  DYNAMIC_CONTROL  = "dynamic_control",
  RISK_ANALYTICS = "rish_analytics",
  PERFORMANCE_CONTROL = "performanceControl",
  TAX_ALPHA = "tax_alpha"
}

export type BaseWidgetData = {
  i: string;
  x: number;
  y: number;
  w: number;
  service? : string;
  static ? : Boolean;
  h: number;
  key: string;
};


export type DropdownWidgetData = { data: any };

export type TableWidgetData = { data: any };

export type TabwidgetData = { data: any };



  
  export type TableWidgetType = BaseWidgetData &
  TableWidgetData & {
    type: WidgetType.TABLE;
  };

    
  export type ControlWidgetType = BaseWidgetData &
  TableWidgetData & {
    type: WidgetType.DYNAMIC_CONTROL;
  };

  export type PerformanceControlWidgetType = BaseWidgetData &
  TableWidgetData & {
    type: WidgetType.PERFORMANCE_CONTROL;
  };

  export type RiskControlWidgetType = BaseWidgetData &
  TableWidgetData & {
    type: WidgetType.RISK_ANALYTICS;
  };
  
  
  export type TaxAlphaType = BaseWidgetData &
  TableWidgetData & {
    type: WidgetType.TAX_ALPHA;
  };
  
  
  
  export type DropdownWidgetType = BaseWidgetData &
  DropdownWidgetData & {
    type: WidgetType.DROPDOWN;
  };


  export type TabWidget = BaseWidgetData &
  TabwidgetData & {
    type: WidgetType.TAB;
  };
  
  


export type WidgetSource = TableWidgetType |  DropdownWidgetType | TabWidget | ControlWidgetType | PerformanceControlWidgetType | RiskControlWidgetType | TaxAlphaType; 
