import React from "react";
import Heading from "../../../ui-elements/headingTP.tsx";

const Status = () => {
  return (
    <>
      <section className="status-section">
        <div className="status-bar">
          <Heading variant="h1" text={"Status"} />
          <p>
            Portfolio Construction completed by both MVO and LLM Optimization
          </p>
        </div>
      </section>
    </>
  );
};

export default Status;
