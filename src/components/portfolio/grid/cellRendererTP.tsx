/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { formatValue } from "../portfolioLib.tsx";
import { useSignals } from "@preact/signals-react/runtime";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import { setSecurityDetails, setSecurityModal } from "../../../store/nonPerstistant/index.ts";
import { Security } from "../../modals/SecurityPreview/securtityViewTP.tsx";
import { getCurrentSelection } from "../../../store/nonPerstistant/selectors.ts";
import { useAppSelector } from "../../../store/index.ts";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
import { getPersistedCurrentSelection } from "../../../store/portfolio/selector.ts";
import { InfoIconDarkMode, InfoIconLightMode } from "../../svgComponent/svgComponent.tsx";
interface RendererProps {
    pointsView: any; // Adjust the type according to your actual data type
    data:
        | {
              preOptimizationWeight?: number;
              price?: number | string;
              additionalAttributeMap?: Object;
              postOptimizationWeight?: number;
              tradingWeight?: number;
          }
        | null
        | undefined;
}

export const preOptRenderer: React.FC<RendererProps> = (params, key) => {
    return (
        params.data && <span style={{}}>{formatValue(params.pointsView, params.data[key])}</span>
    );
};

export const priceRenderer: React.FC<RendererProps> = (params) => {
    const price =
        params.data && typeof params.data.price === "number"
            ? parseFloat(JSON.stringify(params.data.price)).toFixed(2)
            : "";
    return <span>{price}</span>;
};

export const postOptRenderer: React.FC<RendererProps> = (params, key) => {
    return params.data && <span>{formatValue(params.pointsView, params.data[key])}</span>;
};

export const ordinaryCellRenderer: React.FC<RendererProps> = (params) => {
    return <span>{params?.data?.additionalAttributeMap?.[params?.colVal]}</span>;
};

export let tradingWeightRenderer: React.FC<RendererProps> = (params, key) => {
    return params.data && <span>{formatValue(params.pointsView, params.data[key])}</span>;
};

export const TooltipRenderer = ({ value, node }: any) => {
    useSignals();
    const dispatch = useDispatch();
    const theme = useTheme();

    const persistedCurrentSelection = useAppSelector(getPersistedCurrentSelection);

    const [expanded, setExpanded] = useState(true);

    function dispatchSecurityModal(data: boolean) {
        dispatch(setSecurityModal(data));
    }

    const onExpandCollapse = () => {
        const expandedState = !expanded;
        setExpanded(expandedState);
        node.setExpanded(expandedState); // Update local state

        // Update ag-Grid state
        const gridApi = node.gridApi;
        if (gridApi) {
            gridApi.forEachNode((rowNode: any) => {
                if (rowNode.key === node.key) {
                    rowNode.setExpanded(expandedState);
                }
            });
        }
    };

    const padding = node.level ? (node.level + 1) * 20 : 20;
    const textPadding = node.level ? (node.level + 1) * 12.5 : 20;

    function dispatchSecurityDetails(data: Security | null) {
        dispatch(setSecurityDetails(data));
    }

    const handleSecurity = (securityName) => {
        dispatchSecurityModal(true);
        dispatchSecurityDetails(securityName);
    };

    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(" ")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }
    return (
        <div onClick={onExpandCollapse}>
            {node.childrenAfterGroup.length > 0 && (
                <span
                    style={{ paddingLeft: padding }}
                    className={expanded ? "arrow up" : "arrow down"}
                ></span>
            )}
            {!node.__hasChildren ||
            ((persistedCurrentSelection.id == 2 || persistedCurrentSelection.id == 3) &&
                node.level == 1) ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: textPadding,
                    }}
                >
                    {value && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            {theme.theme == "light" ? (
                                <InfoIconLightMode
                                    style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                                    onClick={() => {
                                        handleSecurity(value);
                                    }}
                                />
                            ) : (
                                <InfoIconDarkMode
                                    style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                                    onClick={() => {
                                        handleSecurity(value);
                                    }}
                                />
                            )}

                            <Tooltip title={value} placement="right-start">
                                <a
                                    href="#"
                                    style={{
                                        display: "block",
                                        width: "125px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        color: theme.theme == "light" ? "#383C93" : "#f4f4f4",
                                    }}
                                >
                                    {toTitleCase(value)}
                                </a>
                            </Tooltip>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {value && (
                        <span
                            style={{
                                paddingLeft: textPadding,
                                width: "175px",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {value}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
