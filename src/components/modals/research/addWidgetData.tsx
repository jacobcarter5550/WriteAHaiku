import React, { useEffect, useState } from "react";
import ModalType, { ModalTypeEnum } from "../../../ui-elements/modals/ModalType.tsx";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TextInput
} from "@carbon/react";
import api from "../../../helpers/serviceTP.ts";
import Heading from "../../../ui-elements/headingTP.tsx";

interface Props {
  flag: boolean;
  updateFlag: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    display: "flex",
    alignItems: "center",
    padding: "40px",
    zIndex: 1000,
    height: "80%",
    backgroundColor: "#F4F4F4",
  },
  centered: {
    textAlign: 'center'
  },
  categoryImage : {
    maxWidth: "2rem",
  },
  heading: {
    paddingBottom: "30px",
  },
};

const initialRows = [];

const headers = [
  { key: "category", header: "Category" },
  { key: "name", header: "Name" },
  { key: "modified", header: "Date Modified" },
];

function convertJsonToInitialRows(jsonData) {
  return jsonData.map(item => ({
    id: item.id,
    name: item.title,
    modified: new Date(item.createdAt).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }),
    category: item.type
  }));
}

const WidgetData: React.FC<Props> = ({ flag, updateFlag }) => {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get('http://equity-be-dev.linvest21.com/widgetLibrary').then((res) => {
      setRows(convertJsonToInitialRows(res));
    });
  }, []);

  const filteredRows = rows.filter(row => 
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModalType
      type={ModalTypeEnum.SMALL}
      open={flag}
      style={styles.modal}
      closeDialog={updateFlag}
      buttons={[]}
    >
      <div className="update-widget-table" style={{ width: "100%" }}>
        <Heading style={{ paddingBottom: '1rem' }} variant="h2" text="Select from library" />
        <DataTable rows={filteredRows} headers={headers}>
          {({ rows, headers, getHeaderProps, getRowProps }) => (
            <TableContainer style={{ textAlign: "center" }}>
              <div className="search-block">
                <TextInput
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        {...getHeaderProps({ header })}
                        key={header.key}
                        style={header.key === "category" ? styles.centered : undefined}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          // handle click event here
                        }}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell
                          style={cell.info.header === "category" ? styles.centered : undefined}
                          key={cell.id}
                        >
                          {cell.info.header === "modified" ? (
                            <>
                              {cell.value}
                              <span className="control-icon">
                                <img src={"/view.svg"} alt="View" />
                              </span>
                              <span className="control-icon">
                                <img src={"/trashCan.svg"} alt="Delete" />
                              </span>
                            </>
                          ) : cell.info.header === "category" ? (
                            <img
                              src={`/${cell.value}`}
                              alt="category"
                              style={styles.categoryImage}
                            />
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>
    </ModalType>
  );
};

export default WidgetData;
