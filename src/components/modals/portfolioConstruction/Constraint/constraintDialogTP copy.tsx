import React, { useState, useEffect, useMemo } from "react";
import {
    DialogTitle,
    Stack,
    TextField,
    Select,
    MenuItem,
    AccordionDetails,
    Accordion,
    AccordionSummary,
} from "@mui/material";

import { styled } from "@mui/system";
import Button from "../../../../ui-elements/buttonTP.tsx";
import {
    Constraint,
    ConstraintDialogProps,
    ConstraintTypes,
} from "../portfolioConstructionConfigTP.tsx";
import {
    RadioButtonGroup,
    RadioButton,
    Accordion as CarbAccordion,
    AccordionItem,
    Slider,
    TextInput,
} from "@carbon/react";
import api from "../../../../helpers/serviceTP.ts";
import ConstraintsTable from "./ConstraintsTable.tsx";
import { dummyData } from "../dummy.ts";

export const BootStrappedStack = styled(Stack)({
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    padding: "1em",
    marginTop: "1em",
    zIndex: "5",
});

export const TableContainer = styled("div")({
    backgroundColor: "white",
    width: "100%",
    padding: "1em",
    paddingTop: "0",
    maxHeight: "100%",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    scrollbarWidth: "none",
});

export function DialogSection(props) {
    return (
        <BootStrappedStack direction="row">
            <label style={{ width: "max-content", height: "100%" }}>{props.title}</label>
            {props.children}
        </BootStrappedStack>
    );
}

export function getKeyByValue(constraintTypes: ConstraintTypes, value: number): string | undefined {
    for (const key in constraintTypes) {
        if (constraintTypes[key] === value) {
            return key;
        }
    }
    return undefined; // return undefined if no match is found
}

export function TableRow(props) {
    console.log(props);

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}
            style={{
                position: "relative",
                zIndex: "3",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <label style={{ maxWidth: "10%" }}>
                {" "}
                {props.uid?.constraintType ?? props.node?.name?.name}
            </label>
            <div
                style={{
                    width: "85%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                }}
            >
                <RadioButtonGroup
                    name={`radio-button-group${props.index}`}
                    defaultSelected={`ABS${props.index}`}
                    orientation="horizontal"
                    // value={props.state[props.section][props.uid].radio1}
                >
                    <RadioButton
                        defaultChecked
                        labelText="ABS"
                        value={`ABS${props.index}`}
                        id={`ABS${props.index}`}
                    />
                    <RadioButton
                        labelText="REL"
                        value={`REL${props.index}`}
                        id={`REL${props.index}`}
                    />
                </RadioButtonGroup>
                <RadioButtonGroup
                    name={`radio-button-group2${props.index}`}
                    orientation="horizontal"
                    defaultValue={`Soft${props.index}`}
                >
                    <RadioButton
                        labelText="Soft"
                        value={`Soft${props.index}`}
                        id={`Soft${props.index}`}
                    />
                    <RadioButton
                        labelText="Hard"
                        value={`Hard${props.index}`}
                        id={`Hard${props.index}`}
                    />
                </RadioButtonGroup>
                <p style={{ marginRight: "1vw" }}>LB/UB</p>
                <Slider
                    className="sliderHelper"
                    min={-1}
                    max={1}
                    value={0}
                    step={0.1}
                    hideTextInput
                />
                <div style={{ display: "flex", alignItems: "center", justifySelf: "end" }}>
                    <label style={{ marginRight: "1em" }}> Penalty </label>
                    <TextField
                        variant="outlined"
                        margin="none"
                        sx={{ width: "60px" }}
                        inputProps={{ style: { padding: 5, textAlign: "center" } }}
                    />
                </div>
            </div>
        </div>
    );
}

const ConstraintDialogContent: React.FC<ConstraintDialogProps> = ({
    decrementPage,
    incrementPage,
    optimizationDefinition,
    setDialogState,
    selectedPortfolio,
    constraintTypes,
    setOptimizationDefintion,
    state,
}) => {
    console.log(optimizationDefinition);
    // Global State for the entire dialog. Global State is saved in the parent component.

    function buildTree(data) {
        const root = { children: [] as any[] };

        data.forEach((item) => {
            let path = item.children;
            let currentLevel = root;
            path.forEach((name, index) => {
                let existingChild = currentLevel.children.find((child) => child.name === name);

                if (!existingChild) {
                    const newChild = {
                        name,
                        data: index === path.length - 1 ? item : null,
                        children: [],
                    };
                    currentLevel.children.push(newChild);
                    existingChild = newChild;
                }

                currentLevel = existingChild;
            });
        });

        return root.children;
    }

    const [constraints, setConstraints] = useState<Constraint[] | null>(null);

    useEffect(() => {
        function constuctConstraints(consts: Constraint[]) {
            const map = consts
                .map((con) => {
                    if (con.constraintTypeId) {
                        con.constraintType = getKeyByValue(constraintTypes, con.constraintTypeId);
                        console.log(con);
                        return con;
                    } else {
                        return undefined;
                    }
                })
                .filter((con) => con !== undefined);
            return map as Constraint[];
        }

        const constructed = constuctConstraints(optimizationDefinition!.constraints);

        if (constraints == null) {
            setConstraints(constructed);
        }
    }, []);

    let setState = (state) => {
        setDialogState(state);
        console.log("Updated State", state); // Change this line to a PUT Command to save configurations
    };

    console.log(selectedPortfolio);

    return (
        <>
            <div style={{ display: "flex", justifyContent: "end" }}>
                <img
                    src="dark-mic.svg"
                    alt="Microphone-icon"
                    title="Mic"
                    style={{ height: "2.5rem", backgroundColor: "#383c93", padding: ".5rem" }}
                />
            </div>
            <DialogSection title={"Portfolio Target:"}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    useFlexGap
                    flexGrow="1"
                    ml="1em"
                    mr="1em"
                >
                    <aside style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ marginRight: ".5em" }}>Alpha</p>
                        <Slider
                            className="sliderHelper slideHelper"
                            min={-1}
                            max={1}
                            value={optimizationDefinition!.targetAlpha!}
                            step={0.1}
                            hideTextInput
                        />
                    </aside>
                    <aside style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ marginRight: ".5em" }}>TE</p>
                        <Slider
                            className="sliderHelper slideHelper"
                            min={-1}
                            max={1}
                            value={optimizationDefinition!.targetTrackingError!}
                            step={0.1}
                            hideTextInput
                        />
                    </aside>
                    <aside style={{ display: "flex", alignItems: "center" }}>
                        <p style={{ marginRight: ".5em" }}>Vol</p>
                        <Slider
                            className="sliderHelper slideHelper"
                            min={-1}
                            max={1}
                            value={optimizationDefinition!.targetVol!}
                            step={0.1}
                            hideTextInput
                        />
                    </aside>
                </Stack>
            </DialogSection>
            <DialogSection title={"Portfolio Constraints"}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: "3em",
                        flexGrow: "1",
                    }}
                    className="inputHelper"
                >
                    <label>
                        <span>Portfolio : {selectedPortfolio[0].label}</span>
                    </label>
                    <TextInput
                        id="text-input-1"
                        labelText=""
                        style={{ width: "5em" }}
                        size="sm"
                        defaultValue="100%"
                    />
                </div>
            </DialogSection>
        </>
    );
};

export default ConstraintDialogContent;
