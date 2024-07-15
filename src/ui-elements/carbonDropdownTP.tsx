import React from "react";
import { Dropdown, DropdownItem } from "carbon-components-react";
import classNames from "classnames";
import { useTheme } from "next-themes";

interface CustomDropdownProps {
    inline?: boolean;
    items: DropdownItem[];
    label: string;
    onClick?: (item: DropdownItem) => void;
    customClassName?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    inline,
    items,
    label,
    onClick,
    customClassName,
}) => {
    const theme = useTheme();

    const dropdownClass = classNames({
        "inline-dropdown": inline,
        "regular-dropdown": !inline,
    });
    const dropdownClassDarkMode = classNames({
        "inline-dropdown-dark-mode": inline,
        "regular-dropdown": !inline,
    });

    const applyStyles = (
        styleFn: (base: React.CSSProperties) => React.CSSProperties,
        baseStyle: React.CSSProperties
    ) => {
        return styleFn ? styleFn(baseStyle) : baseStyle;
    };

    return (
        <Dropdown
            open={true}
            className={`${
                theme.theme == "light" ? dropdownClass : dropdownClassDarkMode
            } ${customClassName}`}
            id={
                theme.theme === "light"
                    ? inline
                        ? "inline-dropdown"
                        : "regular-dropdown"
                    : inline
                    ? "inline-dropdown-dark-mode"
                    : "regular-dropdown"
            }
            label={label}
            items={items}
            itemToString={(item) => (item ? item.text : "")}
            onChange={(selectedItem) => onClick && onClick(selectedItem)}
        />
    );
};

export default CustomDropdown;
