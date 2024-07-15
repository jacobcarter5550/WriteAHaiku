import React from "react";
import { WidgetSource } from "./types";

type BaseWidgetProps = {
  data: WidgetSource;
  children: any;
};

const BaseWidget: React.FC<BaseWidgetProps> = ({ data, children }) => {

  return <div key={data.key} style={{backgroundColor:'#ffffff'}}>
            
            {children}
      </div>;
};

export default BaseWidget;
