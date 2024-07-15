import React, { useState } from "react";
import PorfolioActivityDashboard from "./portfolioActivityDashboard.tsx";
import Portfolio from "./demographics.tsx";
import BreadCrumb from "../portfolio/misc/breadcrumbTP.tsx";
import AccountantGrid from "./taxGrid.tsx";
import AdvisorClientDashboard from "../modals/taxMgmt/advisorClientDashboard.tsx";
import Status from "../portfolio/misc/statusTP.tsx";
import TaxProjection from "./taxProjection.tsx";
import ProjectionActivityDashboard from "./projectionActivityDashboard.tsx";

const ProjectionManagementDashboard: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="tax-accountant-wrapper">
        <div className="tax-wrapper">
          <Portfolio />
          {/* <PorfolioActivityDashboard /> */}
          <ProjectionActivityDashboard />
        </div>
        {/* <AccountantGrid /> */}
        <TaxProjection />
        <AdvisorClientDashboard handleClose={handleClose} open={open} />
      </div>
    </>
  );
};

export default ProjectionManagementDashboard;
