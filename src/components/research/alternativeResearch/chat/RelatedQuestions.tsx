import React from "react";
import CustomSelect from "../../../../ui-elements/selectTP.tsx";
import { ClickableTile, Select } from "@carbon/react";
import CustomDropdown from "../../../../ui-elements/carbonDropdownTP.tsx";

const RelatedQuestions: React.FC<{
  setQuestion: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setQuestion }) => {
  const questions = [
    "Can you analyze the impact of social media sentiment on tech stock prices?",
    "Can you perform a SWOT analysis for JPMorgan Corporation?",
    "What are the implications of recent changes in trade policies on global markets?",
  ];

  return (
    <div className="question-container">
      <aside style={{ width: "100%" }}>
        <div className="question-heading">Related Questions</div>
        <section>
          {questions.map((item) => {
            return (
              <ClickableTile
                onClick={() => {
                  setQuestion(item);
                }}
              >
                {item}
              </ClickableTile>
            );
          })}
        </section>
      </aside>
    </div>
  );
};

export default RelatedQuestions;
