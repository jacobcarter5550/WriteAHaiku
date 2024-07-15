import { Button, Select, TextInput } from "@carbon/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useRef } from "react";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import { useTheme } from "next-themes";

type Props = {};

const AccountSetupSecond = (props: Props) => {
  const formikRef = useRef();

  const handleExternalSubmit = () => {
    if (formikRef.current) {
      formikRef?.current?.handleSubmit();
    }
  };

  const theme = useTheme();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minWidth: "5vw",
      maxWidth: "12.5vw",
      width: "11.5vw",
      borderRadius: "0",
      fontSize: "1.2rem",
      minHeight: "2.75rem",
      height: "2.75rem",

      borderWidth: "0px",
      cursor: "pointer",
      backgroundColor: theme.theme == "light" ? "#F4F4F4" : "#0D0D0D",
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
      height: "2.75rem",
      padding: "0 6px",
      display: "flex",
      flexWrap: "nowrap",
    }),
    multiValue: (provided) => ({
      ...provided,
    }),
    groupHeading: (provided) => ({
      ...provided,
      fontSize: "1.6rem",
      colot: "#002D9C",
      fontWeight: "bold",
    }),
    menu: (provided, state) => ({
      ...provided,
      borderRadius: 0,
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
        backgroundColor:
          theme.theme == "dark"
            ? state.isFocused
              ? "#393939"
              : "#181818"
            : state.isFocused
            ? "#e9eaea"
            : "#f4f4f4",
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
      maxHeight: "60vh",
      overflowY: "auto" as any,
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "2.75rem",
    }),
    placeholder: (base) => ({
      color: "#525252",
    }),
  };

  const modifiedCustomStyles = {
    ...customStyles,
    control: (provided, state) => ({
      ...provided,
      minWidth: "5vw",
      maxWidth: "25vw",
      width: "23.5vw",
      borderRadius: "0",
      fontSize: "1.2rem",
      minHeight: "2.75rem",
      height: "3.2rem",

      borderWidth: "0px",
      cursor: "pointer",
      backgroundColor: theme.theme == "light" ? "#F4F4F4" : "#0D0D0D",
    }),
  };

  return (
    <div className="step-second-main-container">
      <h1>Import Account (Step 2)</h1>
      <div className="main-container">
        <div className="left-section child-container">
          <div className="named-account">Lily Janice</div>
          <div className="unnamed-account">Account 2 to be named</div>

          <div className="unnamed-account">Account 3 to be named</div>

          <div className="unnamed-account">Account 4 to be named</div>

          <div className="unnamed-account">Account 5 to be named</div>

          <div className="unnamed-account">Account 6 to be named</div>

          <div className="unnamed-account">Account 7 to be named</div>

          <div className="unnamed-account">Account 8 to be named</div>

          <div className="unnamed-account">Account 9 to be named</div>

          <div className="unnamed-account">Account 10 to be named</div>

          <div className="unnamed-account">Account 11 to be named</div>

          <div className="unnamed-account">Account 12 to be named</div>
          <div className="unnamed-account">Account 13 to be named</div>
          <div className="unnamed-account">Account 14 to be named</div>
          <div className="unnamed-account">Account 15 to be named</div>
          <div className="unnamed-account">Account 16 to be named</div>
          <div className="unnamed-account">Account 17 to be named</div>
        </div>
        <section className="right-section child-container">
          <div className="account-form-container">
            <Formik
              innerRef={formikRef}
              initialValues={{
                accountName: "",
                investmentTeam: "",
                portfolioManager: "",
                investibleUniverse: "",
                benchmark: "",
                setupRegionCountry: "",
                strategySetup: "",
                initialInvestment: "",
                cashLevel: "",
                comments: "",
              }}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log("Form data", values);
              }}
            >
              <Form>
                <div className="form-group">
                  <Field name="accountName">
                    {({ field, meta }: any) => (
                      <TextInput
                        labelText="Account Name"
                        {...field}
                        invalid={meta.touched && !!meta.error}
                        // invalidText={meta.error}
                        helperText=""
                        id="accountName"
                        name="accountName"
                        placeholder="Account Name"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group-parent">
                  <div className="form-group">
                    <label>Investment Team</label>
                    <Field name="investmentTeam">
                      {({ field, meta }: any) => (
                        // <Select
                        //   labelText="Investment Team"
                        //   {...field}
                        //   invalid={meta.touched && !!meta.error}
                        //   // invalidText={meta.error}
                        //   id="investmentTeam"
                        //   name="investmentTeam"
                        //   placeholder="tes"
                        // />
                        <CustomSelect
                          options={[]}
                          // customWidth={"415px"}
                          value={""}
                          onChange={(selectedOption) =>
                            console.log(selectedOption)
                          }
                          placeholder="Choose"
                          styles={customStyles}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="investmentTeam"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div className="form-group">
                    <label>Portfolio Manager</label>

                    <Field name="portfolioManager">
                      {({ field, meta }: any) => (
                        // <Select
                        //   labelText="Portfolio Manager"
                        //   {...field}
                        //   invalid={meta.touched && !!meta.error}
                        //   // invalidText={meta.error}
                        //   helperText=""
                        //   id="portfolioManager"
                        //   name="portfolioManager"
                        //   placeholder="Portfolio Manager"
                        // />

                        <CustomSelect
                          options={[]}
                          // customWidth={"415px"}
                          value={""}
                          onChange={(selectedOption) =>
                            console.log(selectedOption)
                          }
                          placeholder="Choose"
                          styles={customStyles}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="portfolioManager"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                <div className="form-group-parent">
                  <div className="form-group">
                    <label>Investible Universe</label>

                    <Field name="investibleUniverse">
                      {({ field, meta }: any) => (
                        // <Select
                        //   labelText="Investible Universe"
                        //   {...field}
                        //   invalid={meta.touched && !!meta.error}
                        //   // invalidText={meta.error}
                        //   helperText=""
                        //   id="investibleUniverse"
                        //   name="investibleUniverse"
                        //   placeholder="Investible Universe"
                        // />

                        <CustomSelect
                          options={[]}
                          // customWidth={"415px"}
                          value={""}
                          onChange={(selectedOption) =>
                            console.log(selectedOption)
                          }
                          placeholder="Choose"
                          styles={customStyles}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="investibleUniverse"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div className="form-group">
                    <label>Benchmark</label>

                    <Field name="benchmark">
                      {({ field, meta }: any) => (
                        // <Select
                        //   labelText="Benchmark"
                        //   {...field}
                        //   invalid={meta.touched && !!meta.error}
                        //   // invalidText={meta.error}
                        //   helperText=""
                        //   id="benchmark"
                        //   name="benchmark"
                        //   placeholder="Benchmark"
                        // />
                        <CustomSelect
                          options={[]}
                          // customWidth={"415px"}
                          value={""}
                          onChange={(selectedOption) =>
                            console.log(selectedOption)
                          }
                          placeholder="Choose"
                          styles={customStyles}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="benchmark"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Setup Region/Country</label>

                  <Field name="setupRegionCountry">
                    {({ field, meta }: any) => (
                      //   <Select
                      //     labelText="Setup Region/Country"
                      //     {...field}
                      //     invalid={meta.touched && !!meta.error}
                      //     // invalidText={meta.error}
                      //     helperText=""
                      //     id="setupRegionCountry"
                      //     name="setupRegionCountry"
                      //     placeholder="Setup Region/Country"
                      //   />

                      <CustomSelect
                        options={[]}
                        // customWidth={"415px"}
                        value={""}
                        onChange={(selectedOption) =>
                          console.log(selectedOption)
                        }
                        placeholder="Choose"
                        styles={modifiedCustomStyles}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="setupRegionCountry"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <Field name="strategySetup">
                    {({ field, meta }: any) => (
                      <TextInput
                        labelText="Strategy Setup"
                        {...field}
                        invalid={meta.touched && !!meta.error}
                        // invalidText={meta.error}
                        helperText=""
                        id="strategySetup"
                        name="strategySetup"
                        placeholder="Strategy Setup"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="strategySetup"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <Field name="initialInvestment">
                    {({ field, meta }: any) => (
                      <TextInput
                        labelText="Initial Investment"
                        {...field}
                        invalid={meta.touched && !!meta.error}
                        // invalidText={meta.error}
                        helperText=""
                        id="initialInvestment"
                        name="initialInvestment"
                        placeholder="US$"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="initialInvestment"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <Field name="cashLevel">
                    {({ field, meta }: any) => (
                      <TextInput
                        labelText="Cash Level"
                        {...field}
                        invalid={meta.touched && !!meta.error}
                        // invalidText={meta.error}
                        helperText=""
                        id="cashLevel"
                        name="cashLevel"
                        placeholder="2%"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="cashLevel"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <Field name="comments">
                    {({ field, meta }: any) => (
                      <TextInput
                        labelText="Comments"
                        {...field}
                        invalid={meta.touched && !!meta.error}
                        // invalidText={meta.error}
                        helperText=""
                        id="comments"
                        name="comments"
                        placeholder="Enter Text"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="comments"
                    component="div"
                    className="error"
                  />
                </div>
              </Form>
            </Formik>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountSetupSecond;
