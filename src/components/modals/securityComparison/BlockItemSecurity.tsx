import React, { useEffect, useState } from "react";
import { Checkbox, Typography, Tooltip } from "@mui/material";
import { Characteristic } from "../customview/types";

const styles: { [key: string]: React.CSSProperties } = {
  blockContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  block: {
    display: "flex",
    gap: "2rem",
    padding: "7px",
    justifyContent: "space-between",
    border: "1px solid #8D8D8D",
    marginBottom: "2rem",
  },
  leftPortion: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  rightPortion: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },
  input: {
    width: "42px",
    // margin: "0 8px 0 0",
    color: "#525252",
    height: "38px",
    border: "1px solid #E0E0E0",
    boxShadow: "none",
  },
  ebitaText: {
    color: "#525252",
    fontSize: "1.2rem",
  },
  filterByText: {
    color: "#525252",
    fontSize: "1.2rem",
  },
};
interface BlockItemProps {
  item: Characteristic;
  handleInteraction: (
    category: string,
    id: number | null,
    value: string | boolean | null,
    action: string
  ) => void;
}

const BlockItemSecurity: React.FC<BlockItemProps> = React.memo(
  ({ item, handleInteraction }) => {
    const [softItem, setSoftItem] = useState<Characteristic>(item);
    const handleChange = (newValue: string | boolean | null, field: string) => {
      handleInteraction(item.category, item.id, newValue, field);
    };

    useEffect(() => {}, [item]);
    return (
      <>
        <div style={styles.leftPortion}>
          <Checkbox
            style={{ color: "black", border: "none" }}
            checked={item.checkboxState}
            onClick={() => {
              handleChange(!item.checkboxState, "checkbox");
            }}
          />
          <Typography variant="body1" style={styles.ebitaText}>
            <Tooltip title={item.name}>
              <span>{item?.name}</span>
            </Tooltip>
          </Typography>
        </div>
      </>
    );
  }
);

export default BlockItemSecurity;
