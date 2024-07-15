import React, { useEffect, useState } from "react";
import { Characteristic, ListData } from "./types";
import CategoryView from "./categoryView.tsx";
import { Virtuoso } from "react-virtuoso";
import BlockItem from "./blockItem.tsx";

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
};
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

const LeftBlock: React.FC<Props> = ({
  listData,
  handleInteraction,
  handleSelectAll,
}) => {
  const [list, setList] = useState<Characteristic[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!initialized) {
      const arraysToPush = Object.keys(listData)
        .filter((item) => item !== "message")
        .reduce((accumulator, char) => {
          return accumulator.concat(listData[char][char]);
        }, []);
      setList((prevList) => [...prevList, ...arraysToPush]);
      setInitialized(true);
    } else {
      const arraysToPush = Object.keys(listData)
        .filter((item) => item !== "message")
        .reduce((accumulator, char) => {
          return accumulator.concat(listData[char][char]);
        }, []);
      setList(arraysToPush);
    }
  }, [listData]);
  return (
    <div className="list-container">
      <div className="select-all" onClick={handleSelectAll}>
        Select all
      </div>
      <div className="block-item-list">
        <Virtuoso
          style={{ height: "36vh", paddingBottom: "20px" }}
          totalCount={list?.length}
          data={list}
          itemContent={(index, item) => (
            <div style={styles.block}>
              <BlockItem
                key={index}
                item={item}
                handleInteraction={handleInteraction}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default LeftBlock;
