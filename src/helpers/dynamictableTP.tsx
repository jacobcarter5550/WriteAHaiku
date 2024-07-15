import React from "react";

type DynamicTableProps = {
  columns: string[];
  rows: Array<{ group: string; date: string; value: string }>;
};

const DynamicTable: React.FC<DynamicTableProps> = ({ columns, rows }) => {
  return (
    <table
      className="table-overview"
      cellPadding={0}
      cellSpacing={0}
      style={{ maxHeight: "400px" }}
    >
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className="title" style={{ textTransform: "capitalize" }}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows && rows.length > 0 && rows.map((item, index) => (
          <tr key={index}>
            <td>{item.group}</td>
            <td>{item.date}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;