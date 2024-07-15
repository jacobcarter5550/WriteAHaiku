import React, { useState, useEffect } from "react";
import Label from "../../ui-elements/label.tsx";
import CustomSelect from "../../ui-elements/selectTP.tsx";
import ReactStars from "react-rating-stars-component";
import { ProgressBar } from "@carbon/react";
import api, { getLocalAccessToken } from "../../helpers/serviceTP.ts";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";
import axios from "axios";
import { SelectOption } from "../nav/Nav.tsx";
import { GroupBase, StylesConfig } from "react-select";
import Button from "../../ui-elements/buttonTP.tsx";

interface Task {
  messageId: number;
  clientName: string;
  accountName: string;
}

interface Ranking {
  pmId: number;
  name: string;
  averageScore: number;
  rankingScore: number;
  advisorId: number;
  rankingDate: string;
  rankingId: number;
}

const ProjectionActivityDashboard: React.FC = () => {
  const theme = useTheme();
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [pmId, setPMID] = useState<number | null>(null);
  const [totalItem, setTotalItem] = useState<SelectOption[]>([]);
  const [itemAcknowledged, setItemAcknowledged] = useState<SelectOption[]>([]);
  const [itemCompleted, setItemCompleted] = useState<SelectOption[]>([]);
  const [itemOutstanding, setItemOutstanding] = useState<SelectOption[]>([]);

  const customStylesPortfolio = {
    control: (provided, state) => ({
      ...provided,
      minWidth: "5vw",
      maxWidth: "17vw",
      width: "17vw", // Set your desired width here
      borderRadius: "0",
      fontSize: "1.2rem",
      minHeight: "2.2rem",
      border:
        theme.theme == "light" ? "1px solid #8d8d8d" : "1px solid #383a3e",
      borderWidth: "0px",
      cursor: "pointer",
      backgroundColor: theme.theme == "light" ? "#fff" : "#0D0D0D",
      position: "unset",
    }),
    container: (provided, state) => ({
      ...provided,
      position: "unset",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      overflow: "visible",
      color: theme.theme == "dark" ? "#fff" : "#181818",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "2.2rem",
      padding: "0 6px",
      display: "flex",
      flexWrap: "nowrap", // Enable flex-wrap for all selected options
    }),
    multiValue: (provided) => ({
      ...provided,
    }),
    groupHeading: (provided) => ({
      ...provided,
      fontSize: "1.6rem", // Set the desired font size for group heading
      colot: "#002D9C",
      fontWeight: "bold", // You can customize other styles as well
    }),
    menu: (provided, state) => ({
      ...provided,
      borderRadius: 0, // Set border radius to 0 for the menu block
      marginTop: "0",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    option: (provided, state) => {
      return {
        ...provided,
        fontSize: "1.2rem",
        borderRadius: "0px",
        paddingLeft: "2rem",
        marginTop: "0px",
        color:
          theme.theme == "dark"
            ? state.isFocused
              ? "#f4f4f4"
              : "#fff"
            : state.isFocused
            ? "#181818"
            : "#181818",
        cursor: "pointer",
        // backgroundColor:"black",
        backgroundColor:
          theme.theme == "dark"
            ? state.isFocused
              ? "#393939"
              : "#181818"
            : state.isFocused
            ? "#e9eaea"
            : "#f4f4f4", // Change the hover color here
      };
    },
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      flexWrap: "nowrap",
      fontSize: "11px",
      borderRadius: "0px",
    }),
    menuList: (base, state) => ({
      backgroundColor: theme.theme == "light" ? "#fff" : "#181818",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "2.2rem",
    }),
  };

  const [currentValue, setCurrentValue] = useState<SelectOption | null>(null);
  console.log(currentValue, "currentValue");

  const ratingChanged =
    (pmId: number, rankingId: number, name: string, avg: number) =>
    (newValue: number) => {
      let reqObj = {
        rankingId: rankingId,
        advisorId: 11,
        pmId: pmId,
        rankingScore: newValue,
      };
      api
        .put(
          `${process.env.REACT_APP_TAX_ADVISOR}/api/rankings/advisor-pm`,
          reqObj
        )
        .then((res) => {
          if (res.message) {
            toast.success("Rating updated successfully");
            fetchData();
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let object = {
        value: JSON.stringify(pmId),
        label: (
          <div style={{ pointerEvents: "none" }} className="rating-wrapper">
            <span className="rating-wrapper-item1">{name}</span>
            <span className="rating-wrapper-item2">{avg}</span>
            <ReactStars
              count={5}
              key={pmId} // Ensure each instance has a unique key
              value={newValue}
              size={15}
              activeColor="#ffd700"
            />
          </div>
        ),
      };
      setCurrentValue(object);
    };

  const fetchData = async () => {
    try {
      const res = await axios.get<Ranking[]>(
        `${process.env.REACT_APP_TAX_ADVISOR}/api/rankings/advisor-pm/by-advisor/11/`,
        {
          headers: {
            Authorization: `Bearer ${getLocalAccessToken()}`,
          },
        }
      );
      const data = res.data.map<{ value: string; label: JSX.Element }>(
        (item) => ({
          value: JSON.stringify(item.pmId),
          label: (
            <div className="rating-wrapper">
              <span className="rating-wrapper-item1" title={item.name}>
                {item.name}
              </span>
              <span className="rating-wrapper-item2">{item.averageScore}</span>
              <ReactStars
                count={5}
                value={item.rankingScore}
                onChange={ratingChanged(
                  item.pmId,
                  item.rankingId,
                  item.name,
                  item.averageScore
                )}
                size={17}
                activeColor="#ffd700"
              />
            </div>
          ),
        })
      );
      console.log(data);
      setOptions(data);
    } catch (error) {
      // Handle error here
      console.error("Error fetching data:", error);
      // You can set state here to indicate an error if needed
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (selectedOption: SelectOption) => {
    setPMID(Number(selectedOption.value));
  };

  function convertToSelect(
    inputArray: Task[],
    overflow?: boolean
  ): SelectOption[] {
    //@ts-ignore
    return inputArray.map((item) => ({
      value: <p>{JSON.stringify(item.messageId)}</p>,
      label: overflow ? (
        <p
          style={{
            width: "14rem",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          title={`${item.clientName} - ${item.accountName}`}
        >{`${item.clientName} - ${item.accountName}`}</p>
      ) : (
        `${item.clientName} - ${item.accountName}`
      ),
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<{
          totalTasks: Task[];
          acknowledgedTasks: Task[];
          completedTasks: Task[];
          outstandingTasks: Task[];
        }>(
          `${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advisor/getAdvisorTasks`
        );
        console.log(res);
        const {
          totalTasks,
          acknowledgedTasks,
          completedTasks,
          outstandingTasks,
        } = res.data;
        const totalTask = convertToSelect(totalTasks, true);
        const acknowledged = convertToSelect(acknowledgedTasks, true);
        const completed = convertToSelect(completedTasks, true);
        const outstanding = convertToSelect(outstandingTasks, true);

        setTotalItem(totalTask);
        setItemAcknowledged(acknowledged);
        setItemCompleted(completed);
        setItemOutstanding(outstanding);
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
        // You can set state here to indicate an error if needed
      }
    };

    fetchData();
  }, []);

  console.log(currentValue, "sss");

  return (
    <>
      <div className="projection-activity-dashboard white-bg">
        <div className="projection-container-pad">
          <div className="heading-pad">Utility: </div>
          <Button
            onClick={() => console.log("clicked")}
            label={"Data Conversion"}
            style={{ width: "17vw", height: "2.2rem", minHeight: "2.2rem" }}
          />
          <Button
            onClick={() => console.log("clicked")}
            label={"Data Verification"}
            style={{ width: "17vw", height: "2.2rem", minHeight: "2.2rem" }}
          />
        </div>
        <div className="projection-container-pad">
          <div className="heading-pad">Status: </div>
          <CustomSelect
            customWidth="17vw"
            placeholder="Untouched Client List"
            options={totalItem}
            styles={customStylesPortfolio}
          />
          <CustomSelect
            customWidth="17vw"
            placeholder="WIP List"
            options={itemAcknowledged}
            styles={customStylesPortfolio}
          />
          <CustomSelect
            customWidth="17vw"
            placeholder="Completed List"
            options={itemCompleted}
            styles={customStylesPortfolio}
          />
        </div>
        <div className="projection-container-pad">
          <div className="heading-pad">Alerts: </div>
          <CustomSelect
            customWidth="17vw"
            placeholder="24x7x365"
            options={totalItem}
            styles={customStylesPortfolio}
          />
          <CustomSelect
            customWidth="17vw"
            placeholder="what-to-alert v1"
            options={itemAcknowledged}
            styles={customStylesPortfolio}
          />
          <CustomSelect
            customWidth="17vw"
            placeholder="Mail & Text"
            options={itemCompleted}
            styles={customStylesPortfolio}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectionActivityDashboard;
