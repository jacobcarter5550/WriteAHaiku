import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ImageComponent from "../../../../../ui-elements/ImageComponent.tsx";

const AccordionComp = ({
    item,
    renderNestedLevels,
    expandedItems,
    setExpandedItems,
    level,
    keys,
}) => {
    console.log("AccordionComp", item);
    const nextTheme = useTheme();
    const toggle = () => {
        if (expandedItems.includes(item.id)) {
            setExpandedItems(expandedItems.filter((id) => id !== item.id));
        } else {
            setExpandedItems([...expandedItems, item.id]);
        }
    };

    const hasChildren = (item) => {
        return Array.isArray(item.children) && item.children.length > 0;
    };

    const isSelected = expandedItems.includes(item.id);

    // Define styles based on level
    const textWeight = [600, 100, 100]; //
    const paddingLeftProp = ["0rem", "3rem", "6rem"];

    const weight = textWeight[level] || textWeight[textWeight.length - 1]; // Default to the last color if level is too deep
    const paddingLeftProperty =
        paddingLeftProp[level] || paddingLeftProp[paddingLeftProp.length - 1];

    return (
        <div className="custom-accordion-wrapper">
            <div
                className="custom-accordion-wrapper-nested"
                onClick={hasChildren(item) ? toggle : undefined}
                style={{
                    cursor: hasChildren(item) ? "pointer" : "default",
                    width: "100%",
                    backgroundColor: hasChildren(item) ? "#e5e5e5" : "#fff",
                }}
            >
                <div
                    className="custom-accordion-wrapper-nested-item"
                    style={{ paddingLeft: paddingLeftProperty }}
                >
                    {hasChildren(item) &&
                        (isSelected ? (
                            <ImageComponent
                                src="chevron--up.svg"
                                alt="chevron--up-icon"
                                style={{ width: "1.5rem" }}
                            />
                        ) : (
                            <ImageComponent
                                src="chevron--down.svg"
                                alt="chevron--down-icon"
                                style={{ width: "1.5rem" }}
                            />
                        ))}
                    <span style={{ fontWeight: weight }}>{item.title}</span>
                </div>

                <div
                    className={"accordianItemSpacing"}
                    style={{
                        display: "flex",
                        gap: "6.4rem",
                        flexDirection: "row",
                    }}
                >
                    {console.log(keys && keys[0])}
                    {item.rowData.map((subItem) => (
                        <div>
                            {keys && subItem[`${keys[0]}`]} {keys && subItem[`${keys[1]}`]}{" "}
                            {keys && subItem[`${keys[2]}`]} {keys && subItem[`${keys[3]}`]}{" "}
                            {/* {subItem.annualized} */}
                        </div>
                    ))}
                </div>
            </div>
            {isSelected && (
                <div className="custom-accordion-wrapper-subNested">
                    {hasChildren(item) && renderNestedLevels(item.children, level + 1)}
                </div>
            )}
        </div>
    );
};

export default AccordionComp;
