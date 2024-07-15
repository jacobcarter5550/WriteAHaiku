import React, { useEffect, useRef, useState } from "react";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import Label from "../../../ui-elements/label.tsx";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "carbon-components-react";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const MyTable = ({ data }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {Object.keys(data[0]).map((key) => (
            <TableHeader key={key}>{key}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {Object.values(row).map((value, idx) => (
              <TableCell key={idx}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modal: {
    display: "flex",
    alignItems: "center",
    padding: "40px",
    justifyContent: "center",
    height: "80%",
    backgroundColor: "#F4F4F4",
  },
};

const AdvisorClientDashboard: React.FC<Props> = ({ open, handleClose }) => {
  const jsonData = [
    { id: 1, name: "John", age: 30 },
    { id: 2, name: "Jane", age: 25 },
    { id: 3, name: "Doe", age: 40 },
  ];

  return (
    <ModalType
      type={ModalTypeEnum.MEDIUM}
      open={open}
      style={styles.modal}
      closeDialog={handleClose}
      buttons={[]}
    >
      <section className="activity-dashboard-section">
        <h2>Advisor Client Dashboard</h2>
        <div className="activity-dashboard advisor-client white-bg">
          <div className="portfolio-activity">
            <Label className="main-label">Advisor Portfolio Dashboard::</Label>
            <div className="list">
              <span>Actionable Item: 15</span>
            </div>
            <div className="list">
              <span>Actionable Item taken: 15</span>
            </div>
          </div>
          <div className="portfolio-activity-dropdowns">
            <CustomSelect customWidth="25rem" placeholder="Items In Total" />
            <CustomSelect
              customWidth="25rem"
              placeholder="Items Acknowledged"
            />
            <CustomSelect customWidth="25rem" placeholder="Items Completed" />
            <CustomSelect customWidth="25rem" placeholder="Items Outstanding" />
          </div>
        </div>
        <div className="table-wrapper">
          <div className="portfolio-activity">
            <Label className="main-label">Advisor Portfolio Dashboard::</Label>
            <div className="list">
              <span>Total Partners: 15</span>
            </div>
            <div className="list">
              <span>Active Partner: 15</span>
            </div>
          </div>
          <MyTable data={jsonData} />;
        </div>
      </section>
    </ModalType>
  );
};

export default AdvisorClientDashboard;
