import React, { useEffect, useState } from "react";
import ImageComponent from "../../ui-elements/ImageComponent.tsx";
import { ProgressBar } from "@carbon/react";
import api from "../../helpers/serviceTP.ts";
import { toast } from "react-toastify";
import { TreeView, TreeNode } from "carbon-components-react";
import { getTaxPortfolios } from "../../store/taxAdvisor/selector.ts";
import { AccountBranch, AccountNode } from "./types.ts";
import { useTheme } from "next-themes";
import { useAppSelector } from "../../store/index.ts";
import "../../styles/taxMgmt.scss";

const TaxProjection: React.FC = () => {
  const data: string = ``;
  const [isPortfolioOpen, setIsPortfolioOpen] = useState<boolean>(false);
  const [approve, setApprove] = useState<boolean>(false);
  const [approveInitiated, setApproveInitiated] = useState<boolean>(false);
  const [messageId, setMessageId] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [mailChain, setMailChain] = useState<boolean>(false);
  const [content, setContent] = useState<string>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileInfo, setFileInfo] = useState({ name: "", size: null });

  const portfolioList: AccountBranch[] = useAppSelector(getTaxPortfolios);

  const theme = useTheme();

  function renderTree({
    nodes,
    expanded,
    withIcons = false,
  }: {
    nodes: TreeNode[];
    expanded?: boolean;
    withIcons?: boolean;
  }) {
    if (!nodes) {
      return null;
    }

    return nodes.map(({ children, renderIcon, isExpanded, ...nodeProps }) => (
      <TreeNode
        className="treennode"
        key={nodeProps.id}
        renderIcon={withIcons ? renderIcon : undefined}
        isExpanded={expanded ?? isExpanded}
        {...nodeProps}
      >
        {renderTree({
          nodes: children,
          expanded: true,
          withIcons,
        })}
      </TreeNode>
    ));
  }

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileInfo({
        name: file.name,
        size: file.size / 1024,
      });
    } else {
      setFileInfo({ name: "", size: null });
    }
  };

  const isAccountBranch = (node: AccountNode): node is AccountBranch => {
    return "children" in node;
  };
  const handleEmail = (id: number) => {
    setAccountId(id);
    setMailChain(true);
  };

  const handleData = (id) => {
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
  const handleClose = () => {
    setOpen(false);
    setApprove(false);
  };

  const handleEdit = () => {
    setOpen(true);
  };
  const handleRefresh = (id) => {
    api.post(
      `${process.env.REACT_APP_TAX_ADVISOR}/api/smart-tax-report/generate/${accountId}`
  )
      .then((res) => {
          console.log(res);
      })
      .catch((error) => {
          console.log(error);
      });
  };
  const handleToPm = () => {
    api
      .put(
        `${process.env.REACT_APP_TAX_ADVISOR}/tax/advice/api/sendMessageToPm?userId=11&messageId=${messageId}`
      )
      .then((res) => {
        toast.success("Forwarded to PM Successfully");
      })
      .catch((err) => {
        toast.error("Please approve the message first, before sending");
      });
  };
  const handleApprove = () => {
    setApprove(false);
    setApproveInitiated(true);
    api
      .put(
        `${process.env.REACT_APP_TAX_ADVISOR}/tax/advice/api/approve?userId=11&messageId=${messageId}`
      )
      .then((res) => {
        toast.success("Approved Successfully");
        setApprove(true);
        setApproveInitiated(false);
      })
      .catch((error) => {
        console.error("Error while approving:", error);
      });
  };
  function convertObjectArray(inputArray: AccountBranch[]): TreeNode[] {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return [];
    }

    function convertChildren(children: AccountNode[] | undefined): TreeNode[] {
      if (!children || children.length === 0) {
        return [];
      }
      return children.map((child: AccountNode) => {
        const isLeaf = !isAccountBranch(child);
        return {
          id: child.accountId.toString(),
          value: child.name,
          label: (
            <span
              data-active={child.accountId == accountId}
              className="before-img label-text"
            >
              {isLeaf ? (
                <a href="#" onClick={() => handleData(child.accountId)}>
                  {child.accountName}
                  <pre className="pre-style green">{child?.actions || 0}</pre>
                </a>
              ) : (
                <span>
                  {child.name}{" "}
                  <pre className="pre-style green">{child?.actions || 0}</pre>
                </span>
              )}
              {isLeaf && (
                <div className="img-block">
                  <ImageComponent
                    src="renew.svg"
                    alt="renew-icon"
                    style={{ width: "1.5rem" }}
                    onClick={() => handleRefresh(child.accountId)}
                  />
                  <ImageComponent
                    src="document--preliminary.svg"
                    alt="document--preliminary-icon"
                    style={{ width: "1.5rem" }}
                    onClick={() => handleEmail(child.accountId)}
                    className="tax-icon-img"
                  />
                </div>
              )}
            </span>
          ),
          isExpanded: true,
          children: isAccountBranch(child)
            ? convertChildren(child.children)
            : null,
        };
      });
    }

    return inputArray.map((city) => ({
      id: city.accountId.toString(),
      value: city.name,
      label: (
        <span className="label-text">
          {city.name}{" "}
          <pre className="pre-style green">
            {city.children?.reduce(
              (acc, child) => acc + (child.actions || 0),
              0
            ) || 0}
          </pre>
        </span>
      ),
      isExpanded: true,
      children: convertChildren(city.children),
    }));
  }

  useEffect(() => {
    const outputObject = convertObjectArray(portfolioList);
    setNodes(outputObject);
  }, [portfolioList, theme.theme]);
  return (
    <div className="tax-accountant-grid">
      <div className="copilot-header">
        {isPortfolioOpen && (
          <ImageComponent
            src="sideCollapse.svg"
            alt="sideCollapse-icon"
            style={{
              height: "1.5rem",
              cursor: "pointer",
              position: "relative",
              left: ".8rem",
              zIndex:"4"
            }}
            onClick={(e) => {
              setIsPortfolioOpen(false);
            }}
            title="Side collapse"
          />
        )}
        <div
          className="copilot-header-text"
          style={{ display: isPortfolioOpen ? "none" : "" }}
        >
          <h2>Client Portfolios </h2>

          {!isPortfolioOpen && (
            <ImageComponent
              src="sideCollapse.svg"
              alt="sideCollapse-icon"
              style={{
                height: "1.5rem",
                cursor: "pointer",
                transform: "rotate(180deg)",
                position: "relative",
                left: ".8rem",
                zIndex:"4"
              }}
              onClick={(e) => {
                setIsPortfolioOpen(true);
              }}
              title="Side collapse"
            />
          )}
        </div>
        <div
          className="copilot-header-container"
          style={{ width: isPortfolioOpen ? "100%" : "81%" }}
        >
          <div className="copilot-header-main-text">
            <h2>Capital Gain/Loss Projection</h2>
          </div>
          <div className="icon-header-container ">
            {!approve && approveInitiated && (
              <span>
                <ProgressBar
                  size="small"
                  className="progressBarHelper"
                  label="waiting"
                  hideLabel
                />
              </span>
            )}
            {approve && (
              <span>
                <img src="/checkmark.png" alt="Checkmark" />
              </span>
            )}

            <ImageComponent
              src="approve-icon.svg"
              alt="approve-icon"
              style={{ width: "1.5rem" }}
              onClick={handleApprove}
            />
            <ImageComponent
              src="edit-icon.svg"
              alt="Edit-icon"
              style={{ width: "1.5rem" }}
              onClick={handleEdit}
            />
            <ImageComponent
              src="forward-icon.svg"
              alt="Forward-icon"
              style={{ width: "1.5rem" }}
              onClick={handleToPm}
            />
            <ImageComponent
              src="microphone-icon.svg"
              alt="microphone-icon"
              style={{ width: "1.5rem" }}
            />
          </div>
        </div>
      </div>
      <div className="tax-projection-wrapper">
        <div
          className="portfolios"
          style={{ display: isPortfolioOpen ? "none" : "block" }}
        >
          <TreeView>{renderTree({ nodes })}</TreeView>
        </div>
        <div
          className="tax-projection-container"
          style={{ width: isPortfolioOpen ? "100%" : "85%" }}
        >
          <div className="container-sub-tp">
            <div className="heading-tp">
              Client Information: Name, address, contact details (String)
            </div>
            <div className="inner-container-tp">
              <div className="upload-container">
                <input
                  type="file"
                  id="file-upload"
                  className="file-upload-input"
                  onChange={handleFileChange}
                />
                <ImageComponent src="file-upload.svg" alt="upload-icon" />
                <div>
                  <label htmlFor="file-upload" className="file-upload-label">
                    <span className="upload-text">
                      <span> Click to Upload </span> or drag and drop
                    </span>

                    <span className="file-upload-size">
                      (Max. File size: 25 MB)
                    </span>
                  </label>
                </div>
              </div>

              <div className="filename-container">
                <div className="fileinfo">
                  <div>
                    <ImageComponent src="document.svg" />
                    <div className="file-info">
                      <span>{fileInfo?.name}</span>

                      <span>
                        {fileInfo?.size}
                        {fileInfo?.size && "kb"}
                      </span>
                    </div>
                  </div>
                  <div className="check-circle">
                    <ImageComponent src="check-circle.svg" />
                  </div>
                </div>
                <div className="progress-bar">
                  <ProgressBar
                    value={100}
                    size="small"
                    className="progressBarHelper"
                    label="waiting"
                    hideLabel
                  />
                </div>
              </div>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>1234, ELM Street, NY</td>
                    <td>john@example.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="container-sub-tp">
            <div className="heading-tp">
              Asset Inventory: <br />
              <div className="sub-heading-tp">
                (Detailed list of all assets (cars, boats, planes, long-term
                properties, short-term properties) with purchase dates, purchase
                prices, current market values (Date, Float)
              </div>
            </div>

            <div className="inner-container-tp">
              <div className="upload-container">
                <input
                  type="file"
                  id="file-upload"
                  className="file-upload-input"
                  onChange={handleFileChange}
                />
                <ImageComponent src="file-upload.svg" alt="upload-icon" />
                <div>
                  <label htmlFor="file-upload" className="file-upload-label">
                    <span className="upload-text">
                      <span> Click to Upload </span> or drag and drop
                    </span>

                    <span className="file-upload-size">
                      (Max. File size: 25 MB)
                    </span>
                  </label>
                </div>
              </div>

              <div className="filename-container">
                <div className="fileinfo">
                  <div>
                    <ImageComponent src="document.svg" />
                    <div className="file-info">
                      <span>{fileInfo?.name}</span>

                      <span>
                        {fileInfo?.size}
                        {fileInfo?.size && "kb"}
                      </span>
                    </div>
                  </div>
                  <div className="check-circle">
                    <ImageComponent src="trash-can-tp.svg" alt="trash-can" />
                  </div>
                </div>
                <div className="progress-bar">
                  <ProgressBar
                    value={90}
                    size="small"
                    className="progressBarHelper"
                    label="waiting"
                    hideLabel
                  />
                </div>
              </div>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Purchase Date</th>
                    <th>Purchase Price</th>
                    <th>Current Market Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Car</td>
                    <td>01/01/2018 </td>
                    <td>$30,000</td>
                    <td>$25,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="container-sub-tp">
            <div className="heading-tp">
              Income Information: Annual income, sources of income (Float,
              String).
            </div>

            <div className="inner-container-tp">
              <div className="upload-container">
                <input
                  type="file"
                  id="file-upload"
                  className="file-upload-input"
                  onChange={handleFileChange}
                />
                <ImageComponent src="file-upload.svg" alt="upload-icon" />
                <div>
                  <label htmlFor="file-upload" className="file-upload-label">
                    <span className="upload-text">
                      <span> Click to Upload </span> or drag and drop
                    </span>

                    <span className="file-upload-size">
                      (Max. File size: 25 MB)
                    </span>
                  </label>
                </div>
              </div>

              <div className="filename-container">
                <div className="fileinfo">
                  <div>
                    <ImageComponent src="document.svg" />
                    <div className="file-info">
                      <span>{fileInfo?.name}</span>

                      <span>
                        {fileInfo?.size}
                        {fileInfo?.size && "kb"}
                      </span>
                    </div>
                  </div>
                  <div className="check-circle">
                    <ImageComponent src="trash-can-tp.svg" alt="trash-can" />
                  </div>
                </div>
                <div className="progress-bar">
                  <ProgressBar
                    value={90}
                    size="small"
                    className="progressBarHelper"
                    label="waiting"
                    hideLabel
                  />
                </div>
              </div>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Annual Income</th>
                    <th>Sources</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>$25000000</td>
                    <td>Salary</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="container-sub-tp">
            <div className="heading-tp">
              Previous Tax Returns: Last 3 years of tax returns (PDF/Excel).
            </div>

            <div className="inner-container-tp">
              <div className="upload-container">
                <input
                  type="file"
                  id="file-upload"
                  className="file-upload-input"
                  onChange={handleFileChange}
                />
                <ImageComponent src="file-upload.svg" alt="upload-icon" />
                <div>
                  <label htmlFor="file-upload" className="file-upload-label">
                    <span className="upload-text">
                      <span> Click to Upload </span> or drag and drop
                    </span>

                    <span className="file-upload-size">
                      (Max. File size: 25 MB)
                    </span>
                  </label>
                </div>
              </div>

              <div className="filename-container">
                <div className="fileinfo">
                  <div>
                    <ImageComponent src="document.svg" />
                    <div className="file-info">
                      <span>{fileInfo?.name}</span>

                      <span>
                        {fileInfo?.size}
                        {fileInfo?.size && "kb"}
                      </span>
                    </div>
                  </div>
                  <div className="check-circle">
                    <ImageComponent src="file-download.svg" alt="trash-can" />
                    <ImageComponent src="trash-can-tp.svg" alt="trash-can" />
                  </div>
                </div>
                <div className="progress-bar">
                  <ProgressBar
                    value={90}
                    size="small"
                    className="progressBarHelper"
                    label="waiting"
                    hideLabel
                  />
                </div>
              </div>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>2021</th>
                    <th>2022</th>
                    <th>2023</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>tax returns.pdf</td>
                    <td>tax returns.pdf</td>
                    <td>tax returns.pdf</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <EditAdvisory
        open={open}
        messageId={messageId}
        accountId={accountId}
        content={content}
        setContent={setContent}
        handleClose={handleClose}
      />
      <MailChain
        open={mailChain}
        accountId={accountId}
        handleClose={handleMailClose}
      /> */}
    </div>
  );
};

export default TaxProjection;
