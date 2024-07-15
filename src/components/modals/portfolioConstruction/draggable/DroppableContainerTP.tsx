import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";

interface ItemData {
  id: string;
  name: string;
}
const DroppableContainer = ({ onDrop, children, id, node,toolTip,handleDeselectNode }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "item",
    drop: (item: ItemData) => {
      onDrop(item, id, node);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const isHoverClass = isOver ? "hovered-container" : "";
  const [toolTipValue , setToolTipValue] = useState<String | null> ('');
  useEffect(()=>{

    switch(id){
      case 1: {
        setToolTipValue(node?.cacheIn?.name);
        break;
      }
      case 2: {
        setToolTipValue(node?.cacheOut?.name);
        break;
      }
      case 3: {
        setToolTipValue(node?.rebalance?.name);
        break;
      }
      default : {
        break;
      }
    }
  },[node])

  return (
    <div ref={drop} className={isHoverClass}  onClick={()=>handleDeselectNode(id,node)}>
      <Tooltip title={ toolTipValue ? toolTipValue : toolTip}>
      {children}
      </Tooltip>
    </div>
  );
};

export default DroppableContainer;
