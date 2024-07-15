import React from "react";
import AccordionComp from "./AccordionComp.tsx";
import { useTheme } from "next-themes";
import ImageComponent from "../../../../../ui-elements/ImageComponent.tsx";

function AccordionWrapper({ expandedItems, setExpandedItems, accordionData, keys }) {
    const renderNestedLevels = (data, level = 0) => {
        return data.map((item) => (
            <AccordionComp
                item={item}
                renderNestedLevels={renderNestedLevels}
                key={item.id}
                expandedItems={expandedItems}
                setExpandedItems={setExpandedItems}
                level={level}
                keys={keys}
            />
        ));
    };

    // const renderTopLevel = (data) => {
    //   return data.map((item) => (
    //     <React.Fragment key={item.id}>
    //       <div className="header-table-wrapper-item">
    //         <ImageComponent
    //           src="chevron--down.svg"
    //           alt="chevron--down-icon"
    //           style={{ width: "1.5rem" }}
    //         />
    //         <div className="header-table-wrapper-item-header">{item.title}</div>
    //       </div>
    //       {item.children && renderNestedLevels(item.children)}
    //     </React.Fragment>
    //   ));
    // };

    // return <>{renderTopLevel(accordionData)}</>;
    return (
        <div className="">
            {accordionData.map((item) => (
                <AccordionComp
                    item={item}
                    renderNestedLevels={renderNestedLevels}
                    key={item.id}
                    expandedItems={expandedItems}
                    setExpandedItems={setExpandedItems}
                    level={0} // top level
                    keys={keys}
                />
            ))}
        </div>
    );
}

export default AccordionWrapper;
