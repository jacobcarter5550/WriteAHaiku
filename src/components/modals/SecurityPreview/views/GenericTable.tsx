import React from "react";

const GenericTable: React.FC<{ tableData }> = ({ tableData }) => {
  const renderTable = (tableData) => {
    const columnTitles = tableData.rows[0]
      ? Object.keys(tableData.rows[0])
      : [];
    return (
      <table className="table-overview table" cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            {columnTitles.map((title, index) => (
              <th key={index}>
                <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr className="tr" key={rowIndex}>
              {Object.values(row).map((cell: any, cellIndex) => (
                <td className="td" key={cellIndex}>
                  <span>{cell}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return renderTable(tableData);
};

export default GenericTable;
