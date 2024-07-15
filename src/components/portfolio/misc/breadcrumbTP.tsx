/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { getCurrentNode } from "../../../store/portfolio/selector.ts";
import { useAppSelector } from "../../../store/index.ts";


const BreadCrumb: React.FC<{}> = () => {
  const currentNode = useAppSelector(getCurrentNode);

  const [state, setState] = useState<string>("Home");

  useEffect(() => {
    const newState = "Home";
    setState(newState);
  }, [currentNode]);

  const truncateText = (text: string, maxLength: number): string => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <>
      <section className="breadcrumb-section">
        <div className="status-bar" style={{ fontSize: "1.2rem" }}>
          {state && (
            <>
              <span title={state}>{truncateText(state, 20)}</span>
              {currentNode?.dataPath && currentNode?.dataPath.length > 0 && (
                <>
                  {" > "}
                  <span title={currentNode?.dataPath.join(" > ")}>
                    {truncateText(currentNode?.dataPath.join(" > "), 20)}
                  </span>
                </>
              )}
              {currentNode?.default && (
                <>
                  {" > "}
                  <a href="#" title={currentNode?.default}>
                    {truncateText(currentNode?.default, 20)}
                  </a>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BreadCrumb;
