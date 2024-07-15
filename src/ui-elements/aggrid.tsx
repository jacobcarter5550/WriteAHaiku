import React, { useCallback, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../styles/gridStyles.scss";
import { useTheme } from "next-themes";

interface GridProps {
  rowData: any[];
  columnDefs: ColDef[];
  width?: string;
}

const Grid: React.FC<GridProps> = ({ rowData, columnDefs, width }) => {
  const theme = useTheme();
  const getRowHeight = useCallback((params) => {
    return 26;
  }, []);

  return (
    <div
      style={{
        width: width ? width : "100%",
        display: "flex",
        flexDirection: "column",
        border: theme.theme == "light" ? "" : "0.5px solid #5c5c5c",
      }}
      className={
        theme.theme == "light"
          ? `ag-theme-balham ad-grid-container`
          : `ag-theme-balham-dark ad-grid-container`
      }
    >
      <div style={{ flex: 1 }} className="ag-theme-alpine">
        <AgGridReact
          headerHeight={25}
          columnDefs={columnDefs}
          rowData={rowData}
          getRowHeight={getRowHeight}
        />
      </div>
    </div>
  );
};

export default Grid;
