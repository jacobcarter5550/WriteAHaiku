import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccountIdForSummary } from "../../store/portfolio/index.ts";

import { useSignals } from "@preact/signals-react/runtime";
import {
  setAuthor,
  setOverrideConfigAccount,
  setShowLetter,
  setShowOptimizationDefinition,
  setShowOverrideConfiguration,
} from "../../store/nonPerstistant/index.ts";

type HeaderProps = {
  displayName: string;
  params: any;
};

function AECustomHeader({ displayName, params }: HeaderProps) {
  useSignals();
  console.log(params);
  function dispatchShowOptimizationDefinition(val: boolean) {
    dispatch(setShowOptimizationDefinition(val));
  }

  function dispatchOverrideConfig(val: boolean) {
    dispatch(setShowOverrideConfiguration(val));
  }

  const og = structuredClone(displayName).split(" +")[0];
  const dispatch = useDispatch();
  const [activeColumn, setActiveColumn] = useState(""); // State to store active column ID

  function dispatchOverrideConfigAccount(val: string) {
    dispatch(setOverrideConfigAccount(val));
  }

  function onGearClick(account: string) {
    dispatchOverrideConfigAccount(account);

    const currentUrl = window.location.href;

    const urlSegments = currentUrl.split("/");

    const pageDef = urlSegments[urlSegments.length - 1];

    console.log(pageDef);

    switch (pageDef) {
      case "active-equity":
        dispatchOverrideConfig(true);
        break;
      case "dashboard":
        dispatchShowOptimizationDefinition(true);
        break;
      default:
        dispatchShowOptimizationDefinition(true);
    }
  }

  const handleAccount = (id: string) => {
    setActiveColumn(id); // Set current column active
    dispatch(setAccountIdForSummary(id));
  };

  function dispatchShowLetter(val: boolean) {
    dispatch(setShowLetter(val));
  }

  function dispatchAuthor(val: string) {
    dispatch(setAuthor(val));
  }

  return (
    <div
      className={`header-link ${
        activeColumn === displayName.split(" +")[1] ? "active" : ""
      }`}
      onClick={() => handleAccount(displayName.split(" +")[1])}
    >
      <span>{displayName.split("+")[0]}</span>
      <div className="icons">
        {/* <Tooltip title="Custom label"> */}
        <img
          src={"/doc.svg"}
          alt="Document"
          onClick={() => {
            dispatchAuthor(displayName);
            dispatchShowLetter(true);
          }}
        />
        {/* </Tooltip> */}
        <img src={"/mic.svg"} alt="Microphone" />
        <img
          onClick={(e) => {
            // onGearClick(params.);
            onGearClick(og);
            // e.stopPropagation();
          }}
          src={"/settings--check.svg"}
          alt="Settings"
        />
      </div>
    </div>
  );
}

export default AECustomHeader;
