import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import api from "../../../../helpers/serviceTP.ts";
import { OptimizationSelection, RebalanceResponse } from "../types.ts";
import { Node } from "../../../modals/portfolioConstruction/types.ts";
import { useToastContext } from "../../../../providers/contexts/toastcontextTP.ts";
import { useAppSelector } from "../../../../store/index.ts";
import { portfolioSelectors } from "../../../../store/portfolio/selector.ts";

type AlignOptions = "left" | "inherit" | "center" | "right" | "justify" | undefined;

type Header = {
    portId: string;
    optHistId: string;
    name: string;
    minWidth: number;
    editable: boolean;
    sortable: boolean;
    headerAlign: string;
    align: AlignOptions;
    flex: number;
};

type OptmizationSelectionProps = {
    selectedPorts: Node[];
    setOptmHists: React.Dispatch<React.SetStateAction<OptimizationSelection[]>>;
};

const OptmizationSelection = ({ selectedPorts, setOptmHists }: OptmizationSelectionProps) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [headers, setHeaders] = useState<Header[]>([{} as Header]);
    const [rows, setRows] = useState<OptimizationSelection[][]>([[{} as OptimizationSelection]]);
    const [selectedPortValues, setSelectedPortValues] = useState<number[]>([]);
    const [apiResults, setApiResults] = useState<OptimizationSelection[][]>([]);

    const portfolios = useAppSelector(portfolioSelectors);

    const { showToast } = useToastContext();

    const handleChangePage = (
        _: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const findValueByPortfolioName = (portfolioName, regions: any[]) => {
        for (const region of regions) {
            for (const option of region.options) {
                if (option.label === portfolioName) {
                    return option.value;
                }
            }
        }
        return null;
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleShowToast = () => {
        showToast("Can't compare more than 3 events");
    };

    useEffect(() => {
        if (selectedPorts.length == 0) {
            setHeaders([{} as Header]);
            setRows([[{} as OptimizationSelection]]);
            return;
        }
        const heads = selectedPorts.map((pId) => {
            return {
                portId: pId.id,
                optHistId: pId.id,
                name: pId.name!,
                minWidth: 70,
                editable: false,
                sortable: false,
                headerAlign: "center",
                align: "center" as AlignOptions,
                flex: 1,
            };
        });
        setHeaders(heads);

        const updatedSelectedPortValues = [...selectedPortValues];

        if (selectedPorts.length > selectedPortValues.length) {
            selectedPorts.forEach((port) => {
                const value = findValueByPortfolioName(port.name, portfolios);
                if (!updatedSelectedPortValues.includes(value)) {
                    updatedSelectedPortValues.push(value);

                    //new value which got added
                    const newDataPromise = fetchDataFromApi(value);

                    newDataPromise
                        .then((newData: OptimizationSelection[]) => {
                            newData.unshift({
                                parentId: value,
                                portId: "dummy",
                                optHistId: "dummy",
                                optHistName: "dummy",
                            });
                            setApiResults((prevResults) => {
                                return [...prevResults, newData];
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            });
        } else {
            let valueToKeep: typeof selectedPortValues = [];
            selectedPorts.forEach((port) => {
                const value = findValueByPortfolioName(port.name, portfolios);
                if (selectedPortValues.includes(value)) {
                    valueToKeep.push(value);
                }
            });
            updatedSelectedPortValues.forEach((valueToRemove) => {
                if (!valueToKeep.includes(valueToRemove)) {
                    const index = updatedSelectedPortValues.indexOf(valueToRemove);
                    updatedSelectedPortValues.splice(index, 1);
                }
            });

            const filteredResults = apiResults.filter((resultArray) => {
                if (resultArray.length > 0) {
                    const portIdOfFirstItem = Number(resultArray[0].parentId);
                    return valueToKeep.includes(portIdOfFirstItem);
                }
                return false;
            });
            setApiResults(filteredResults);
        }

        setSelectedPortValues(updatedSelectedPortValues);
    }, [selectedPorts]);

    const fetchDataFromApi = (number: number) => {
        const rootUrl = "/optevents/";
        const apiUrl = rootUrl + number;

        return api
            .get(apiUrl)
            .then((res) => {
                if (res && res.data.length > 0) {
                    const optmEvent: OptimizationSelection[] = res.data.map((evt, index) => {
                        return {
                            parentId: selectedPorts[0]["id"],
                            portId: evt.eventId,
                            optHistId: evt.eventId,
                            optHistName: evt.eventName + index,
                        };
                    });
                    return optmEvent;
                }
                return [];
            })
            .catch((error) => {
                console.error(error);
                return [];
            });
    };

    useEffect(() => {
        let len = 0;
        if (apiResults) {
            apiResults.forEach((resultArray) => {
                len = Math.max(len, resultArray.length);
            });

            const data: OptimizationSelection[][] = [];

            for (let i = 1; i < len; i++) {
                const rowData: OptimizationSelection[] = [];
                for (let j = 0; j < selectedPorts.length; j++) {
                    if (apiResults[j] && apiResults[j][i]) {
                        rowData.push(apiResults[j][i]);
                    }
                }
                data.push(rowData);
            }

            setRows(data);
        }
    }, [apiResults]);

    const handleCellClick = (row_id, col_id) => {
        const nRows = rows.map((r) => r);
        let totalSelected = 0;
        for (let i = 0; i < nRows.length; i++) {
            for (let j = 0; j < nRows[i].length; j++) {
                if (nRows?.[i][j]?.isSelected) {
                    totalSelected++;
                }
            }
        }
        if (totalSelected >= 3 && !nRows[row_id][col_id]?.isSelected) {
            handleShowToast();
            return;
        }

        if (nRows[row_id][col_id]["isSelected"]) nRows[row_id][col_id]["isSelected"] = false;
        else {
            nRows[row_id][col_id]["isSelected"] = true;
        }
        setRows(nRows);
        const selectedOptmHists: OptimizationSelection[] = [];
        nRows.forEach((row) => {
            row.filter((col) => col?.isSelected).forEach((cl) => selectedOptmHists.push(cl));
        });

        console.log("SELECT OBJ", selectedOptmHists);
        setOptmHists(selectedOptmHists);
    };

    return (
        <Paper sx={{ width: "100%", overflow: "hidden" }} className="optimization-selection">
            <div className="container">
                <div
                    style={{
                        textAlign: "center",
                        paddingTop: 10,
                    }}
                >
                    <span id="oh_main_heading_1" style={{ fontSize: "1.2rem", fontWeight: "800" }}>
                        Optimization History by Portfolio
                        <span style={{ fontWeight: "500" }}> (up to 3 portfolios)</span>
                    </span>
                </div>
            </div>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        {/* <TableCell
                            size={"small"}
                            key={"column.id"}
                            align={"center"}
                            colSpan={3}
                            sx={{
                                fontWeight: "700",
                                color: "#13023e",
                                backgroundColor: "#e5e5e5",
                                fontSize: "1.2rem",
                                border: "1px ridge rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            {"Optimization History by Portfolio "}
                            <span style={{ color: "#13023e", fontWeight: "300" }}>
                                (up to 3 events)
                            </span>
                        </TableCell> */}
                        <TableRow>
                            {headers.map((column, index) => {
                                // console.log(column);
                                return (
                                    <TableCell
                                        size={"small"}
                                        key={index}
                                        align={column.align}
                                        sx={{
                                            minWidth: column.minWidth,
                                            color: "#7a7db4",
                                            backgroundColor: "#e9eaec",
                                            borderWidth: 1,
                                            borderColor: "#f2f6fc",
                                            borderStyle: "solid",
                                            fontWeight: "600",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {column.name}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, r_index) => {
                            // console.log("row", row);
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={"row.id" + r_index}
                                >
                                    {row &&
                                        row.length > 0 &&
                                        row.map((column, c_index) => {
                                            const value = column?.optHistName;
                                            return (
                                                <TableCell
                                                    size={"small"}
                                                    key={column?.optHistId}
                                                    align={"center"}
                                                    sx={{
                                                        fontWeight: column?.isSelected ? 600 : 100,
                                                    }}
                                                    onClick={() =>
                                                        handleCellClick(r_index, c_index)
                                                    }
                                                    style={{
                                                        backgroundColor: column?.isSelected
                                                            ? "#e5e5e5"
                                                            : "",
                                                    }}
                                                >
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default OptmizationSelection;
