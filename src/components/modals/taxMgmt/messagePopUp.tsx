import React, { useEffect, useRef, useState } from "react";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import { Message } from "./messageChain.tsx";

interface Props {
  flag: any;
  message: Message | null;
  updateFlag: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    display: "flex",
    alignItems: "center",
    padding: "20px 40px",
    // justifyContent: "center",
    height: "80%",
    backgroundColor: "#F4F4F4",
  },
};

const MessageInfo: React.FC<Props> = ({ flag, message, updateFlag }) => {
  const dateStr = message?.dateStr || "";

  const date = new Date(dateStr);

  const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;
  return (
    <ModalType
      type={ModalTypeEnum.MEDIUM}
      open={flag}
      style={styles.modal}
      closeDialog={updateFlag}
      buttons={[]}
    >
      {message && (
        <>
          <div className="mail-header-container">
            <div className="mail-header">{message?.subject}</div>
            <div className="mail-info">
              <div>
                <strong> From: </strong> {message?.from}
              </div>
              <div>
                <strong> To: </strong>
                {message?.to.join(",")}
              </div>
              <div>
                <strong> Date: </strong> {formattedDate}
              </div>
            </div>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: message?.message }}
            className="message-container"
          />
        </>
      )}
    </ModalType>
  );
};

export default MessageInfo;
