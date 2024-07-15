import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import api from "../../../../helpers/serviceTP.ts";
import { OptEventResponse, OptimizationSelection, SecurityHolding } from "../types.ts";
import Grid from "../../../../ui-elements/aggrid.tsx";

type ComparisonTableProps = {
    optmHists: OptimizationSelection[];
};

const ComparisonTable = ({ optmHists }: ComparisonTableProps) => {
    const [rows, setRows] = useState<any>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(11);

    interface rows {
        eventId: string;
        accountId: number;
        secId: string;
        secName: string;
        f_preOptWt: number;
        f_postOptWt: number;
        f_tradeWt: number;
        creationTimestamp: string;
    }

    const generateColumnDefs = (accountData: OptimizationSelection[]): any[] => {
        const accountColumns: any[] = accountData.map((account) => ({
            headerName: account.optHistName,
            headerClass: "account-header",
            children: [
                {
                    field: `${account.optHistId}_preOptimizationWeight`,
                    headerName: "Pre-opt",
                    valueFormatter: (params) => (params.value * 100).toFixed(2) + "%",
                    width: 109,
                    cellClassRules: (params) => params.value,
                },
                {
                    field: `${account.optHistId}_postOptimizationWeight`,
                    headerName: "Post-opt",
                    valueFormatter: (params) => (params.value * 100).toFixed(2) + "%",
                    width: 109,
                    cellClassRules: (params) => params.value,
                },
                {
                    field: `${account.optHistId}_tradingWeight`,
                    headerName: "Trade Wt",
                    valueFormatter: (params) => (params.value * 100).toFixed(2) + "%",
                    width: 109,
                    cellClassRules: (params) => params.value,
                },
            ],
        }));

        return [
            {
                headerName: "SecId",
                headerClass: "group-header-parent",
                pinned: "left",
                field: "securityId",
                width: 100,
            },
            {
                headerName: "SecName",
                headerClass: "group-header-parent",
                pinned: "left",
                field: "securityName",
                width: 150,
            },
            ...accountColumns.flat(), // Use flat to flatten the nested array
        ];
    };

    const generateRows = (securityData: rows[], accountData: OptimizationSelection[]): any[] => {
        return securityData.map((security) => {
            const rowData: any = {
                securityId: security.secId,
                securityName: security.secName,
            };
            accountData.forEach((account) => {
                const prefix = `${account.optHistId}_`;
                rowData[`${prefix}preOptimizationWeight`] = security.f_preOptWt;
                rowData[`${prefix}postOptimizationWeight`] = security.f_postOptWt;
                rowData[`${prefix}tradingWeight`] = security.f_tradeWt;
            });
            return rowData;
        });
    };
    // Generate column definitions
    const columnDefs = generateColumnDefs(optmHists);

    // Generate rows
    const rowData = generateRows(rows, optmHists);

    useEffect(() => {
        try {
            let results: any = [];
            const rootUrl = "/account/opt/event/";
            if (optmHists && optmHists.length > 0) {
                if (optmHists[0]) {
                    api.get<OptEventResponse>(rootUrl + optmHists[0]["portId"])
                        .then(async (res) => {
                            try {
                                if (
                                    res &&
                                    res.data.accountOptimizedHoldingList &&
                                    Object.keys(res.data.accountOptimizedHoldingList).length > 0
                                ) {
                                    Object.keys(res.data.accountOptimizedHoldingList).forEach(
                                        (key) => {
                                            const optmHist: SecurityHolding[] =
                                                res.data.accountOptimizedHoldingList[key].map(
                                                    (opt: SecurityHolding) => {
                                                        return opt;
                                                    }
                                                );
                                            console.log(optmHist);
                                            results.push(optmHist);
                                        }
                                    );
                                }
                                if (optmHists[1]) {
                                    return api.get(rootUrl + optmHists[1]["portId"]);
                                } else {
                                    return Promise.resolve();
                                }
                            } catch (error) {
                                console.error(
                                    "Error occurred while processing first response:",
                                    error
                                );
                            }
                        })
                        .then(async (res) => {
                            try {
                                if (
                                    res &&
                                    res.data.accountOptimizedHoldingList &&
                                    Object.keys(res.data.accountOptimizedHoldingList).length > 0
                                ) {
                                    Object.keys(res.data.accountOptimizedHoldingList).forEach(
                                        (key) => {
                                            const optmHist = res.data.accountOptimizedHoldingList[
                                                key
                                            ].map((opt) => {
                                                return {
                                                    accountId: opt.accountId,
                                                    securityId: opt.securityId,
                                                    securityName: opt.securityName,
                                                    preOptimizationWeight:
                                                        opt.preOptimizationWeight,
                                                    postOptimizationWeight:
                                                        opt.postOptimizationWeight,
                                                    tradingWeight: opt.tradingWeight,
                                                };
                                            });
                                            results.push(optmHist);
                                        }
                                    );
                                }
                                if (optmHists[2]) {
                                    return api.get(rootUrl + optmHists[2]["portId"]);
                                } else {
                                    return Promise.resolve();
                                }
                            } catch (error) {
                                console.error(
                                    "Error occurred while processing second response:",
                                    error
                                );
                            }
                        })
                        .then((res) => {
                            try {
                                if (
                                    res &&
                                    res.data.accountOptimizedHoldingList &&
                                    Object.keys(res.data.accountOptimizedHoldingList).length > 0
                                ) {
                                    Object.keys(res.data.accountOptimizedHoldingList).forEach(
                                        (key) => {
                                            const optmHist = res.data.accountOptimizedHoldingList[
                                                key
                                            ].map((opt) => {
                                                return {
                                                    accountId: opt.accountId,
                                                    securityId: opt.securityId,
                                                    securityName: opt.securityName,
                                                    preOptimizationWeight:
                                                        opt.preOptimizationWeight,
                                                    postOptimizationWeight:
                                                        opt.postOptimizationWeight,
                                                    tradingWeight: opt.tradingWeight,
                                                };
                                            });
                                            results.push(optmHist);
                                        }
                                    );
                                }
                                let len = 0; //Number.MAX_SAFE_INTEGER;
                                for (let i = 0; i < results.length; i++) {
                                    if (results[i].length > len) len = results[i].length;
                                }
                                if (len > 0) {
                                    let data: any = [];
                                    if (results && results.length > 0) {
                                        if (results.length < 2) {
                                            for (let j = 0; j < len; j++) {
                                                data.push({
                                                    secId: results[0][j]
                                                        ? results[0][j]["securityId"]
                                                        : null,
                                                    secName: results[0][j]
                                                        ? results[0][j]["securityName"]
                                                        : null,
                                                    f_preOptWt:
                                                        results[0][j]["preOptimizationWeight"],
                                                    f_postOptWt:
                                                        results[0][j]["postOptimizationWeight"],
                                                    f_tradeWt: results[0][j]["tradingWeight"],
                                                });
                                            }
                                        } else if (results.length < 3) {
                                            for (let j = 0; j < len; j++) {
                                                data.push({
                                                    secId: results[0][j]
                                                        ? results[0][j]["securityId"]
                                                        : null,
                                                    secName: results[0][j]
                                                        ? results[0][j]["securityName"]
                                                        : null,
                                                    f_preOptWt: results[0][j]
                                                        ? results[0][j]["preOptimizationWeight"]
                                                        : null,
                                                    f_postOptWt: results[0][j]
                                                        ? results[0][j]["postOptimizationWeight"]
                                                        : null,
                                                    f_tradeWt: results[0][j]
                                                        ? results[0][j]["tradingWeight"]
                                                        : null,
                                                    s_preOptWt: results[1][j]
                                                        ? results[1][j]["preOptimizationWeight"]
                                                        : null,
                                                    s_postOptWt: results[1][j]
                                                        ? results[1][j]["postOptimizationWeight"]
                                                        : null,
                                                    s_tradeWt: results[1][j]
                                                        ? results[1][j]["tradingWeight"]
                                                        : null,
                                                });
                                            }
                                        } else {
                                            for (let j = 0; j < len; j++) {
                                                data.push({
                                                    secId: results[0][j]
                                                        ? results[0][j]["securityId"]
                                                        : null,
                                                    secName: results[0][j]
                                                        ? results[0][j]["securityName"]
                                                        : null,
                                                    f_preOptWt: results[0][j]
                                                        ? results[0][j]["preOptimizationWeight"]
                                                        : null,
                                                    f_postOptWt: results[0][j]
                                                        ? results[0][j]["postOptimizationWeight"]
                                                        : null,
                                                    f_tradeWt: results[0][j]
                                                        ? results[0][j]["tradingWeight"]
                                                        : null,
                                                    s_preOptWt: results[1][j]
                                                        ? results[1][j]["preOptimizationWeight"]
                                                        : null,
                                                    s_postOptWt: results[1][j]
                                                        ? results[1][j]["postOptimizationWeight"]
                                                        : null,
                                                    s_tradeWt: results[1][j]
                                                        ? results[1][j]["tradingWeight"]
                                                        : null,
                                                    t_preOptWt: results[2][j]
                                                        ? results[2][j]["preOptimizationWeight"]
                                                        : null,
                                                    t_postOptWt: results[2][j]
                                                        ? results[2][j]["postOptimizationWeight"]
                                                        : null,
                                                    t_tradeWt: results[2][j]
                                                        ? results[2][j]["tradingWeight"]
                                                        : null,
                                                });
                                            }
                                        }
                                        setRows(data);
                                    }
                                }
                            } catch (error) {
                                console.error(
                                    "Error occurred while processing third response:",
                                    error
                                );
                            }
                        });
                }
            }
        } catch (error) {
            console.error("Error occurred in useEffect:", error);
        }
    }, [optmHists]);

    return (
        <Paper sx={{ width: "100%", height: "90%", overflowY: "auto" }}>
            <Grid width="100%" columnDefs={columnDefs} rowData={rowData} />
        </Paper>
    );
};

export default ComparisonTable;
