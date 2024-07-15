import React, { useState } from "react";
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Pagination,
} from "@carbon/react";

type TableProps = {
    rows: any[];
    headers: { key: string; header: string }[];
    handlePagination: (paginationInfo: { page: number; pageSize: number }) => void;
};

const TableWidget: React.FC<TableProps> = ({ rows, headers, handlePagination }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalItems = rows.length;

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = rows.slice(indexOfFirstItem, indexOfLastItem);

    // Handle pagination change
    const handlePaginationChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
        setCurrentPage(page);
        setItemsPerPage(pageSize);
        handlePagination({ page, pageSize });
    };

    return (
        <div className="custom-table-row-container">
            <DataTable rows={currentItems} headers={headers}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                    <Table {...getTableProps()} size="sm">
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
                                    <TableHeader
                                        {...getHeaderProps({ header, isSortable: false })}
                                        key={header.key}
                                        className="customHeader"
                                    >
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow {...getRowProps({ row })} key={row.id} className="customRow">
                                    {row.cells.map((cell, index) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                color:
                                                    index === 3
                                                        ? "green"
                                                        : index === 4
                                                        ? "green"
                                                        : "inherit",
                                            }}
                                        >
                                            {cell.value}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DataTable>
            <Pagination
                size="lg"
                backwardText="Previous page"
                forwardText="Next page"
                itemsPerPageText="Items per page:"
                onChange={handlePaginationChange}
                page={currentPage}
                pageSize={itemsPerPage}
                pageSizes={[10, 20, 30, 40, 50]}
                totalItems={totalItems}
            />
        </div>
    );
};

export default TableWidget;
