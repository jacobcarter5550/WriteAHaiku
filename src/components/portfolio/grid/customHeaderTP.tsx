import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccountIdForSummary } from "../../../store/portfolio/index.ts";
import { constructionFlowAccount } from "./Grid.tsx";
import { setAuthor, setShowLetter, setShowOptimizationDefinition, setShowOverrideConfiguration } from "../../../store/nonPerstistant/index.ts";
import { useNavigate } from 'react-router-dom';
import { InfoIconLightMode } from "../../svgComponent/svgComponent.tsx";

type HeaderProps = {
  displayName: string;
  params: Object;
};

function CustomHeader({ displayName, ...params }: HeaderProps) {


  const navigate = useNavigate();

  function dispatchShowOptimizationDefinition(val: boolean) {
    dispatch(setShowOptimizationDefinition(val));
  }

  function dispatchShowOverrideConfig(val: boolean) {
    dispatch(setShowOverrideConfiguration(val));
  }


  const og = structuredClone(displayName).split(" +")[0];
  const dispatch = useDispatch();
  const [activeColumn, setActiveColumn] = useState(""); // State to store active column ID

  function onGearClick(displayName: string) {
    constructionFlowAccount.value = displayName;

    const currentUrl = window.location.href;

    const urlSegments = currentUrl.split("/");

    const pageDef = urlSegments[urlSegments.length - 1];

    console.log(pageDef);

    switch (pageDef) {
      case "active-equity":
        dispatchShowOverrideConfig(true);
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

  function dispatchShowLetter(val:boolean){
    dispatch(setShowLetter(val))
  }

  function dispatchAuthor(val:string){
    dispatch(setAuthor(val))
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
        <InfoIconLightMode
          style={{ width: "1.5rem", height: "1.5rem", cursor: "pointer" }}
          onClick={() => {
            navigate('/research?type=portfolio')
          }}
        />
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
            onGearClick(og);
            e.stopPropagation();
          }}
          src={"/settings--check.svg"}
          alt="Settings"
        />
      </div>
    </div>
  );
}

export default CustomHeader;
