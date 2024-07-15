import React, { useEffect, useState } from "react";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import api from "../../../helpers/serviceTP.ts";
import MessageInfo from "./messagePopUp.tsx";
import { DialogTitle } from "@mui/material";

export interface Message {
  dateStr: string;
  from: string;
  message: string;
  subject: string;
  to: string[];
}

interface Props {
  open: boolean;
  accountId: number | null;
  handleClose: () => void;
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

const MailChain: React.FC<Props> = ({ open, handleClose, accountId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessageFlag, setShowMessageFlag] = useState<boolean>(false);
  const [updatedMessage, setUpdatedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (accountId) {
      setMessages([]);
      api
        .get(
          `${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advice/correspondence?accountId=${accountId}`
        )
        .then((res) => {
          setMessages(res.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [accountId, showMessageFlag]);

  const closeModal = () => {
    setShowMessageFlag(false);
    setMessages([]);
  };

  const handlePopup = (message: Message) => {
    setShowMessageFlag(true);
    setUpdatedMessage(message);
  };

  return (
    <ModalType
      type={ModalTypeEnum.MEDIUM}
      open={open}
      style={styles.modal}
      closeDialog={handleClose}
      buttons={[]}
    >
      {/* <DialogTitle
        textAlign="center"
        fontSize={"2rem"}
        fontWeight={"500"}
      >
       Messages
      </DialogTitle> */}

      <div className="list-container">
        <div className="mail-header">List of Emails sent</div>
        <ul className="message-chain-list">
          {messages.map((item, index) => (
            <li key={index} className="message-list">
              <span>{item.dateStr}</span>
              <span>{item.from}</span>
              <a href="#" onClick={() => handlePopup(item)}>
                Click here
              </a>
            </li>
          ))}
        </ul>
      </div>

      <MessageInfo
        flag={showMessageFlag}
        message={updatedMessage}
        updateFlag={closeModal}
      />
    </ModalType>
  );
};

export default MailChain;
