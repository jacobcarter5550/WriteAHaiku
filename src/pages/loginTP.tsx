import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, TextInput } from "@carbon/react";
import { useTheme } from "next-themes";

export type AuthToken = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (
    values: { email: string; password: string },
    { setSubmitting }: any
  ) => {
    const { email, password } = values;
    // add url from env
    fetch(
      `${process.env.REACT_APP_KEYCLOAK}//realms/linvest21realm/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "linvest21client",
          username: email,
          password: password,
          grant_type: "password",
        }),
      }
    )
      .then((response) => response.json())
      .then((data: AuthToken) => {
        console.log(data);
        if (!Object.keys(data).includes("error")) {
          const accessToken = data.access_token;
          console.log(data);
          localStorage.setItem("token", accessToken);
          toast.success("Login successful");
          navigate("dashboard");
        } else {
          toast.error("Login failed");
        }
        console.log(data);
      })
      .catch((error) => {
        // Handle errors
        console.log(error);
      });
  };

  const handleSignUp = () => {
    navigate("register");
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="leftBlock"></div>
      </div>
      <div className="right-section">
        <img
          src={ theme.theme == "light" ?  "/ACPLogo.svg" : "/dark-ACPLogo.png"}
          style={{ width: "35rem" }}
          alt="Finance Image"
        />
        <h1 style={{ marginTop: "1.5em" }}>Powered by Linvest21.Ai</h1>
        <p>Welcome back! Please login to your account.</p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <Field name="email">
                {({ field, meta }: any) => (
                  <TextInput
                    labelText="Email:"
                    {...field}
                    invalid={meta.touched && !!meta.error}
                    invalidText={meta.error}
                    helperText=""
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                )}
              </Field>
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-group">
              <Field name="password">
                {({ field, meta }: any) => (
                  //@ts-ignore
                  <TextInput.PasswordInput
                    placeholder="Password"
                    labelText="Password:"
                    {...field}
                    invalid={meta.touched && !!meta.error}
                    // invalidText={meta.error}
                    helperText=""
                    id="password"
                    name="password"
                    // slug={ <View onClick={() => setShowPassword((prev) => !prev)} />}
                  />
                )}
              </Field>
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <span className="forgot-password">
              <a href="/forgot">Forgot Password ?</a>
            </span>
            <div className="form-group flex-block submit-button-container">
              <Button
                type="submit"
                className="btn btn-primary"
                disabled={false /* add your condition */}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "unset",
                }}
              >
                Login
              </Button>
              <Button
                kind="tertiary"
                className="btn btn-secondary"
                onClick={handleSignUp}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "unset",
                }}
              >
                Sign Up
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
