import React from "react";

const PreviousChatItem: React.FC<{ title: string }> = ({ title }) => {
  return (
    <section
      style={{
        display: "flex",
        padding: ".6rem 1rem",
        minWidth: "8vw",
        gap: "1rem",
        backgroundColor: "white",
        justifyContent: "center",
      }}
    >
      <img src="/message.svg" alt="" style={{ width: "1em" }} />
      <p>{title}</p>
      <img src="/trash-can.svg" alt="" style={{ width: "1em" }} />
    </section>
  );
};

export default PreviousChatItem;
