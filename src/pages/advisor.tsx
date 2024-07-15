import React, { useEffect } from "react";
import Mermaid from "../components/advisor/Mermaid.tsx";
import SectionComponent from "../ui-elements/SectionComponent.tsx";
import Button from "../ui-elements/buttonTP.tsx";
import ImageComponent from "../ui-elements/ImageComponent.tsx";
import MERMAID_CONFIG from "../components/modals/acioModal/mermaidConfig.ts";

const Advisor: React.FC<{}> = ({}) => {
  return (
    <section>
      <div style={{ display: "flex", padding: "1rem" }}>
        <Button label="Generate" onClick={() => {}} />
        <Button
          label={<ImageComponent src="play.svg" style={{ width: "1vw" }} />}
        />
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "35vw", marginLeft: "5vw" }}>
          <Mermaid
            config={MERMAID_CONFIG}
            chart={`
          graph TD;
              _start_[_start_]:::startclass;
              _end_[_end_]:::endclass;
              macro_node([macro_node]):::otherclass;
              micro_node([micro_node]):::otherclass;
              portfolio_optimize_node([portfolio_optimize_node]):::otherclass;
              explainable_investing_generate([explainable_investing_generate]):::otherclass;
              explainable_investing_review([explainable_investing_review]):::otherclass;
              brief_generate([brief_generate]):::otherclass;
              brief_review([brief_review]):::otherclass;
              macro_triggers_generate([macro_triggers_generate]):::otherclass;
              macro_triggers_review([macro_triggers_review]):::otherclass;
              micro_triggers_generate([micro_triggers_generate]):::otherclass;
              micro_triggers_review([micro_triggers_review]):::otherclass;
              brief_consistency_review([brief_consistency_review]):::otherclass;
              macro_triggers_consistency_node([macro_triggers_consistency_node]):::otherclass;
              explainable_investing_consistency_review([explainable_investing_consistency_review]):::otherclass;
              _start_ --> macro_triggers_generate;
              brief_generate --> brief_review;
              explainable_investing_generate --> explainable_investing_review;
              macro_node --> micro_node;
              macro_triggers_generate --> macro_triggers_review;
              micro_node --> portfolio_optimize_node;
              micro_triggers_generate --> micro_triggers_review;
              portfolio_optimize_node --> explainable_investing_generate;
              explainable_investing_review -.-> explainable_investing_generate;
              explainable_investing_review -.-> explainable_investing_consistency_review;
              explainable_investing_consistency_review -.-> explainable_investing_generate;
              explainable_investing_consistency_review -.-> brief_generate;
              brief_review -.-> brief_generate;
              brief_review -.-> brief_consistency_review;
              brief_consistency_review -.-> brief_generate;
              brief_consistency_review -.-> _end_;
              macro_triggers_review -.-> macro_triggers_generate;
              macro_triggers_review -.-> macro_triggers_consistency_node;
              macro_triggers_review -.-> _end_;
              macro_triggers_consistency_node -.-> macro_triggers_generate;
              macro_triggers_consistency_node -.-> macro_node;
              macro_triggers_consistency_node -.-> _end_;
              micro_triggers_review -.-> micro_triggers_generate;
              micro_triggers_review -.-> micro_node;
              micro_triggers_review -.-> _end_;
              classDef startclass fill:F4F4F4;
              classDef endclass fill:F4F4F4;
              classDef otherclass fill:F4F4F4;
              click macro_node clickNode "You're hovering over macro_node";
              click micro_node clickNode "You're hovering over micro_node";
              click portfolio_optimize_node clickNode "You're hovering over portfolio_optimize_node";
              click explainable_investing_generate clickNode "You're hovering over explainable_investing_generate";
              click explainable_investing_review clickNode "You're hovering over explainable_investing_review";
              click brief_generate clickNode "You're hovering over brief_generate";
              click brief_review clickNode "You're hovering over brief_review";
              click macro_triggers_generate clickNode "You're hovering over macro_triggers_generate";
              click macro_triggers_review clickNode "You're hovering over macro_triggers_review";
              click micro_triggers_generate clickNode "You're hovering over micro_triggers_generate";
              click micro_triggers_review clickNode "You're hovering over micro_triggers_review";
              click brief_consistency_review clickNode "You're hovering over brief_consistency_review";
              click macro_triggers_consistency_node clickNode "You're hovering over macro_triggers_consistency_node";
              click explainable_investing_consistency_review clickNode "You're hovering over explainable_investing_consistency_review";
              classDef active fill:#363987,stroke:#333,stroke-width:4px,color:#fff;
              macro_triggers_generate:::active;`}
          />
        </div>
        <section
          className="advisorReport"
          style={{
            width: "45vw",
            backgroundColor: "white",
            padding: "1rem",
            height: "85vh",
          }}
        >
          <h1>Macroeconomic Insights</h1>
          <div className="insight">
            <h2>Interest Rate Insights</h2>
            <p>
              The Federal Reserve has kept the interest rate range steady at
              5.25% to 5.50%. This stability suggests a cautious approach to
              monetary policy, indicating a potential slowdown in economic
              growth.
            </p>
            <table>
              <tr>
                <th>Indicator</th>
                <th>Current Value</th>
                <th>Previous Value</th>
              </tr>
              <tr>
                <td>Fed Interest Rate</td>
                <td>5.25% to 5.50%</td>
                <td>5.25% to 5.50%</td>
              </tr>
            </table>
            <p>
              Impact on Portfolio:{" "}
              <strong>
                <strong className="impact_percentage">0%</strong>
              </strong>
            </p>
          </div>
          <div className="insight">
            <h2>Inflation Insights</h2>
            <p>
              Monthly inflation rate has decreased to 3.36%, compared to 3.48%
              last month and 4.93% last year. This decline suggests a potential
              easing of price pressures.
            </p>
            <table>
              <tr>
                <th>Indicator</th>
                <th>Current Value</th>
                <th>Previous Value</th>
              </tr>
              <tr>
                <td>Monthly Inflation Rate</td>
                <td>3.36%</td>
                <td>3.48%</td>
              </tr>
              <tr>
                <td>Monthly Inflation Rate (Last Year)</td>
                <td>4.93%</td>
                <td>-</td>
              </tr>
            </table>
            <p>
              Impact on Portfolio:{" "}
              <strong>
                <strong className="impact_percentage">-0.5%</strong>
              </strong>
            </p>
          </div>
          <div className="insight">
            <h2>Unemployment Insights</h2>
            <p>
              The US unemployment rate has increased to 3.90%, compared to 3.80%
              last month and 3.40% last year. This rise suggests a potential
              slowdown in labor market growth.
            </p>
            <table>
              <tr>
                <th>Indicator</th>
                <th>Current Value</th>
                <th>Previous Value</th>
              </tr>
              <tr>
                <td>US Unemployment Rate</td>
                <td>3.90%</td>
                <td>3.80%</td>
              </tr>
              <tr>
                <td>US Unemployment Rate (Last Year)</td>
                <td>3.40%</td>
                <td>-</td>
              </tr>
            </table>
            <p>
              Impact on Portfolio:{" "}
              <strong>
                <strong className="impact_percentage">-1.2%</strong>
              </strong>
            </p>
          </div>
          <div className="final_decision">Rerun Model: YES</div>
        </section>
      </div>
    </section>
  );
};

export default Advisor;
