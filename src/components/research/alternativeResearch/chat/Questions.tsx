import React from "react";
import CustomSelect from "../../../../ui-elements/selectTP.tsx";
import { ClickableTile, Select } from "@carbon/react";
import CustomDropdown from "../../../../ui-elements/carbonDropdownTP.tsx";

const Questions: React.FC<{
  setQuestion: React.Dispatch<React.SetStateAction<string | null>>;
  session: any | null;
  initSession: () => void;
}> = ({ setQuestion, session, initSession }) => {
  const questions = [
    "What are the key macro surprises?",
    "What are the key sector/style surprises?",
    "Can you provide Nvidia data insights?",
    "Can you share Nvidia research sheets?",
  ];

  // const questions1 = [
  //   "Tell me about Nvidia Stock"
  // ];

  return (
    <aside
      style={{
        paddingLeft: "1.5rem",
        width: "100%",
        position: "relative",
        top: "-20vh",
      }}
    >
      <div style={{ textAlign: "center" }} className="question-heading">
        How can I help you today?
      </div>

      {/* <CustomDropdown
        inline
        items={[
          {
            id: "option1",
            text: <p>Micro Research</p>,
          },
        ]}
        label={"Micro Research"}
      /> */}
      <section className="list-wrapper">
        {questions.map((item) => {
          return (
            <ClickableTile
            style={{height: "7rem", width: "100%"}}
              onClick={() => {
                if (session == null) {
                  initSession();
                }
                setQuestion(item);
              }}
            >
              {item}
            </ClickableTile>
          );
        })}
      </section>
    </aside>
  );
};

export default Questions;
