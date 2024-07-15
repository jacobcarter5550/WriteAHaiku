import React from "react";
import RightBlockModels from "./rightBlockModels.tsx";

function StrategicAssetAllocation() {
  const data = [
    {
      id: 1,
      assetClass: "Main Asset Classes",
      items: [
        {
          opportunitySet: "Global Equities",
          uw: false,
          n: true,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Earnings downgrade cycle has turned, and multiples supported by easier monetary conditions",
        },
        {
          opportunitySet: "Equity Duration",
          uw: true,
          n: false,
          ow: false,
          change: "Decreased",
          conviction: "Medium",
          description:
            "Peak in yeilds behind us as we move to cutting cycle; yields may decline slowly, but >4% coupon is attractive",
        },
        {
          opportunitySet: "Cash Equivalents",
          uw: false,
          n: false,
          ow: true,
          change: "No Change",
          conviction: "Low",
          description:
            "Carry attractive in base case of no recession; some spread tighening potential in high yield",
        },
        {
          opportunitySet: "Credit Equities",
          uw: false,
          n: false,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Cash returns sent to fall as cutting cycle begins; long-term USD rates likely nearer 2.5% than 5.5%",
        },
      ],
    },

    {
      id: 2,
      assetClass: "Currency",
      items: [
        {
          opportunitySet: "USD",
          uw: false,
          n: true,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Earnings downgrade cycle has turned, and multiples supported by easier monetary conditions",
        },
        {
          opportunitySet: "EUR",
          uw: true,
          n: false,
          ow: false,
          change: "Decreased",
          conviction: "Medium",
          description:
            "Peak in yeilds behind us as we move to cutting cycle; yields may decline slowly, but >4% coupon is attractive",
        },
        {
          opportunitySet: "JPY",
          uw: false,
          n: false,
          ow: true,
          change: "No Change",
          conviction: "Low",
          description:
            "Carry attractive in base case of no recession; some spread tighening potential in high yield",
        },
        {
          opportunitySet: "INR",
          uw: false,
          n: false,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Cash returns sent to fall as cutting cycle begins; long-term USD rates likely nearer 2.5% than 5.5%",
        },
      ],
    },
  ];

  const data2 = [
    {
      id: 1,
      assetClass: "Equities",
      items: [
        {
          opportunitySet: "Global Equities",
          uw: false,
          n: true,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Earnings downgrade cycle has turned, and multiples supported by easier monetary conditions",
        },
        {
          opportunitySet: "Equity Duration",
          uw: true,
          n: false,
          ow: false,
          change: "Decreased",
          conviction: "Medium",
          description:
            "Peak in yeilds behind us as we move to cutting cycle; yields may decline slowly, but >4% coupon is attractive",
        },
        {
          opportunitySet: "Cash Equivalents",
          uw: false,
          n: false,
          ow: true,
          change: "No Change",
          conviction: "Low",
          description:
            "Carry attractive in base case of no recession; some spread tighening potential in high yield",
        },
        {
          opportunitySet: "Credit Equities",
          uw: false,
          n: false,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Cash returns sent to fall as cutting cycle begins; long-term USD rates likely nearer 2.5% than 5.5%",
        },
      ],
    },

    {
      id: 2,
      assetClass: "Fixed Income",
      items: [
        {
          opportunitySet: "USD",
          uw: false,
          n: true,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Earnings downgrade cycle has turned, and multiples supported by easier monetary conditions",
        },
        {
          opportunitySet: "EUR",
          uw: true,
          n: false,
          ow: false,
          change: "Decreased",
          conviction: "Medium",
          description:
            "Peak in yeilds behind us as we move to cutting cycle; yields may decline slowly, but >4% coupon is attractive",
        },
        {
          opportunitySet: "JPY",
          uw: false,
          n: false,
          ow: true,
          change: "No Change",
          conviction: "Low",
          description:
            "Carry attractive in base case of no recession; some spread tighening potential in high yield",
        },
        {
          opportunitySet: "INR",
          uw: false,
          n: false,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Cash returns sent to fall as cutting cycle begins; long-term USD rates likely nearer 2.5% than 5.5%",
        },
      ],
    },

    {
      id: 3,
      assetClass: "Currency",
      items: [
        {
          opportunitySet: "USD",
          uw: false,
          n: true,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Earnings downgrade cycle has turned, and multiples supported by easier monetary conditions",
        },
        {
          opportunitySet: "EUR",
          uw: true,
          n: false,
          ow: false,
          change: "Decreased",
          conviction: "Medium",
          description:
            "Peak in yeilds behind us as we move to cutting cycle; yields may decline slowly, but >4% coupon is attractive",
        },
        {
          opportunitySet: "JPY",
          uw: false,
          n: false,
          ow: true,
          change: "No Change",
          conviction: "Low",
          description:
            "Carry attractive in base case of no recession; some spread tighening potential in high yield",
        },
        {
          opportunitySet: "INR",
          uw: false,
          n: false,
          ow: false,
          change: "Increased",
          conviction: "High",
          description:
            "Cash returns sent to fall as cutting cycle begins; long-term USD rates likely nearer 2.5% than 5.5%",
        },
      ],
    },
  ];
  return (
    <div>
      <div className="left-block">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Asset Class</th>
              <th>Opportunity Set</th>
              <th>UW</th>
              <th>N</th>
              <th>OW</th>
              <th>Change</th>
              <th>Conviction</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((group, index) =>
              group.items.map((item, itemIndex) => (
                <tr key={`${group.id}_${itemIndex}`}>
                  {itemIndex === 0 && (
                    <td rowSpan={group.items.length} className="rotate-header">
                      {group.assetClass}
                    </td>
                  )}
                  <td>{item.opportunitySet}</td>
                  <td>
                    <input
                      type="radio"
                      name={`first_table_uw_${group.id}_${itemIndex}`}
                      checked={item.uw}
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name={`first_table_n_${group.id}_${itemIndex}`}
                      checked={item.n}
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name={`first_table_ow_${group.id}_${itemIndex}`}
                      checked={item.ow}
                      onChange={() => {}}
                    />
                  </td>
                  <td>{item.change}</td>
                  <td>{item.conviction}</td>
                  <td>{item.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="asset-class-header">Performance by asset class</div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Asset Class</th>
              <th>Opportunity Set</th>
              <th>UW</th>
              <th>N</th>
              <th>OW</th>
              <th>Change</th>
              <th>Conviction</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data2.map((group, index) =>
              group.items.map((item, itemIndex) => (
                <tr key={`${group.id}_${itemIndex}`}>
                  {itemIndex === 0 && (
                    <td
                      rowSpan={group.items.length}
                      className="asset-class-sidelabel"
                    >
                      {group.assetClass}
                    </td>
                  )}
                  <td>{item.opportunitySet}</td>
                  <td>
                    <input
                      type="radio"
                      name={`second_table_uw_${group.id}_${itemIndex}`}
                      checked={item.uw}
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name={`second_table_n_${group.id}_${itemIndex}`}
                      checked={item.n}
                      onChange={() => {}}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name={`second_table_ow_${group.id}_${itemIndex}`}
                      checked={item.ow}
                      onChange={() => {}}
                    />
                  </td>
                  <td>{item.change}</td>
                  <td>{item.conviction}</td>
                  <td>{item.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StrategicAssetAllocation;
