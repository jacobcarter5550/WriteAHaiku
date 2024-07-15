import React from "react";
import DynamicForm from "./DynamicForm.tsx";
import Button from "../../../ui-elements/buttonTP.tsx";

type Props = {};

interface FormElement {
  id: string;
  labelName: string;
  inputType: "TextField" | "Dropdown";
  options?: string[]; // Only needed if inputType is 'Dropdown'
}

const AccountSetupFirst = (props: Props) => {
  const formElements: FormElement[] = [
    { id: "accountName", labelName: "Account Name", inputType: "TextField" },
    {
      id: "benchmark",
      labelName: "Benchmark",
      inputType: "Dropdown",
      options: ["USA", "Canada", "UK"],
    },
    {
      id: "investmentTeam",
      labelName: "Investment Team",
      inputType: "Dropdown",
      options: ["USA", "Canada", "UK"],
    },
    {
      id: "initialInvestment",
      labelName: "Initial Investment",
      inputType: "TextField",
    },
    {
      id: "portfolioManager",
      labelName: "Portfolio Manager",
      inputType: "Dropdown",
      options: ["USA", "Canada", "UK"],
    },
    { id: "cashLevel", labelName: "Cash Level", inputType: "TextField" },
    {
      id: "investibleUniverse",
      labelName: "Investible Universe",
      inputType: "Dropdown",
      options: ["USA", "Canada", "UK"],
    },
    { id: "comments", labelName: "Comments", inputType: "TextField" },
  ];
  return (
    <div className="step-one-main-container">
      <h1>New Account Setup (Step 1)</h1>
      {/* <DynamicForm elements={formElements} /> */}
      <div className="import-account-container">
        <div className="import-account-header">
          <span>Upload Existing Portfolio:</span>
          <Button
            label={"Download Template"}
            className={"pop-btn"}
            onClick={() => console.log("Upload")}
            style={{
              height: "2.7rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0,
            }}
          />
        </div>
        <div className="import-account-drag-container">
          <div className="drag-image-container">{/* Drag & Drop here  */}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetupFirst;
