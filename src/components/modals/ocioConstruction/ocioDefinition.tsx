import { TextArea, TextInput } from "@carbon/react";
import { DialogTitle } from "@mui/material";
import React from "react";
import CustomDropdown from "../../../ui-elements/carbonDropdownTP.tsx";

export default function OcioDefinition({ incrementPage, decrementPage, page, setPage }) {
    return (
        <>
            <DialogTitle
                textAlign="center"
                fontSize={"2rem"}
                fontWeight={"500"}
                style={{ paddingTop: "0" }}
            >
                ACIO Copilot Definition{" "}
            </DialogTitle>

            <div className="ocio-content">
                <div className="ocio-definition-label">
                    <TextInput
                        id="text-input-1"
                        type="text"
                        labelText=""
                        placeholder="Enter Definition Name"
                        required={true}
                    />
                </div>

                <div className="ocio-heading-text">Job Definition</div>
                <div className="ocio-definition-label">
                    {" "}
                    <TextArea
                        id="text-area-1"
                        type="text"
                        labelText=""
                        placeholder="Enter Job Definition"
                        required={true}
                        value={
                            "I am a portfolio manager for US Equity Large Cap Value Team. Our investment process involves Macro, Micro Research, and Quantitative Optimization Portfolio Construction with Agentic AI-review."
                        }
                    />
                </div>

                {/* <div className="ocio-heading-text">Investment Process</div> */}
                <div className="investment-process">
                    <div className="ocio-heading-text">Investment Process</div>
                    <div className="process-parameters-box">
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Asset Class</div>
                            <CustomDropdown inline items={[]} label={"US Equity"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Cap Size</div>
                            <CustomDropdown inline items={[]} label={"Large Cap"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Styles</div>
                            <CustomDropdown inline items={[]} label={"Value"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Strategy</div>
                            <CustomDropdown inline items={[]} label={"LCap Value Tax"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Investible Universe</div>
                            <CustomDropdown inline items={[]} label={"FR1000 Val + Research"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Benchmark</div>
                            <CustomDropdown inline items={[]} label={"FR1000 Value"} />
                        </div>
                    </div>
                </div>

                <div className="investment-process">
                    <div className="ocio-heading-text">Key Drivers:</div>

                    <div className="process-parameters-box">
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Macro Research</div>
                            <CustomDropdown inline items={[]} label={"Fed Rates"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Micro Research</div>
                            <CustomDropdown
                                inline
                                items={[]}
                                label={"JPMorgan Large Cap Value Fund"}
                            />
                        </div>
                    </div>

                    <div className="ocio-heading-text">Macro Research</div>
                    <div className="process-parameters-box">
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Asset Class Ranking</div>
                            <CustomDropdown inline items={[]} label={"AC V1"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Sector Ranking</div>
                            <CustomDropdown inline items={[]} label={"SR V2"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Region Ranking</div>
                            <CustomDropdown inline items={[]} label={"RR V4"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Country Ranking</div>
                            <CustomDropdown inline items={[]} label={"CR V3"} />
                        </div>
                        {/* <div className="process-parameters">
              <div className="ocio-subheading-text">
                Strategic Asset Allocation Model
              </div>
              <CustomDropdown
                inline
                items={[]}
                label={"2024 strategic Asset Allocation Model v1"}
              />
            </div>
            <div className="process-parameters">
              <div className="ocio-subheading-text">
                Tactical Asset Allocation Model
              </div>
              <CustomDropdown
                inline
                items={[]}
                label={"2024 Tactical Asset Allocation Model v2"}
              />
            </div> */}
                    </div>

                    <div className="ocio-heading-text">Micro Research</div>
                    <div className="process-parameters-box">
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Alpha Model</div>
                            <CustomDropdown inline items={[]} label={"US EQ LCap Value"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Risk Model</div>
                            <CustomDropdown inline items={[]} label={"Barra E8L"} />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        backgroundColor: "#fff",
                        display: "flex",
                        gap: "1rem",
                        padding: "0.7rem 2rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div className="ocio-heading-text">Portfolio Construction</div>
                        <div className="process-parameters-box">
                            <div className="process-parameters">
                                <div className="ocio-subheading-text">Optimization PM</div>
                                <CustomDropdown
                                    inline
                                    items={[]}
                                    label={"Optimization Definition ABC"}
                                />
                            </div>
                            <div className="process-parameters">
                                <div className="ocio-subheading-text">Agentic-AI PM</div>
                                <CustomDropdown
                                    inline
                                    items={[]}
                                    label={"Portfolio Manager LCap Val"}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div className="ocio-heading-text">Portfolio Review</div>
                        <div className="process-parameters-box">
                            <div className="process-parameters">
                                <div className="ocio-subheading-text">Agentic-AI Reviewer</div>
                                <CustomDropdown
                                    inline
                                    items={[]}
                                    label={"Portfolio Reviewer LCap Val"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="investment-process">
                    <div className="ocio-heading-text">Work Arrangement</div>
                    <div className="process-parameters-box">
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Schedule</div>
                            <CustomDropdown inline items={[]} label={"24x7x365"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Communication Format</div>
                            <CustomDropdown inline items={[]} label={"Communication V1"} />
                        </div>
                        <div className="process-parameters">
                            <div className="ocio-subheading-text">Collaboration</div>
                            <CustomDropdown
                                inline
                                items={[]}
                                label={"Email + Message + Mobile V2"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
