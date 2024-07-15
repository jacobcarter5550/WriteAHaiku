import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../helpers/serviceTP.ts";

import { Button, TextInput } from "@carbon/react";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    // Form validation schema using Yup
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        email: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
        password1: Yup.string().required("Required"),
    });


    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const { firstName, lastName, email, password, password1 } = values;
        if (password !== password1) {
            toast.error("Password should be the same");
            return;
        }
        let obj = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        };
        api.post(`${process.env.REACT_APP_HOST_IP_ADDRESS}public/user/register`, obj)
            .then((res) => {
                toast.success("User Registered Successfully");
                // navigate('login');
            })
            .catch((error) => {
                // Handle errors
                console.log(error);
            });
    };

    const handleLogin = () => {
        navigate("/");
    };

    return (
        <div className="login-container">
            <div className="left-section">
                <div className="left-block"></div>
            </div>
            <div className="right-section">
                <img src={"/logo.png"} alt="Finance Image" />
                <h1 style={{ marginTop: "1.5em" }}>Powered by Linvest21.Ai</h1>
                <p>Dive into the world of financial Technology</p>
                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        username: "",
                        email: "",
                        password: "",
                        password1: "",
                    }}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <Field name="firstName">
                                {({ field, meta }: any) => (
                                    <TextInput
                                        labelText="First Name:"
                                        {...field}
                                        invalid={meta.touched && !!meta.error}
                                        // invalidText={meta.error}
                                        helperText=""
                                        id="firstName"
                                        name="firstName"
                                        placeholder="First Name"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="firstName" component="div" className="error" />
                        </div>

                        <div className="form-group">
                            <Field name="lastName">
                                {({ field, meta }: any) => (
                                    <TextInput
                                        labelText="Last Name:"
                                        {...field}
                                        invalid={meta.touched && !!meta.error}
                                        // invalidText={meta.error}
                                        helperText=""
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Last Name"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="lastName" component="div" className="error" />
                        </div>

                        <div className="form-group">
                            <Field name="email">
                                {({ field, meta }: any) => (
                                    <TextInput
                                        labelText="Your Email Address:"
                                        {...field}
                                        invalid={meta.touched && !!meta.error}
                                        // invalidText={meta.error}
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

                        <div className="form-group">
                            <Field name="password1">
                                {({ field, meta }: any) => (
                                    <TextInput.PasswordInput
                                        placeholder="Confirm Password"
                                        labelText="Confirm Password:"
                                        {...field}
                                        invalid={meta.touched && !!meta.error}
                                        // invalidText={meta.error}
                                        helperText=""
                                        id="password1"
                                        name="password1"
                                        // slug={ <View onClick={() => setShowPassword((prev) => !prev)} />}
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="password1" component="div" className="error" />
                        </div>

                        <span className="forgot-password">
                            <a href="#">Forgot Password ?</a>
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
                                Sign Up
                            </Button>
                            <Button
                                kind="tertiary"
                                onClick={handleLogin}
                                className="btn btn-secondary"
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "unset",
                                }}
                            >
                                Log in
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;
