import React, { useEffect, useState } from "react";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import { Slider, TextInput } from "@carbon/react";
import Button from "../../../ui-elements/buttonTP.tsx";
import { Stack } from "@mui/material";
import { useTheme } from "next-themes";
import api from "../../../helpers/serviceTP.ts";
import { toast } from "react-toastify";
import { ISingleFilterValue } from "../../portfolio/misc/DynamicPortfolioFilterComp.tsx";
import { Theme } from "@carbon/react";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";

type DynamicPortfolioFilterProps = {
  closeDialog: () => void;
  setDynamicPortfolioModal: React.Dispatch<React.SetStateAction<boolean>>;
  singleFilterValue: {} | ISingleFilterValue;
  isFilterEditable: boolean;
  activeFilterId: number;
  fetchDynamicPortfolioApi: () => Promise<void>;
};

interface IFilterPayload {
  name: string;
  cashLevelLower: number;
  expectedAlphaLower: number;
  expectedTeLower: number;
  expectedVolLower: number;
  cashLevelUpper: number;
  expectedAlphaUpper: number;
  expectedTeUpper: number;
  expectedVolUpper: number;
}

interface IInitialFilters {
  name: string;
  lowerValue: number;
  upperValue: number;
}
const DynamicPortfolioFilter: React.FC<DynamicPortfolioFilterProps> = ({
  closeDialog,
  setDynamicPortfolioModal,
  singleFilterValue,
  isFilterEditable,
  activeFilterId,
  fetchDynamicPortfolioApi,
}) => {
  const theme = useTheme();
  const initialFilters: IInitialFilters[] = [
    { name: "Cash Level (%)", lowerValue: 0, upperValue: 100 },
    { name: "Expected Alpha Filter (%)", lowerValue: 0, upperValue: 100 },
    { name: "Expected TE Filter (%)", lowerValue: 0, upperValue: 100 },
    { name: "Expected Vol Filter (%)", lowerValue: 0, upperValue: 100 },
  ];
  const [filters, setFilters] = useState(initialFilters);
  const [inputFilterValue, setInputFilterValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputFilterValue(event.target.value);
  };

  const handleChange = (
    data: { value: number; valueUpper?: number },
    index: number
  ) => {
    const updatedFilters = filters.map((filter, i) =>
      i === index
        ? {
            ...filter,
            lowerValue: data.value,
            upperValue: data.valueUpper ?? filter.upperValue,
          }
        : filter
    );
    setFilters(updatedFilters);
  };

  const apiCallToUpdateFilter = async (payload: IFilterPayload) => {
    try {
      const response = await api.put(
        `${process.env.REACT_APP_HOST_IP_ADDRESS}/dynamic-filter/${activeFilterId}`,
        payload
      );
      const result = await response;
      console.log("UpdateFilterResponse", result);
      toast("Successfully Filter Updated");
      setDynamicPortfolioModal(false);
      fetchDynamicPortfolioApi();
    } catch (err) {
      console.log("Update Dynamic Filter API Error", err.message);
      toast("Error while creating updating filter");
    }
  };
  const apiCallToSaveFilter = async (payload: IFilterPayload) => {
    try {
      const response = await api.post(
        `${process.env.REACT_APP_HOST_IP_ADDRESS}/dynamic-filter`,
        payload
      );
      const result = await response;
      console.log("SaveFilterResponse", result);
      toast("Successfully New Filter Created");
      fetchDynamicPortfolioApi();
      setDynamicPortfolioModal(false);
    } catch (err) {
      console.log("Save Dynamic Filter API Error", err.message);
      toast("Error while creating new filter");
    }
  };

  const onFilterSaveHandler = () => {
    const filterPayload = {
      name: inputFilterValue,
      cashLevelLower: filters.filter(
        (item) => item.name === "Cash Level (%)"
      )[0].lowerValue,
      expectedAlphaLower: filters.filter(
        (item) => item.name === "Expected Alpha Filter (%)"
      )[0].lowerValue,
      expectedTeLower: filters.filter(
        (item) => item.name === "Expected TE Filter (%)"
      )[0].lowerValue,
      expectedVolLower: filters.filter(
        (item) => item.name === "Expected Vol Filter (%)"
      )[0].lowerValue,
      cashLevelUpper: filters.filter(
        (item) => item.name === "Cash Level (%)"
      )[0].upperValue,
      expectedAlphaUpper: filters.filter(
        (item) => item.name === "Expected Alpha Filter (%)"
      )[0].upperValue,
      expectedTeUpper: filters.filter(
        (item) => item.name === "Expected TE Filter (%)"
      )[0].upperValue,
      expectedVolUpper: filters.filter(
        (item) => item.name === "Expected Vol Filter (%)"
      )[0].upperValue,
    };

    console.log("filterPayload", filterPayload, isFilterEditable);
    isFilterEditable
      ? apiCallToUpdateFilter(filterPayload)
      : apiCallToSaveFilter(filterPayload);
  };

  useEffect(() => {
    const initialFilters: IInitialFilters[] = [
      {
        name: "Cash Level (%)",
        lowerValue: isFilterEditable ? singleFilterValue.cashLevelLower : 0,
        upperValue: isFilterEditable ? singleFilterValue.cashLevelUpper : 100,
      },
      {
        name: "Expected Alpha Filter (%)",
        lowerValue: isFilterEditable ? singleFilterValue.expectedAlphaLower : 0,
        upperValue: isFilterEditable
          ? singleFilterValue.expectedAlphaUpper
          : 100,
      },
      {
        name: "Expected TE Filter (%)",
        lowerValue: isFilterEditable ? singleFilterValue.expectedTeLower : 0,
        upperValue: isFilterEditable ? singleFilterValue.expectedTeUpper : 100,
      },
      {
        name: "Expected Vol Filter (%)",
        lowerValue: isFilterEditable ? singleFilterValue.expectedVolLower : 0,
        upperValue: isFilterEditable ? singleFilterValue.expectedVolUpper : 100,
      },
    ];
    setFilters(initialFilters);
    setInputFilterValue(isFilterEditable ? singleFilterValue.name : "");
  }, [isFilterEditable]);

  const FilterButtonGroup = (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="end"
      style={{ width: "97.5%", marginTop: "3vh" }}
    >
      <Button
        className={"pop-btn"}
        label={isFilterEditable ? "Update" : "Save"}
        onClick={() => onFilterSaveHandler()}
        style={{
          height: "3rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        disable={inputFilterValue?.trim().length ? false : true}
      />
    </Stack>
  );

  console.log("filters-->", filters, inputFilterValue);
  console.log("isFilterEditable-->", isFilterEditable, singleFilterValue);
  return (
    <ModalType
      open
      closeDialog={() => {
        closeDialog();
      }}
      type={ModalTypeEnum.SMALL}
      buttons={FilterButtonGroup}
    >
    <div style={{paddingTop:"1.5rem"}}>
    <h2>Add New Filter</h2>
    </div>
      <br />
      <br />

      <section
        style={{
          display: "flex",
          width: "97.5%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "80%" }}>
          <Theme theme={theme.theme == "light" ? "white" : "g100"}>
            <TextInput
              labelText
              id="filter-name"
              hideLabel={true}
              placeholder="Enter filter name"
              value={inputFilterValue}
              onChange={handleInputChange}
            />
          </Theme>
        </div>

        <Button
          style={{ width: "3rem", minWidth: "3rem" }}
          label="+"
          onClick={() => {
            console.log("click me");
          }}
        />
      </section>

      <br />
      <br />
      <br />
      <div
        style={{
          width: "97.5%",
          backgroundColor: theme.theme == "light" ? "white" : "#0d0d0d",
          borderRadius: ".5rem",
          // padding: "1rem",
        }}
      >
        {filters.map((filter, index) => {
          return (
            <div
              style={{
                padding: ".75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                border:
                  theme.theme == "light"
                    ? "1px solid #e0e0e0"
                    : "1px solid #d5d5db26",
              }}
            >
              <p
                style={{
                  width: "15rem",
                  color: theme.theme == "light" ? "black" : "#f4f4f4",
                  fontWeight: "500",
                }}
              >
                {filter.name}
              </p>
              <section style={{ display: "flex", gap: "5rem" }}>
                <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                  <Slider
                    onRelease={(e) => {}}
                    className="sliderHelper slideHelper"
                    unstable_valueUpper={100}
                    min={0}
                    max={100}
                    step={1}
                    // hideTextInput
                    value={filter.lowerValue}
                    unstable_valueUpper={filter.upperValue}
                    onChange={(data) => handleChange(data, index)}
                  />
                </Theme>
                <ImageComponent
                  src="trash-can.svg"
                  alt="expandAll-icon"
                  style={{ width: "1.5rem" }}
                />
              </section>
            </div>
          );
        })}
      </div>
    </ModalType>
  );
};

export default DynamicPortfolioFilter;
