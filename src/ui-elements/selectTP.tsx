import React from "react";
import Select, {
    ActionMeta,
    GroupBase,
    OptionsOrGroups,
    StylesConfig,
    SingleValueProps,
    OptionProps,
    components,
} from "react-select";
import { SelectComponents } from "react-select/dist/declarations/src/components";
import { useTheme } from "next-themes";

export interface BackgroundTaskResponsePayload {
    request_id: string;
    status: string;
}

export type CustomSelectProps = {
    options?: OptionsOrGroups<any, GroupBase<any>>;
    value?: any;
    onChange?: (newValue: any, actionMeta: ActionMeta<any>) => void;
    styles?: StylesConfig<any, any, GroupBase<any>>;
    // components?: Partial<SelectComponents<any, any, GroupBase<any>>>;
    multi?: any;
    maxMenuHeight?: any;
    customWidth?: string;
    placeholder?: string;
    defaultValue?: any;
    disabled?: boolean;
    customHeight?: string;
    customIndicatorHeight?: string;
    placeholderColor?: string;
    onMenuOpenHandler?: any;
    isSearchable?: boolean;
    customComponents?: {
        SingleValue?: React.ComponentType<SingleValueProps<any>>;
        Option?: React.ComponentType<OptionProps<any>>;
        IndicatorSeparator?: React.ComponentType<any>;
    };
};

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    styles,
    // components,
    multi,
    customWidth,
    placeholder,
    defaultValue,
    maxMenuHeight,
    disabled,
    customHeight,
    customIndicatorHeight,
    placeholderColor,
    onMenuOpenHandler,
    isSearchable,
    customComponents = {},
}) => {
    const theme = useTheme();
    const customStyles = {
        control: (provided) => ({
            ...provided,
            minWidth: "5vw",
            maxWidth: customWidth ? "" : "12.5vw",
            width: customWidth || "10.5vw",
            borderRadius: "0",
            fontSize: "1.2rem",
            minHeight: "unset",
            height: customHeight || "2.55rem",
            borderWidth: "0px",
            cursor: "pointer",
            backgroundColor: theme.theme == "light" ? "#fff" : "#0D0D0D",
            position: "unset",
        }),
        container: (provided) => ({
            ...provided,
            position: "unset",
        }),
        singleValue: (provided) => ({
            ...provided,
            overflow: "visible",
            color: theme.theme == "dark" ? "#fff" : "#181818",
        }),
        valueContainer: (provided) => ({
            ...provided,
            // height: "2.75rem",
            padding: "0 6px",
            display: "flex",
            flexWrap: "nowrap", // Enable flex-wrap for all selected options
        }),
        multiValue: (provided) => ({
            ...provided,
        }),
        groupHeading: (provided) => ({
            ...provided,
            fontSize: "1.6rem", // Set the desired font size for group heading
            colot: "#002D9C",
            fontWeight: "bold", // You can customize other styles as well
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: 0, // Set border radius to 0 for the menu block
            marginTop: "0",
        }),
        input: (provided) => ({
            ...provided,
            margin: "0px",
        }),
        option: (provided, state) => {
            return {
                ...provided,
                fontSize: "1.2rem",
                borderRadius: "0px",
                paddingLeft: "2rem",
                marginTop: "0px",
                color:
                    theme.theme == "dark"
                        ? state.isFocused
                            ? "#f4f4f4"
                            : "#fff"
                        : state.isFocused
                        ? "#181818"
                        : "#181818",
                cursor: "pointer",
                backgroundColor:
                    theme.theme == "dark"
                        ? state.isFocused
                            ? "#393939"
                            : "#181818"
                        : state.isFocused
                        ? "#e9eaea"
                        : "#f4f4f4", // Change the hover color here
            };
        },
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
            flexWrap: "nowrap",
            fontSize: "11px",
            borderRadius: "0px",
        }),
        menuList: () => ({
            backgroundColor: theme.theme == "light" ? "#fff" : "#181818",
            maxHeight: "60vh", // Set the maximum height for the dropdown menu
            overflowY: "auto" as any, // Enable scrolling within the dropdown
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: customIndicatorHeight || "2.75rem",
        }),
        placeholder: () => ({
            color:
                placeholderColor && theme.theme == "light"
                    ? placeholderColor
                    : theme.theme == "light"
                    ? "black"
                    : "white",
        }),
    };
    const {
        SingleValue = (props: SingleValueProps<any>) => <components.SingleValue {...props} />,
        Option = (props: OptionProps<any>) => <components.Option {...props} />,
        IndicatorSeparator = () => null,
    } = customComponents;

    return (
        <Select
            className="helperofhelper"
            isDisabled={disabled}
            options={options}
            value={value}
            components={{
                IndicatorSeparator,
                SingleValue,
                Option,
            }}
            maxMenuHeight={100}
            placeholder={placeholder}
            defaultValue={defaultValue}
            menuPortalTarget={document.body}
            menuPlacement="auto"
            onChange={async (newVal, actionMeta) => {
                onChange!(newVal, actionMeta);
            }}
            isMulti={multi}
            styles={styles ? styles : customStyles}
            onMenuOpen={onMenuOpenHandler}
            isSearchable={isSearchable}
        />
    );
};

export default CustomSelect;
