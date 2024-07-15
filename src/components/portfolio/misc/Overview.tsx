import React, { useEffect, useState } from "react";
import Heading from "../../../ui-elements/headingTP.tsx";
import api from "../../../helpers/serviceTP.ts";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import { connect, useDispatch } from "react-redux";
import { Portfolio } from "../portfolioLib.tsx";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountIdForSummary } from "../../../store/portfolio/selector.ts";
import "../../../index.scss";
import "../../../styles/overview.scss";
import {
  getActiveDynamicPortfolioFilterId,
  getCurrentOpen,
} from "../../../store/nonPerstistant/selectors.ts";
import { setCurrentOpen } from "../../../store/nonPerstistant/index.ts";
import { useTheme } from "next-themes";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import SectionComponent from "../../../ui-elements/SectionComponent.tsx";

export interface PortfolioOverviewProps {
  overviewRef: any;
}

const Overview: React.FC<PortfolioOverviewProps> = ({ overviewRef }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const accountIDforSummary = useAppSelector(getAccountIdForSummary);

  function dispatchCurrentOpen(val: boolean) {
    dispatch(setCurrentOpen(val));
  }

  const currentOpen = useAppSelector(getCurrentOpen);

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const activeDynamicPortfolioFilterId = useAppSelector(
    getActiveDynamicPortfolioFilterId
  );

  useEffect(() => {
    // action apis
    try {
      const url = activeDynamicPortfolioFilterId
        ? `/portfolio/all?filter=${activeDynamicPortfolioFilterId}`
        : "/portfolio/all/";
      api
        .get(url)
        .then((res: any) => {
          if (res.data.accountDetailViews) {
            setPortfolios(res.data.accountDetailViews);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log("toasted");
    }
  }, [activeDynamicPortfolioFilterId]);

  useEffect(() => {
    if (accountIDforSummary !== null) {
      const portfolioInfo = portfolios.find(
        (obj) => obj.accountId === Number(accountIDforSummary)
      );
      portfolioInfo && setPortfolio(portfolioInfo);
    }
  }, [accountIDforSummary, portfolios]);

  return (
    <>
      <SectionComponent
        style={{ display: "flex", alignItems: "center", height: "5vh" }}
        className="portfolio-summary"
        ref={overviewRef}
      >
        <div
          className="summary-items"
          style={{ width: "-webkit-fill-available" }}
        >
          <div className="item-block overview-heading">
            <Heading
              variant={"h4"}
              text={"Portfolio Overview:"}
              style={{ whiteSpace: "nowrap", fontWeight: 600 }}
            />
          </div>
          <section
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
              alignItems: "center",
              fontSize: "1.1rem",
            }}
          >
            <div className="item-block">
              <Tooltip
                title={portfolio?.accountManagerId}
                placement="right-start"
              >
                <ImageComponent
                  src="infoIcon.svg"
                  alt="infoIcon-icon"
                  style={{
                    color: "525252",
                    width: "1.35rem",
                    height: "1.35rem",
                    padding: "2px 3px 2px 0",
                  }}
                  className="info-position"
                />
              </Tooltip>
              <label>Acct ID</label>
              <span>{portfolio?.accountManagerId}</span>
            </div>
            <div className="item-block">
              <label>Acct. Name</label>
              <span>{portfolio?.accountFullName}</span>
            </div>
            {portfolio?.id && (
              <div className="item-block">
                <label>Acct. Type</label>
                <span>{portfolio?.accountId}</span>
              </div>
            )}
            {/* <div className="item-block">
                            <label>Region CD</label>
                            <span>{portfolio?.regionCd}</span>
                        </div> */}
            <div className="item-block">
              <label>Mgr. name</label>
              <span>{portfolio?.managerName}</span>
            </div>
            {portfolio?.effectiveEndDate && (
              <div className="item-block">
                <label>Creation DT</label>
                <span>{portfolio?.effectiveEndDate}</span>
              </div>
            )}
            <div className="item-block">
              <label>Start DT</label>
              <span>{moment(portfolio?.effectiveStartDate).format("L")}</span>
            </div>
            {portfolio?.id && (
              <div className="item-block">
                <label>Change DT</label>
                <span>{portfolio?.accountId}</span>
              </div>
            )}
            <div className="item-block">
              <label>End DT</label>
              <span>{moment(portfolio?.effectiveEndDate).format("L")}</span>
            </div>
            {portfolio?.id && (
              <div className="item-block">
                <label>Description</label>
                <span>{portfolio?.accountId}</span>
              </div>
            )}
          </section>
        </div>
        {currentOpen && (
          <span
            style={{
              position: "relative",
              width: ".01px",
              transform: "rotate(180deg)",
              left: "1rem",
            }}
          >
            <img
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatchCurrentOpen(!currentOpen);
              }}
              src="/sideCollapse.svg"
              alt=""
            />
          </span>
        )}
      </SectionComponent>
    </>
  );
};

export default Overview;
