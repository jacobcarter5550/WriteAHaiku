import React, { useState } from "react";
import { Typography, Checkbox, IconButton, Tooltip } from "@mui/material";
import { Characteristic, ListData } from "./types";
import BlockItem from "./blockItem.tsx";
import { Virtuoso } from "react-virtuoso";

interface Props {
  listData: ListData;
  handleInteraction: (
    category: string,
    id: number | null,
    value: string | boolean | null,
    action: string
  ) => void;
  handleSelectAll: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  blockContainer: {
    display: "flex",
    flexDirection: "column",
    // gap: "2rem",
  },
  block: {
    display: "flex",
    gap: "15px",
    padding: "3px 3px",
    justifyContent: "space-between",
    border: "1px solid #8D8D8D",
  },
  selectedBlock: {
    backgroundColor: "#8d8d8d33",
  },
  innerBlock: {
    display: "flex",
    gap: "1.6rem",
    padding: "7px",
    justifyContent: "space-between",
    border: "1px solid #8D8D8D",
    margin: "1.8rem 0 2rem 6%",
  },
  summary: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  rightPortion: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  leftPortion: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    width: "42px",
    color: "#525252",
    height: "38px",
    border: "1px solid #E0E0E0",
    boxShadow: "none",
  },
  titleText: {
    color: "#525252",
    fontSize: "1.2rem",
  },
  filterByText: {
    color: "#525252",
    fontSize: "1.2rem",
  },
  drawerContent: {
    border: "1px solid #8D8D8D",
    padding: "10px",
    marginTop: "10px",
    display: "none",
  },
};

function camelCaseToPascalCase(title: string) {
  let result = "";

  for (let i = 0; i < title.length; i++) {
    let char = title.charAt(i);
    if (char === char.toUpperCase() && i !== 0) {
      result += " ";
    }
    if (i === 0) {
      char = char.toUpperCase();
    }
    result += char;
  }
  return result;
}
const RightBlock: React.FC<Props> = ({
  listData,
  handleInteraction,
  handleSelectAll,
}) => {
  const [drawerOpen, setDrawerOpen] = useState<{ [blockId: string]: boolean }>(
    {}
  );
  const toggleDrawer = (blockId: string) => {
    setDrawerOpen((prevState) => ({
      ...prevState,
      [blockId]: !prevState[blockId],
    }));
  };
  const handleClickOuterCheckBox = (checkboxState: boolean, title: string) => {
    listData[title][title].forEach((item: Characteristic) => {
      handleInteraction(title, item.id, !checkboxState, "checkbox");
    });
    handleInteraction(title, null, !checkboxState, "outerCheckbox");
  };

  return (
    <div style={styles.blockContainer} className="list-container">
      <div className="select-all" onClick={handleSelectAll}>
        Select all
      </div>

      <div className="block-item-list">
        {Object.keys(listData)
          .filter((item) => item !== "message")
          .map((key, index) => (
            <BlockWithDrawer
              key={`block${index}`}
              blockId={`block${index}`}
              toggleDrawer={toggleDrawer}
              drawerOpen={drawerOpen[`block${index}`]}
              title={key}
              data={listData[`${key}`]}
              handleInteraction={handleInteraction}
              handleClickOuterCheckBox={handleClickOuterCheckBox}
            />
          ))}
      </div>
    </div>
  );
};

interface BlockWithDrawerProps {
  blockId: string;
  toggleDrawer: (blockId: string) => void;
  drawerOpen: boolean;
  title: string;
  data: { outerCheckBoxState: boolean; characteristics: Characteristic[] };
  handleInteraction: (
    category: string,
    id: number | null,
    value: string | boolean | null,
    action: string
  ) => void;
  handleClickOuterCheckBox: (checkboxState: boolean, title: string) => void;
}

const BlockWithDrawer: React.FC<BlockWithDrawerProps> = ({
  blockId,
  toggleDrawer,
  drawerOpen,
  title,
  data,
  handleInteraction,
  handleClickOuterCheckBox,
}) => {
  return (
    <div>
      {data[`${title}`]?.length > 0 && (
        <div
          style={{
            ...styles.block,
            ...(drawerOpen ? styles.selectedBlock : {}),
          }}
        >
          <div style={styles.summary}>
            <Checkbox
              style={{ color: "black", border: "none" }}
              checked={data.outerCheckBoxState}
              onClick={() =>
                handleClickOuterCheckBox(data.outerCheckBoxState, title)
              }
            />
            <IconButton
              onClick={() => toggleDrawer(blockId)}
              sx={{ padding: "0" }}
            >
              {drawerOpen ? (
                <img src="/expandDown.svg" alt="expand" />
              ) : (
                <img src="/expandUp.svg" alt="expand" />
              )}
            </IconButton>
            <Typography variant="body1" style={styles.titleText}>
              {camelCaseToPascalCase(title)}
            </Typography>
          </div>
        </div>
      )}

      <Virtuoso
        style={{
          height: drawerOpen ? "36vh" : "0",
          display: drawerOpen ? "block" : "none",
          marginBottom: "20px",
          paddingBottom: "20px",
        }}
        totalCount={data[`${title}`].length}
        data={data[`${title}`]}
        itemContent={(index, item) => (
          <div
            key={item.id}
            style={{
              ...styles.innerBlock,
              display: drawerOpen ? "flex" : "none",
            }}
          >
            <BlockItem item={item} handleInteraction={handleInteraction} />
          </div>
        )}
      />
    </div>
  );
};

export default RightBlock;
