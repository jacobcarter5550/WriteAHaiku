export enum WidgetType {
  TAB = 'tab',
  TABLE = "Table"
}

export type BaseWidgetData = {
  i: string;
  x: number;
  y: number;
  w: number;
  service? : string;
  h: number;
  chartType : string,
  key: string;
};

export type AreaWidgetData = { data: any };
export type ScatterWidgetData = { data: any };
export type TableWidgetData = { data: any };
export type BubbleWidgetData = { data: any };


export type AreaWidgetType = BaseWidgetData &
  AreaWidgetData & {
    type: WidgetType.AREA;
  };


export type ScatterWidgetType = BaseWidgetData &
  ScatterWidgetData & { type: WidgetType.SCATTER };
  
export type BubbleWidgetType = BaseWidgetData &
BubbleWidgetData & {
    type: WidgetType.BUBBLE;
  };

  
  export type TableWidgetType = BaseWidgetData &
  TableWidgetData & {
    type: WidgetType.TABLE;
  };
  
  
export type WidgetSource = ScatterWidgetType | AreaWidgetType | TableWidgetType | BubbleWidgetType ;
