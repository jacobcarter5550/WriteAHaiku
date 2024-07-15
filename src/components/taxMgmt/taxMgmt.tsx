import React, { useState } from "react";
import PorfolioActivityDashboard from "./portfolioActivityDashboard.tsx";
import Portfolio from "./demographics.tsx";
import BreadCrumb from "../portfolio/misc/breadcrumbTP.tsx";
import AccountantGrid from "./taxGrid.tsx";
import AdvisorClientDashboard from "../modals/taxMgmt/advisorClientDashboard.tsx";
import Status from "../portfolio/misc/statusTP.tsx";
import TaxProjection from "./taxProjection.tsx";
import ProjectionActivityDashboard from "./projectionActivityDashboard.tsx";
import api from "../../helpers/serviceTP.ts";
import { toast } from "react-toastify";

const TaxMgmtDashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const data: string = ``;
  const [approve, setApprove] = useState<boolean>(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [content, setContent] = useState<string>(data);
  const [messageId, setMessageId] = useState("");

  const handleClose = () => {
    setOpen(false);
  };
  const handleData = (id) => {
    document.querySelectorAll(".cds--tree-node--active").forEach((div) => {
      div.classList.remove("cds--tree-node--selected");
      div.classList.remove("cds--tree-node--active");
    });
    const element = document.getElementById(`${id}`);
    if (element) {
      element.classList.add("cds--tree-node--selected");
      element.classList.add("cds--tree-node--active");
    }
    setApprove(false);
    setAccountId(id);
    api
      .get(
        `${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advice/get?accountId=${id}`
      )
      .then((res) => {
        setContent(res.data.message);
        setMessageId(res.data.messageId);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      <div className="tax-accountant-wrapper">
        <div className="tax-wrapper">
          <Portfolio />
          <PorfolioActivityDashboard handleData={handleData} />
          {/* <ProjectionActivityDashboard /> */}
        </div>
        <AccountantGrid
          handleData={handleData}
          approve={approve}
          setApprove={setApprove}
          accountId={accountId}
          setAccountId={setAccountId}
          content={content}
          setContent={setContent}
          messageId={messageId}
        />
        {/* <TaxProjection /> */}
        <AdvisorClientDashboard handleClose={handleClose} open={open} />
      </div>
    </>
  );
};

export default TaxMgmtDashboard;
