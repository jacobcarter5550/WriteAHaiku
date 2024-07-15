import React from "react";
import { Security } from "./securtityViewTP";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import {
  setSecurityDetails,
  setSecurityModal,
} from "../../../store/nonPerstistant/index.ts";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";

const SecurityMenuBar: React.FC<{
  secDetails: Security;
  moveSec: (increment: boolean) => void;
}> = ({ moveSec }) => {
  const dispatch = useDispatch();
  const nextTheme = useTheme();

  function dispatchSecurityDetails(data: Security | null) {
    dispatch(setSecurityDetails(data));
  }

  function dispatchSecurityModal(data: boolean) {
    dispatch(setSecurityModal(data));
  }

  function closeModal() {
    dispatchSecurityDetails(null);
    dispatchSecurityModal(false);
  }

  return (
    <section className="securityMenuBar">
      <aside>
        {/* <img src="/link.svg" alt="" /> */}
        <aside
          style={{
            display: "flex",
            // borderRight: "2px solid grey",
            // borderLeft: "2px solid grey",
          }}
        >
          <ImageComponent
            src="link.svg"
            alt="link-icon"
            onClick={() => {
              //   moveSec(false);
            }}
            style={{ width: "1.4rem" }}
          />
          <ImageComponent
            src="previous.svg"
            alt="previous-icon"
            onClick={() => {
              moveSec(false);
            }}
          />
          <ImageComponent
            src="next.svg"
            alt="next-icon"
            onClick={() => {
              moveSec(true);
            }}
          />
        </aside>
        {/* <p>Stock_0001 | Ratios-overviews</p> */}
      </aside>
      <aside>
        <ImageComponent
          src="restart.svg"
          alt="restart-icon"
          style={{ width: "1.4rem" }}
        />
        <ImageComponent
          src="close.svg"
          alt="close-icon"
          onClick={() => {
            closeModal();
          }}
          style={{ width: "2rem" }}
        />
      </aside>
    </section>
  );
};

export default SecurityMenuBar;
