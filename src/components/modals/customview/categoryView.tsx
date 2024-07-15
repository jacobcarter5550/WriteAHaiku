import React from "react";
import { Characteristic } from "./types";
import BlockItem from "./blockItem.tsx";

interface Props {
  categoryData: Characteristic[];
  handleInteraction: (
    category: string,
    id: number | null,
    value: string | boolean | null,
    action: string
  ) => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  blockContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  block: {
    display: "flex",
    gap: "2rem",
    padding: "5px 20px 5px 12px",
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
    gap: "10px",
  },
  input: {
    width: "42px",
    margin: "0 8px 0 0",
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

const CategoryView: React.FC<Props> = ({ categoryData, handleInteraction }) => {
  return (
    <div>
      {categoryData?.map((item, index) => (
        <div key={index} style={styles.blockContainer}>
          <div style={styles.block}>
            <BlockItem item={item} handleInteraction={handleInteraction} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryView;
