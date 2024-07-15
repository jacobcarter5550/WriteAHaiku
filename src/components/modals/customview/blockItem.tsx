import React, { useEffect, useState } from "react";
import { Checkbox, Typography, Tooltip } from "@mui/material";
import { Characteristic } from "./types";

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

const BlockItem: React.FC<BlockItemProps> = React.memo(
  ({ item, handleInteraction }) => {
    const [softItem, setSoftItem] = useState<Characteristic>(item);
    const handleChange = (newValue: string | boolean | null, field: string) => {
      // switch (field) {
      //   case "checkbox":
      //     setSoftItem((prevState: Characteristic) => ({
      //       ...prevState,
      //       checkboxState: typeof newValue === "boolean" ? newValue : false,
      //     }));
      //     break;
      //   case "input1":
      //     setSoftItem((prevState: Characteristic) => ({
      //       ...prevState,
      //       textInputFirst: newValue as string,
      //     }));
      //     break;
      //   case "toggleFirstInput":
      //     setSoftItem((prevState: Characteristic) => ({
      //       ...prevState,
      //       toggleInputFirst: newValue as string,
      //     }));
      //     break;
      //   case "toggleSecondInput":
      //     setSoftItem((prevState: Characteristic) => ({
      //       ...prevState,
      //       toggleInputSecond: newValue as string,
      //     }));
      //     break;
      //   case "input2":
      //     setSoftItem((prevState: Characteristic) => ({
      //       ...prevState,
      //       textInputSecond: newValue as string,
      //     }));
      //     break;
      //   default:
      //     break;
      // }
      handleInteraction(item.category, item.id, newValue, field);
    };

    // useEffect(() => {
    //   const isDifferent =
    //     softItem.checkboxState !== item.checkboxState ||
    //     softItem.textInputFirst !== item.textInputFirst ||
    //     softItem.toggleInputFirst !== item.toggleInputFirst ||
    //     softItem.toggleInputSecond !== item.toggleInputSecond ||
    //     softItem.textInputSecond !== item.textInputSecond;

    //   if (isDifferent) {
    //     setSoftItem(item);
    //   }
    // }, [item]);

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
              <>
                {item.name.slice(0, 15)}
                {item.name.length > 15 && "..."}
              </>
            </Tooltip>
          </Typography>
        </div>
        <div style={styles.rightPortion}>
          <div>
            <input
              type="number"
              style={styles.input}
              onChange={(e) => handleChange(e.target.value, "input1")}
              value={item.textInputFirst}
              placeholder="N/A"
            />
          </div>
          <p style={{ alignSelf: "center" }}>Filter By</p>
          <div>
            <input
              type="number"
              style={styles.input}
              onChange={(e) => handleChange(e.target.value, "input2")}
              value={item.textInputSecond}
              placeholder="N/A"
            />
          </div>
        </div>
      </>
    );
  }
);

export default BlockItem;
