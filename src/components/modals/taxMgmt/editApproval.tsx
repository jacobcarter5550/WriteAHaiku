import React, { useEffect, useState, useRef } from "react";
import ModalType, { ModalTypeEnum } from "../../../ui-elements/modals/ModalType.tsx";
import { Stack } from "@mui/material";
import api from "../../../helpers/serviceTP.ts";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import { Theme } from "@carbon/react";
import Button from "../../../ui-elements/buttonTP.tsx";

interface EditAdvisoryProps {
    open: boolean;
    content: string;
    setContent: (value: any) => void;
    handleClose: () => void;
    accountId: any;
    messageId: string;
}

const EditAdvisory: React.FC<EditAdvisoryProps> = ({
    open,
    handleClose,
    content: initialContent,
    setContent,
    accountId,
    messageId,
}) => {
    const nextTheme = useTheme();
    const [editorContent, setEditorContent] = useState(initialContent);
    // State to hold the configuration for the editor
    const [editorConfig, setEditorConfig] = useState({});

    const styles: { [key: string]: React.CSSProperties } = {
        modal: {
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            justifyContent: "center",
            backgroundColor: "#F4F4F4",
        },
        content: {
            backgroundColor: nextTheme.theme == "light" ? "#ffffff" : "#262626",
            border: "0",
            width: "100%",
            borderRadius: "10px",
        },
        heading: {
            fontSize: "20px",
            lineHeight: "28px",
            paddingBottom: "20px",
        },
    };

    const buttons = (
        <Stack spacing={2} direction="row" justifyContent="end" sx={{ width: "95%" }}>
            <Button
             label="Cancel"
             className={
                nextTheme.theme == "light"
                  ? "pop-btnNeg buttonMarginHelper"
                  : "pop-btnNeg-dark-mode buttonMarginHelper"
              }
            />
            <Button
                label="Done"
                onClick={() => handleUpdate()}
                className={"pop-btn buttonMarginHelper"}
            />
        </Stack>
    );

    const editorRef = useRef<Editor>(null);

    useEffect(() => {
        setEditorContent(initialContent);
    }, [initialContent]); // Update editorContent when initialContent prop changes

    useEffect(() => {
        const styleElement = document.createElement("style");
        styleElement.textContent = `
          .tox-notifications-container {
            display: none;
          }
        `;
        document.head.appendChild(styleElement);

        // Clean up the style element on component unmount
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const handleUpdate = () => {
        if (editorRef.current) {
            let obj = {
                messageId: messageId,
                advisorOriginalMessageId: 0,
                advisorId: 11,
                pmId: 13,
                clientId: 1,
                accountId: accountId,
                senderType: null,
                messageDate: "2024-04-15",
                subject: "TAX Advice - 1",
                // @ts-ignore
                message: editorRef.current.getContent(),
                userId: "11",
                taxAdviceViews: [
                    {
                        adviceId: 1,
                        messageId: 1,
                        securityIdForHarvest: "DUMMY1",
                        harvestType: "gain",
                        adviceText: "",
                        taxAdviceStatus: "NEW",
                    },
                    {
                        adviceId: 2,
                        messageId: 1,
                        securityIdForHarvest: "DUMMY2",
                        harvestType: "loss",
                        adviceText: "",
                        taxAdviceStatus: "NEW",
                    },
                ],
            };
            api.put(`${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advice/update`, obj).then((res) => {
                handleClose();
            });
        }
    };

    useEffect(() => {
        const newConfig = {
            noneditable_class: "uneditable",
            height: "calc(100vh - 22rem)",
            contextmenu: "link image table",
            toolbar_mode: "sliding",
            body_class: "advisory-body",
            quickbars_selection_toolbar:
                "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
            menubar: true,
            toolbar:
                "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
            skin: nextTheme.theme === "light" ? "oxide" : "oxide-dark",
            content_style:
                nextTheme.theme === "light"
                    ? `body { font-family:Helvetica,Arial,sans-serif; font-size:14px;   }   
                    ::-webkit-scrollbar { width: 10px; height: 10px; border-radius: 10px; }
                    ::-webkit-scrollbar-track { background: #f1f1f1; }
                    ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px !important; }
                    ::-webkit-scrollbar-thumb:hover { background: #555; }`
                    : `body { background-color: #161616; color: #f4f4f4;font-family:Helvetica,Arial,sans-serif; font-size:14px;    }
              h1 { color: #fff !important; } /* Brighter headers for dark mode */
              h2 { color: #fff !important; } /* Brighter headers for dark mode */
              p { color: #f4f4f4; } /* White text for dark mode */
              table tbody tr th { background-color: #262626 !important; }
              ::-webkit-scrollbar { width: 10px; height: 10px; border-radius: 10px; }
              ::-webkit-scrollbar-track { background: #383a3e; }
              ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px !important; }
              ::-webkit-scrollbar-thumb:hover { background: #9c9d9f; }
              
            `,
        };
        setEditorConfig(newConfig);
    }, [nextTheme.theme]);

    return (
        <div>
            <ModalType
                type={ModalTypeEnum.MEDIUM}
                buttons={buttons}
                open={open}
                style={styles.modal}
                closeDialog={handleClose}
            >
                <h2 style={styles.heading}>Edit Tax-Smart Copilot - Narrative </h2>
                <div style={styles.content} className="modal-content pilot-text-wrapper">
                    <Editor
                        key={nextTheme.theme}
                        apiKey="7qyra59fdv6lglq9p5r45rrzwlzdi5094ym37qws1l5oujj6"
                        initialValue={editorContent}
                        init={editorConfig}
                        //@ts-ignore
                        onInit={(_evt, editor) => (editorRef.current = editor)}
                    />
                </div>
            </ModalType>
        </div>
    );
};

export default EditAdvisory;
