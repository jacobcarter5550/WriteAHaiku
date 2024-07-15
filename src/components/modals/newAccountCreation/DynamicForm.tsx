import React, { ChangeEvent, useState } from "react";
import { TextInput, Dropdown } from "@carbon/react";
import { useTheme } from "next-themes";
import { Theme } from "@carbon/react";

interface FormElement {
    id: string;
    labelName: string;
    inputType: "TextField" | "Dropdown";
    options?: string[]; // Only needed if inputType is 'Dropdown'
}

interface DynamicFormProps {
    elements: FormElement[];
}
interface FormValues {
    [key: string]: string;
}
const DynamicForm: React.FC<DynamicFormProps> = ({ elements }) => {
    const theme = useTheme();
    const [formValues, setFormValues] = useState<FormValues>({});

    const handleInputChange = (id: string, value: string) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };
    console.log("formValues", formValues);
    const renderFormElement = (element: FormElement) => {
        switch (element.inputType) {
            case "TextField":
                return (
                    <TextInput
                        size="lg"
                        id={element.id}
                        labelText={element.labelName}
                        placeholder={`Enter ${element.labelName}`}
                        value={formValues[element.id] || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(element.id, e.target.value)
                        }
                        // style={{ backgroundColor: "#fff" }}
                    />
                );
            case "Dropdown":
                return (
                    <Dropdown
                        size="lg"
                        id={element.id}
                        titleText={element.labelName}
                        label={`Choose`}
                        items={element.options || []}
                        itemToString={(item) => (item ? item.toString() : "")}
                        selectedItem={formValues[element.id] || ""}
                        onChange={(e) =>
                            handleInputChange(element.id, e.selectedItem?.toString() || "")
                        }
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Theme theme={theme.theme == "light" ? "white" : "g100"}>
            <div className="step-one-form-container">
                {elements.map((element, index) => (
                    <div key={element.id} className="step-one-form-element">
                        {renderFormElement(element)}
                    </div>
                ))}
            </div>
        </Theme>
    );
};

export default DynamicForm;
