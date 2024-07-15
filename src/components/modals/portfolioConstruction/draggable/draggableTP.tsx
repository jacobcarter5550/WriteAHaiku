import React from "react";
import { useDrag } from "react-dnd";
import { GenericSelctionOption } from "../types";
import ImageComponent from "../../../../ui-elements/ImageComponent.tsx";

export type DraggableItemProps = {
  openModal: (arg?: any) => any;
  definitions: (string | object)[];
  setDefinitions: React.Dispatch<React.SetStateAction<(string | object)[]>>;
  index: number;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  item: GenericSelctionOption;
};

const DraggableItem: React.FC<DraggableItemProps> = ({
  openModal,
  definitions,
  setDefinitions,
  index,
  item,
}) => {
  const name = item.title;
  const id = item.id;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: "item",
    item: { name, id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const addItemAfterIndex = () => {
    const newDefinitions = structuredClone(definitions);
    newDefinitions.splice(index + 1, 0, { edit: true, val: name });
    setDefinitions(newDefinitions);
  };

  return (
    <li
      ref={drag}
      draggable
      style={{ cursor: "pointer", backgroundColor: "#ffffff" }}
    >
      <span>{name}</span>
      <div className="icons">
        <button style={{ cursor: "pointer" }} className="common-btn">
          <ImageComponent
            onClick={() => {
              openModal();
            }}
            src="newEdit.svg"
            alt="edit-icon"
          />
        </button>
        <button style={{ cursor: "pointer" }} className="common-btn">
          <ImageComponent
            onClick={addItemAfterIndex}
            src="newCopy.svg"
            alt="copy-icon"
          />
        </button>
        <button style={{ cursor: "pointer" }} className="common-btn download">
          <ImageComponent
            onClick={addItemAfterIndex}
            src="newDownload.svg"
            alt="download-icon"
          />
        </button>
      </div>
    </li>
  );
};

export default DraggableItem;
