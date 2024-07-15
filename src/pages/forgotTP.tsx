import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import api from "../helpers/serviceTP.ts";
import { Button, TextInput } from "@carbon/react";

const ForgotPassword: React.FC = () => {


    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Required"),
    });


    const handleSubmit = async (values: { email: string }, { setSubmitting }: any) => {
        const { email } = values;
        const encodedEmail = encodeURIComponent(email);
        api.post(
            `${process.env.REACT_APP_HOST_IP_ADDRESS}/public/user/forgot/password/${encodedEmail}`
        )
            .then((res) => {
                console.log(res);
                toast.success("Password reset email sent successfully");
            })
            .catch((error) => {
                // Handle errors
                console.log(error);
                toast.error("Error sending password reset email");
            });
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
                    initialValues={{ email: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <Field name="email">
                                {({ field, meta }: any) => (
                                    <TextInput
                                        labelText="Enter Email Address:"
                                        {...field}
                                        invalid={meta.touched && !!meta.error}
                                        // invalidText={meta.error}
                                        helperText=""
                                        id="email"
                                        name="email"
                                        placeholder="Email Address"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="email" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <Button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "unset",
                                }}
                                disabled={false /* add your condition */}
                            >
                                Send Password to email
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default ForgotPassword;
