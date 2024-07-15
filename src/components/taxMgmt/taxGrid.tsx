import React, { useEffect, useState, useRef } from "react";
import EditAdvisory from "../modals/taxMgmt/editApproval.tsx";
import { TreeView, TreeNode } from "carbon-components-react";
import Visualisation from "./gannt.tsx";
import { ProgressBar } from "@carbon/react";
import api from "../../helpers/serviceTP.ts";
import { getPortfolioList } from "../../store/taxAdvisor/index.ts";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/index.ts";
import { getTaxPortfolios } from "../../store/taxAdvisor/selector.ts";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import MailChain from "../modals/taxMgmt/messageChain.tsx";
import { Editor } from "@tinymce/tinymce-react";
import { EditorOptions, RawEditorOptions } from "tinymce";
import ImageComponent from "../../ui-elements/ImageComponent.tsx";
import { AccountBranch, AccountNode } from "./types.ts";

const isAccountBranch = (node: AccountNode): node is AccountBranch => {
    return "children" in node;
};
const lightModeConfig: RawEditorOptions &
    Partial<Record<"target" | "selector" | "readonly" | "license_key", any>> = {
    noneditable_class: "uneditable",
    readonly: false,
    height: "calc(100vh - 45rem)",
    body_class: "advisory-body",
    contextmenu: ["link image table"],
    toolbar_mode: "sliding",
    quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    menubar: false,
    plugins: [],
    toolbar: "",
    skin: "oxide",
    content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
::-webkit-scrollbar { width: 10px; height: 10px; border-radius: 10px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 10px !important; }
::-webkit-scrollbar-thumb:hover { background: #555; }`,
};

const lightModeConfigFull: RawEditorOptions &
    Partial<Record<"target" | "selector" | "readonly" | "license_key", any>> = {
    noneditable_class: "uneditable",
    readonly: false,
    height: "calc(100vh - 27rem)",
    body_class: "advisory-body",
    contextmenu: ["link image table"],
    toolbar_mode: "sliding",
    quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    menubar: false,
    plugins: [],
    toolbar: "",
    skin: "oxide",
    content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
::-webkit-scrollbar { width: 10px; height: 10px; border-radius: 10px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 10px !important; }
::-webkit-scrollbar-thumb:hover { background: #555; }`,
};

const darkModeConfig: RawEditorOptions &
    Partial<Record<"target" | "selector" | "readonly" | "license_key", any>> = {
    noneditable_class: "uneditable",
    readonly: false,
    height: "calc(100vh - 45rem)",
    body_class: "advisory-body",
    contextmenu: ["link image table"],
    toolbar_mode: "sliding",
    quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    menubar: false,
    plugins: ["table"],
    toolbar: "",
    skin: "oxide-dark",
    content_style: `body { background-color: #161616; color: #f4f4f4;font-family:Helvetica,Arial,sans-serif; font-size:14px; }
h1 { color: #f4f4f4 !important; } /* Brighter headers for dark mode */
h2 { color: #f4f4f4 !important; } /* Brighter headers for dark mode */
p { color: #f4f4f4; } /* White text for dark mode */
table tbody tr th { background-color: #262626 !important; }
::-webkit-scrollbar { width: 10px; height: 10px; border-radius: 10px; }
::-webkit-scrollbar-track { background: #383a3e; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 10px !important; }
::-webkit-scrollbar-thumb:hover { background: #9c9d9f; }

`,
};

const darkModeConfigFull: RawEditorOptions &
    Partial<Record<"target" | "selector" | "readonly" | "license_key", any>> = {
    noneditable_class: "uneditable",
    readonly: false,
    height: "calc(100vh - 27rem)",
    body_class: "advisory-body",
    contextmenu: ["link image table"],
    toolbar_mode: "sliding",
    quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
    menubar: false,
    plugins: ["table"],
    toolbar: "",
    skin: "oxide-dark",
    content_style: `body { background-color: #161616; color: #f4f4f4;font-family:Helvetica,Arial,sans-serif; font-size:14px; }
h1 { color: #f4f4f4 !important; } /* Brighter headers for dark mode */
h2 { color: #f4f4f4 !important; } /* Brighter headers for dark mode */
p { color: #f4f4f4; } /* White text for dark mode */
table tbody tr th { background-color: #262626 !important; }
::-webkit-scrollbar { width: 10px; height: 10px; border-radius: 10px; }
::-webkit-scrollbar-track { background: #383a3e; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 10px !important; }
::-webkit-scrollbar-thumb:hover { background: #9c9d9f; }

`,
};

interface AccountantGridProps {
    handleData: (id: number) => void;
    approve: boolean;
    setApprove: React.Dispatch<React.SetStateAction<boolean>>;
    accountId: number | null;
    setAccountId: React.Dispatch<React.SetStateAction<number | null>>;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    messageId: string;
}

const AccountantGrid: React.FC<AccountantGridProps> = ({
    handleData,
    approve,
    setApprove,
    accountId,
    setAccountId,
    content,
    setContent,
    messageId,
}) => {
    const theme = useTheme();
    const data: string = ``;
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
    const editorRef = useRef<Editor>(null);
    const [isWashSaleOpen, setIsWashSaleOpen] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [mailChain, setMailChain] = useState<boolean>(false);
    const [nodes, setNodes] = useState<TreeNode[]>([]);
    const dispatch = useDispatch();
    const portfolioList: AccountBranch[] = useAppSelector(getTaxPortfolios);
    const [approveInitiated, setApproveInitiated] = useState<boolean>(false);
    const [editorHeight, setEditorHeight] = useState(300); // Initial height
    const divRef = useRef(null);

    const handleRefresh = (id) => {
        console.log("Handle Refresh", id);

        api.post(`${process.env.REACT_APP_TAX_ADVISOR}/api/smart-tax-report/generate/${id}`)
            .then((res) => {
                console.log("SmartTax", res);
                toast.info("Successfully fetched SmartTax");
            })
            .catch((error) => {
                console.log("Error SmartTax", error, error?.response?.data?.message);
                toast.error(error?.response?.data?.message);
            });
    };

    const handleEmail = (id: number) => {
        setAccountId(id);
        setMailChain(true);
    };

    const handleMailClose = () => {
        setMailChain(false);
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
                                <a
                                    href="#"
                                    onClick={() => handleData(child.accountId)}
                                    id={child.accountId.toString()}
                                >
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRefresh(child.accountId);
                                        }}
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
                    children: isAccountBranch(child) ? convertChildren(child.children) : null,
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
                        {city.children?.reduce((acc, child) => acc + (child.actions || 0), 0) || 0}
                    </pre>
                </span>
            ),
            isExpanded: true,
            children: convertChildren(city.children),
        }));
    }

    const handleClose = () => {
        setOpen(false);
        setApprove(false);
    };

    const handleEdit = () => {
        setOpen(true);
    };

    const handleApprove = () => {
        setApprove(false);
        setApproveInitiated(true);
        api.put(
            `${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advice/approve?userId=11&messageId=${messageId}`
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

    const handleToPm = () => {
        api.put(
            `${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advice/sendMessageToPm?userId=11&messageId=${messageId}`
        )
            .then((res) => {
                toast.success("Forwarded to PM Successfully");
            })
            .catch((err) => {
                toast.error("Please approve the message first, before sending");
            });
    };

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

    useEffect(() => {
        api.get(
            `${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advisor/getClientPortfolios?groupingType=A`
        )
            .then((res) => {
                dispatch(getPortfolioList(res.data));
            })
            .catch((error) => {
                console.log(error);
            });
        handleData(accountId ? accountId : 101);
    }, [open]);

    useEffect(() => {
        const outputObject = convertObjectArray(portfolioList);
        setNodes(outputObject);
    }, [portfolioList, theme.theme]);

    useEffect(() => {
        const editorContent = document.querySelector(".tox-tinymce");
        if (editorContent) {
            const contentHeight = editorContent.scrollHeight;
            setEditorHeight(contentHeight);
        }
    }, [isWashSaleOpen]);

    useEffect(() => {
        if (editorRef) {
            console.log(editorRef, "current");
            // const body = editorRef.current.getBody();
            // body.style.overflow = 'hidden';
        }
    }, [editorRef]);

    console.log("isWashSaleOpen", isWashSaleOpen);

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
                            zIndex: "4",
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
                                zIndex: "4",
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
                        <h2>Tax-Smart Copilot - Narrative</h2>
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
                            <ImageComponent
                                src="checkmark.svg"
                                alt="Checkmark"
                                style={{ width: "1.5rem" }}
                            />
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
            <div className="co-pilot-wrapper">
                <div className="portfolios" style={{ display: isPortfolioOpen ? "none" : "block" }}>
                    <TreeView>{renderTree({ nodes })}</TreeView>
                </div>
                <div
                    className="pilot-text-wrapper"
                    style={{ width: isPortfolioOpen ? "100%" : "85%" }}
                >
                    {isWashSaleOpen ? (
                        <div className="content-wrapper-full">
                            {theme.theme === "light" ? (
                                <Editor
                                    key={`&{theme.theme}${isWashSaleOpen}`}
                                    apiKey="7qyra59fdv6lglq9p5r45rrzwlzdi5094ym37qws1l5oujj6"
                                    //@ts-ignore
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    disabled={true}
                                    initialValue={content}
                                    init={lightModeConfigFull}
                                />
                            ) : (
                                <Editor
                                    key={`&{theme.theme}${isWashSaleOpen}`}
                                    apiKey="7qyra59fdv6lglq9p5r45rrzwlzdi5094ym37qws1l5oujj6"
                                    //@ts-ignore
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    disabled={true}
                                    initialValue={content}
                                    init={darkModeConfigFull}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="content-wrapper" ref={divRef}>
                            {theme.theme === "light" ? (
                                <Editor
                                    key={`&{theme.theme}${isWashSaleOpen}`}
                                    apiKey="7qyra59fdv6lglq9p5r45rrzwlzdi5094ym37qws1l5oujj6"
                                    //@ts-ignore
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    disabled={true}
                                    initialValue={content}
                                    init={lightModeConfig}
                                />
                            ) : (
                                <Editor
                                    key={`&{theme.theme}${isWashSaleOpen}`}
                                    apiKey="7qyra59fdv6lglq9p5r45rrzwlzdi5094ym37qws1l5oujj6"
                                    //@ts-ignore
                                    onInit={(_evt, editor) => (editorRef.current = editor)}
                                    disabled={true}
                                    initialValue={content}
                                    init={darkModeConfig}
                                />
                            )}
                        </div>
                    )}
                    <Visualisation
                        accountId={accountId}
                        isWashSaleOpen={isWashSaleOpen}
                        setIsWashSaleOpen={setIsWashSaleOpen}
                    />
                </div>
            </div>
            <EditAdvisory
                open={open}
                messageId={messageId}
                accountId={accountId}
                content={content}
                setContent={setContent}
                handleClose={handleClose}
            />
            <MailChain open={mailChain} accountId={accountId} handleClose={handleMailClose} />
        </div>
    );
};

export default AccountantGrid;
