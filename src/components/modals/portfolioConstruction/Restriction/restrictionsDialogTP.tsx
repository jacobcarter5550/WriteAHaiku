import React, { useEffect, useState } from "react";
import { DialogTitle, IconButton, Stack } from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Optimization, PartialSecurity } from "../portfolioConstructionConfigTP.tsx";
import {
    generateRandomFourDigitNumber,
    pruneSecurityToRestrictionDefinition,
    transformSecurityToPartialSecurity,
} from "../lib.ts";
import { Security } from "../../SecurityPreview/securtityViewTP.tsx";
import CustomSelect from "../../../../ui-elements/selectTP.tsx";
import SideModal from "../../../../ui-elements/SideModal.tsx";
import { useAppSelector } from "../../../../store/index.ts";
import { getSecurities } from "../../../../store/nonPerstistant/selectors.ts";
import ImageComponent from "../../../../ui-elements/ImageComponent.tsx";

type RestrictDialogProps = {
    incrementPage: () => void;
    decrementPage: () => void;
    optimizationDefinition: Optimization | null;
    returnedSecurity: PartialSecurity[] | null;
    setReturnedSecurity: React.Dispatch<React.SetStateAction<any>>;
    close: React.Dispatch<React.SetStateAction<boolean>>;
    setOptimizationDefintion: React.Dispatch<React.SetStateAction<Optimization | null>>;
    account: any;
    edit: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

type CustomCheckBoxProps = {
    onClick?: (any: any) => void;
    value: boolean;
    params: any;
    setSecurity: React.Dispatch<React.SetStateAction<PartialSecurity[] | null>>;
    setOpt: React.Dispatch<React.SetStateAction<Optimization | null>>;
};

function CustomCheckBox({ value, params, setSecurity, setOpt }: CustomCheckBoxProps) {
    const [enabled, setEnabled] = useState(value ?? false);

    const onclick = (event) => {
        console.log(event);
        event.stopPropagation();
        setEnabled(!enabled);
        let secs: PartialSecurity[] | null = null;
        setSecurity((prevState) => {
            const updated = prevState!.map((item) => {
                if (item.id === params.row.id) {
                    const resetFields = {
                        holdOnly: null,
                        buyNotSell: null,
                        sellNotBuy: null,
                        sellAll: null,
                    };
                    return { ...item, ...resetFields, [params.field]: !enabled };
                } else {
                    return item;
                }
            });
            secs = updated;
            return updated;
        });
        const formatted = pruneSecurityToRestrictionDefinition(secs!);
        // @ts-ignore
        setOpt((definition) => {
            return { ...definition, securityRestrictions: formatted };
        });
    };

    useEffect(() => {
        setEnabled(value);
    }, [value]);

    return (
        <>
            <IconButton
                disableRipple
                sx={{ height: "100%", width: "100%", radius: "0" }}
                onClick={onclick}
            >
                {enabled && <img src="/checkmarkGreen.svg" alt="check" />}
            </IconButton>
        </>
    );
}

function checkboxColumnFunction(
    field: string,
    name: string,
    setSecurity: React.Dispatch<React.SetStateAction<PartialSecurity[] | null>>,
    setOpt: React.Dispatch<React.SetStateAction<Optimization | null>>
): any {
    return {
        field: field,
        align: "center",
        headerAlign: "center",
        headerName: name,
        renderCell: (params: any) => (
            <CustomCheckBox
                setSecurity={setSecurity}
                setOpt={setOpt}
                params={params}
                value={params.row[field]}
            />
        ),
        width: 125,
        sortable: false,
    };
}

export default function RestrictDialog({
    decrementPage,
    incrementPage,
    optimizationDefinition,
    returnedSecurity,
    setReturnedSecurity,
    close,
    setOptimizationDefintion,
    account,
    edit,
    setEdit,
}: RestrictDialogProps) {
    const [searchTerms, setSearchTerms] = useState<string[]>([]);

    function filterSecurities(securities, searchTerms) {
        // If searchTerms is empty, return the entire securities array
        if (searchTerms.length === 0) {
            return securities;
        }

        // Extract search values from searchTerms
        const searchValues = searchTerms.map((term) => term.value);

        // Filter securities based on whether their name is in searchValues
        return securities.filter((security) => searchValues.includes(security.securityName));
    }

    const availableSecurities = returnedSecurity!.map((sec) => {
        return { label: sec.securityName, value: sec.securityName };
    });

    const filteredReturnedSecurity = filterSecurities(returnedSecurity, searchTerms);

    console.log(optimizationDefinition);
    const columns = (
        securities: any,
        setSecurity: React.Dispatch<React.SetStateAction<PartialSecurity[] | null>>,
        setOpt: React.Dispatch<React.SetStateAction<Optimization | null>>
    ): GridColDef<any>[] => [
        {
            field: "securityCd",
            headerAlign: "center",
            headerName: "Ticker",
            width: 200,
        },
        {
            field: "securityName",
            headerAlign: "center",
            headerName: "Security Name",
            width: 200,
        },
        checkboxColumnFunction("holdOnly", "Hold Only", setSecurity, setOpt),
        checkboxColumnFunction("buyNotSell", "Buy Not Sell", setSecurity, setOpt),
        checkboxColumnFunction("sellNotBuy", "Sell Not Buy", setSecurity, setOpt),
        checkboxColumnFunction("sellAll", "Sell All", setSecurity, setOpt),
    ];

    const securities = useAppSelector(getSecurities);

    console.log(filteredReturnedSecurity);

    const updateFilteredModels = () => {
        let firstMissingSecurity = securities!.find(
            (sec) => !filteredReturnedSecurity!.some((fm) => fm.securityId === sec.securityId)
        )!;
        console.log(firstMissingSecurity);
        console.log(generateRandomFourDigitNumber());
        firstMissingSecurity["id"] = generateRandomFourDigitNumber();
        const createdPartialSecurity = transformSecurityToPartialSecurity(firstMissingSecurity);

        if (firstMissingSecurity) {
            let dup = structuredClone(optimizationDefinition!);

            dup.securityRestrictions.unshift(createdPartialSecurity);

            let clonedState = structuredClone(filteredReturnedSecurity);

            clonedState.unshift(createdPartialSecurity);
            setOptimizationDefintion(dup);

            setReturnedSecurity([...clonedState]);
        }
    };

    const [rowsToRemove, setRowsToRemove] = useState<string[]>([]);

    function removeRows() {
        let dup = structuredClone(optimizationDefinition!);

        let clonedState = structuredClone(filteredReturnedSecurity);

        const filtered = clonedState.filter(
            (security) => !rowsToRemove.includes(security.securityId)
        );

        dup.securityRestrictions = filtered;

        setOptimizationDefintion(dup);
        setReturnedSecurity(filtered);
        return;
    }

    const [holdTimer, setHoldTimer] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        return () => {
            if (holdTimer) {
                clearTimeout(holdTimer);
            }
        };
    }, [holdTimer]);

    const handleMouseDown = () => {
        // Start the timer
        const timer = setTimeout(() => {
            setShowModal(true); // Show modal after 500ms
            setHoldTimer(null); // Reset timer state
        }, 500); // Adjust time as needed
        setHoldTimer(timer);
    };

    const handleMouseUp = () => {
        // Clear timer on mouse up
        if (holdTimer) {
            clearTimeout(holdTimer);
            setHoldTimer(null);
        }
    };

    const handleClick = (e) => {
        // Prevent the default action if it's a quick click
        if (holdTimer !== null) {
            e.preventDefault();
        } else {
            updateFilteredModels();
        }
    };

    console.log(securities);
    const missingRestrictions = securities?.filter(
        (sec) => !filteredReturnedSecurity!.some((fm) => fm.securityId === sec.securityId)
    );

    function addIndiRestriction(restriction: Security) {
        let dup = structuredClone(optimizationDefinition!);

        let clonedState = structuredClone(filteredReturnedSecurity);
        restriction["id"] = generateRandomFourDigitNumber();
        const createdPartialSecurity = transformSecurityToPartialSecurity(restriction);

        clonedState.unshift(createdPartialSecurity);

        dup.securityRestrictions.unshift(createdPartialSecurity);

        setOptimizationDefintion(dup);
        setReturnedSecurity([...clonedState]);
        setShowModal(false);
    }

    return (
        <section className="restrictionsContent">
            <div>
                <DialogTitle textAlign="center" mt="1em" fontSize={"2rem"} fontWeight={"500"}>
                    Portfolio Construction (Restrictions)
                </DialogTitle>
                <Stack direction="row" sx={{ width: "100%" }} className="imgRowHelper">
                    <CustomSelect
                        customWidth="500px"
                        onChange={(data) => {
                            console.log(data);
                            setSearchTerms(data);
                        }}
                        multi
                        defaultValue={
                            Object.keys(searchTerms).length > 0 && {
                                label: searchTerms[0],
                            }
                        }
                        options={availableSecurities}
                    />
                    <span style={{ display: "flex" }}>
                        <img
                            src="dark-mic.svg"
                            alt="Microphone-icon"
                            title="Mic"
                            style={{
                                width: "1.5vw",
                                margin: "0.6em",
                                padding: "0.5em",
                                backgroundColor: "#383c93",
                              
                            }}
                        />
                        <img
                            src="trash-can--white.svg"
                            alt="trash-can-icon"
                            onClick={() => {
                                removeRows();
                            }}
                        />
                        <img
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onClick={handleClick}
                            src="/add--white.svg"
                            alt=""
                        />
                        {showModal && (
                            <SideModal
                                style={{ right: "25px" }}
                                close={() => {
                                    setShowModal(false);
                                }}
                            >
                                {missingRestrictions?.map((item) => {
                                    return (
                                        <p
                                            onClick={() => {
                                                addIndiRestriction(item);
                                            }}
                                        >
                                            {item.securityName}
                                        </p>
                                    );
                                })}
                            </SideModal>
                        )}
                    </span>
                </Stack>
                {filteredReturnedSecurity !== null && (
                    <DataGrid
                        rows={filteredReturnedSecurity}
                        columns={columns(
                            filteredReturnedSecurity,
                            setReturnedSecurity,
                            setOptimizationDefintion
                        )}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        onCellClick={(event) => {
                            if (event.field === "__check__" && event.value === false) {
                                console.log(event);
                                setRowsToRemove([...rowsToRemove, event.row.securityId]);
                            } else if (event.field === "__check__" && event.value === true) {
                                console.log(event);
                                setRowsToRemove(
                                    rowsToRemove.filter((item) => item !== event.row.securityId)
                                );
                            }
                        }}
                        sx={{
                            width: "100%",

                            "& .MuiDataGrid-cell:hover": {
                                color: "gray",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#E5E5E5",
                                color: "#383C93",
                                fontSize: "1.6rem",
                            },
                            "& .MuiDataGrid-cellCheckbox": {
                                color: "black",
                            },
                            "& .MuiDataGrid-selected": {
                                backgroundColor: "#E5E5E5",
                            },
                        }}
                    />
                )}
            </div>
        </section>
    );
}
