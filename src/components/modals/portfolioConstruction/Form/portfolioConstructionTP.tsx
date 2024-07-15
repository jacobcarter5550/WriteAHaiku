import React, { useEffect, useReducer, useState } from "react";
import CustomSelect from "../../../../ui-elements/selectTP.tsx";

import { DialogTitle } from "@mui/material";
import api from "../../../../helpers/serviceTP.ts";
import { TextInput } from "@carbon/react";
import { getCurrentDateFormatted } from "../../../../helpers/lib.ts";
import { Optimization } from "../portfolioConstructionConfigTP.tsx";

import { setForm } from "../../../../store/nonPerstistant/index.ts";
import { useDispatch } from "react-redux";

export type Select = { value: number; label: string } | null;

type SelectedState = {
    optTypeCd: Select;
    optStrategyTypeCd: Select;
    primaryBenchmarkId: Select;
    secondaryBenchmarkId: Select;
    universeId: Select;
    modelAlphaCd: Select;
    modelRiskCd: Select;
    modelTaxCd: Select;
    sectorModelCd: Select;
    modelTCostCd: Select;
    esgModelCd: Select;
    countryModelCd: Select;
};

type SelectionOptions = {
    optTypeCdOptions: Select[];
    optStrategyTypeCdOptions: Select[];
    primaryBenchmarkIdOptions: Select[];
    secondaryBenchmarkIdOptions: Select[];
    universeIdOptions: Select[];
    modelAlphaCdOptions: Select[];
    modelRiskCdOptions: Select[];
    modelTaxCdOptions: Select[];
    sectorModelCdOptions: Select[];
    modelTCostCdOptions: Select[];
    esgModelCdOptions: Select[];
    countryModelCdOptions: Select[];
};

type SelectedStringsState = {
    optimizationDefinitionName: string;
    alphaTermCoefficient: string | number;
    riskTermCoefficient: string | number;
    taxTermCoefficient: string | number;
    shortTermGainTaxRate: string | number;
    longTermGainTaxRate: string | number;
};

type PortfolioConstructionProps = {
    incrementPage: () => void;
    decrementPage: () => void;
    optimizationDefinition: Optimization | null;
    setOptimizationDefintion: React.Dispatch<React.SetStateAction<Optimization | null>>;
};

const PortfolioConstruction: React.FC<PortfolioConstructionProps> = ({
    decrementPage,
    incrementPage,
    optimizationDefinition,
    setOptimizationDefintion,
}) => {
    const dispatch = useDispatch();

    const [selected, setSelected] = useReducer(
        (prev: SelectedState, next: Partial<SelectedState>): SelectedState => ({
            ...prev,
            ...next,
        }),
        {
            optTypeCd: null, // optTypeCd
            optStrategyTypeCd: null, // optStrategyTypeCd
            primaryBenchmarkId: null, //primaryBenchmarkId
            secondaryBenchmarkId: null, // secondaryBenchmarkId
            universeId: null, //universeId
            modelAlphaCd: null, // modelAlphaCd
            modelRiskCd: null, // modelRiskCd
            modelTaxCd: null, // modelTaxCd
            sectorModelCd: null, // sectorModelCd
            modelTCostCd: null, //modelTCostCd
            esgModelCd: null, // esgModelCd
            countryModelCd: null, //countryModelCd
        }
    );

    const [selectedStrings, setSelectedStrings] = useReducer(
        (
            prev: SelectedStringsState,
            next: Partial<SelectedStringsState>
        ): SelectedStringsState => ({
            ...prev,
            ...next,
        }),
        {
            optimizationDefinitionName: optimizationDefinition?.optimizationDefinitionName ?? "",
            alphaTermCoefficient: optimizationDefinition?.objectCoefficientAlpha ?? "",
            riskTermCoefficient: optimizationDefinition?.objectCoefficientRisk ?? "",
            taxTermCoefficient: optimizationDefinition?.objectCoefficientTax ?? "",
            shortTermGainTaxRate: optimizationDefinition?.capitalGainsTaxRate ?? "",
            longTermGainTaxRate: optimizationDefinition?.nonCapitalGainsTaxRate ?? "",
        }
    );

    function dispatchForm(e) {
        dispatch(setForm(e));
    }

    useEffect(() => {
        dispatchForm({ ...selected, ...selectedStrings });
    }, [selected, selectedStrings]);

    const [options, setOptions] = useReducer(
        (prev: SelectionOptions, next: Partial<SelectionOptions>): SelectionOptions => ({
            ...prev,
            ...next,
        }),
        {
            optTypeCdOptions: [],
            optStrategyTypeCdOptions: [],
            primaryBenchmarkIdOptions: [],
            secondaryBenchmarkIdOptions: [],
            universeIdOptions: [],
            modelAlphaCdOptions: [],
            modelRiskCdOptions: [],
            modelTaxCdOptions: [],
            sectorModelCdOptions: [],
            modelTCostCdOptions: [],
            esgModelCdOptions: [],
            countryModelCdOptions: [],
        }
    );

    const getPortfolioConstructionModel = () => {
        return api.get(`/optconstructionmodel/${getCurrentDateFormatted()}`).then((res) => {
            let opAlg = {};
            //@ts-ignore
            res.data.optimizationStrategy = [
                "Long",
                "Short",
                "Long/Short",
                "130/30",
                "MarketNeural",
            ];
            //@ts-ignore
            res.data.optimizationAlgorithm.forEach((item, index) => {
                opAlg[item] = index;
            });
            //@ts-ignore
            res.data.optimizationAlgorithm = opAlg;

            let opStrat = {};
            //@ts-ignore
            res.data.optimizationStrategy.forEach((item, index) => {
                opStrat[item] = index;
            });
            //@ts-ignore
            res.data.optimizationStrategy = opStrat;

            return res;
        });
    };

    function selectFormat(details) {
        if (Array.isArray(details)) {
            return details.map((item, index) => {
                return {
                    label: item,
                    value: index,
                };
            });
        } else {
            return Object.entries(details).map((item, index) => {
                return {
                    label: item[0],
                    value: item[1],
                };
            });
        }
    }

    function findSelectOption(options, value) {
        // Check if options is not undefined or null
        if (!options) {
            return null;
        }

        if (typeof value === "number") {
            return options.find((item) => item.value === value) || null;
        } else if (typeof value === "string") {
            return options.find((item) => item.label === value) || null;
        }
        return null;
    }

    function mapOptimizationToSelectedState(optimizationDefinition, options) {
        const mapping = {
            optTypeCd: {
                stateKey: "optTypeCd",
                optionsKey: "optTypeCdOptions",
            },
            optStrategyTypeCd: {
                stateKey: "optStrategyTypeCd",
                optionsKey: "optStrategyTypeCdOptions",
            },
            primaryBenchmarkId: {
                stateKey: "primaryBenchmarkId",
                optionsKey: "primaryBenchmarkIdOptions",
            },
            secondaryBenchmarkId: {
                stateKey: "secondaryBenchmarkId",
                optionsKey: "secondaryBenchmarkIdOptions",
            },
            universeId: {
                stateKey: "universeId",
                optionsKey: "universeIdOptions",
            },
            modelAlphaCd: {
                stateKey: "modelAlphaCd",
                optionsKey: "modelAlphaCdOptions",
            },
            modelRiskCd: {
                stateKey: "modelRiskCd",
                optionsKey: "modelRiskCdOptions",
            },
            modelTaxCd: { stateKey: "modelTaxCd", optionsKey: "modelTaxCdOptions" },
            modelTCostCd: {
                stateKey: "modelTCostCd",
                optionsKey: "modelTCostCdOptions",
            },
            countryModelCd: {
                stateKey: "countryModel",
                optionsKey: "countryModelOptions",
            },
            esgModelCd: { stateKey: "esgModelCd", optionsKey: "esgModelCdOptions" },
            sectorModelCd: {
                stateKey: "sectorModelCd",
                optionsKey: "sectorModelCdOptions",
            },
        };
        const selectedState = {};

        for (const [key, mapInfo] of Object.entries(mapping)) {
            if (key == "optStrategyTypeCd") {
                console.log("key", key, optimizationDefinition[key]);
            }
            if (key == "optTypeCd") {
                console.log("key", key, optimizationDefinition[key]);
            }
            const optValue = optimizationDefinition[key];
            const optionsArray = options[mapInfo.optionsKey] || [];

            selectedState[mapInfo.stateKey] = findSelectOption(optionsArray, optValue);
            if (key == "optStrategyTypeCd") {
                console.log(selectedState, optValue, optionsArray);
            }
            if (key == "optTypeCd") {
                console.log(selectedState, optValue, optionsArray);
            }
        }

        return selectedState;
    }
    function formatConstructionModels(constructionModels) {
        console.log("constructionModels", constructionModels);
        // Define the mapping from input keys to output keys
        const keyMapping = {
            optimizationStrategy: "optStrategyTypeCdOptions",
            optimizationAlgorithm: "optTypeCdOptions",
            benchmark: "primaryBenchmarkIdOptions",
            investibleuniverse: "universeIdOptions",
            sectorModel: "sectorModelCdOptions",
            esgModel: "esgModelCdOptions",
            countryModel: "countryModelCdOptions",
            riskModel: "modelRiskCdOptions",
            alphaModel: "modelAlphaCdOptions",
            taxModel: "modelTaxCdOptions",
            transactionCostModel: "modelTCostCdOptions",
            messages: null, // assuming messages does not have a corresponding output key
        };

        const formattedOptions = {};
        for (const [key, value] of Object.entries(constructionModels.data)) {
            // Use the keyMapping to find the new key
            const newKey = keyMapping[key];
            if (newKey) {
                formattedOptions[newKey] = value ? selectFormat(value) : [];
            }
        }
        console.log("formattedOptions", formattedOptions);
        return formattedOptions;
    }

    const fetchData = async () => {
        try {
            const constructionModels = await getPortfolioConstructionModel();
            console.log("fetched", constructionModels);
            const formattedConstructionModels = formatConstructionModels(constructionModels);
            console.log("Options", formattedConstructionModels);
            setOptions(formattedConstructionModels);
            const formatedOptDef = mapOptimizationToSelectedState(
                optimizationDefinition,
                formattedConstructionModels
            );
            console.log("State", formatedOptDef);
            setSelected(formatedOptDef);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        setOptimizationDefintion((optimizationDefinition) => {
            if (optimizationDefinition) {
                // —————— States ——————
                optimizationDefinition.optTypeCd = selected.optTypeCd?.label!;
                optimizationDefinition.optStrategyTypeCd = selected.optStrategyTypeCd?.label!;
                optimizationDefinition.primaryBenchmarkId = selected.primaryBenchmarkId?.value!;
                optimizationDefinition.secondaryBenchmarkId = selected.secondaryBenchmarkId?.value!;
                optimizationDefinition.universeId = selected.universeId?.value!;
                optimizationDefinition.modelAlphaCd = selected.modelAlphaCd?.value!;
                optimizationDefinition.modelRiskCd = selected.modelRiskCd?.value!;
                optimizationDefinition.modelTaxCd = selected.modelTaxCd?.value!;
                optimizationDefinition.modelTCostCd = selected.modelTCostCd?.value!;
                optimizationDefinition.countryModelCd = selected.countryModelCd?.value!;
                optimizationDefinition.esgModelCd = selected.esgModelCd?.value!;
                optimizationDefinition.sectorModelCd = selected.sectorModelCd?.value!;

                // —————— Strings ——————
                optimizationDefinition.objectCoefficientAlpha =
                    selectedStrings.alphaTermCoefficient as number;
                optimizationDefinition.objectCoefficientRisk =
                    selectedStrings.riskTermCoefficient as number;
                optimizationDefinition.objectCoefficientTax =
                    selectedStrings.taxTermCoefficient as number;
                optimizationDefinition.capitalGainsTaxRate =
                    selectedStrings.shortTermGainTaxRate as number;
                optimizationDefinition.nonCapitalGainsTaxRate =
                    selectedStrings.longTermGainTaxRate as number;
                optimizationDefinition.optimizationDefinitionName =
                    selectedStrings.optimizationDefinitionName;
            }

            return optimizationDefinition;
        });

        incrementPage();
        // You can add further logic here to handle the form data, such as sending it to the server.
    };
    console.log(selected);
    return (
        <>

                <DialogTitle
                    textAlign="center"
                    mt="1em"
                    fontSize={"2rem"}
                    fontWeight={"500"}
                    marginTop={"0px"}
                    className="pc-modal-heading"
                >
                    Portfolio Construction ( Model Setup )
                </DialogTitle>
                {/* <h1>{optimizationDefintion?.optimizationDefinitionName}</h1> */}

                <div style={{ width: "100%", display: "flex", gap: "1rem" }}>
                    <TextInput
                        id="optimizationDefinitionName"
                        hideLabel={true}
                        labelText="Optimization Definition Name"
                        value={selectedStrings.optimizationDefinitionName}
                        onChange={(e) => {
                            setSelectedStrings({
                                ...selectedStrings,
                                optimizationDefinitionName: e.target.value,
                            });
                        }}
                        size="md"
                    />

                    <img
                        src="dark-mic.svg"
                        alt="Microphone-icon"
                        title="Mic"
                        style={{ height: "2.5rem", backgroundColor: "#383c93", padding: ".5rem" }}
                    />
                </div>
                <div className="portfolio-construction-container">
                    <form>
                        <div className="portfolio-container-wrapper">
                            <div className="flex-block-one">
                                <div className="objective-wrapper border-inline">
                                    <h3>Objective Setup</h3>
                                    <div className="form-group">
                                        <label>Optimization Strategy </label>
                                        <CustomSelect
                                            options={options.optTypeCdOptions}
                                            customWidth={"21vw"}
                                            value={selected.optTypeCd}
                                            onChange={(selectedOption) => {
                                                setSelected({
                                                    ...selected,
                                                    optTypeCd: selectedOption,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Optimization Algorithms</label>
                                        <CustomSelect
                                            options={options.optStrategyTypeCdOptions}
                                            customWidth={"21vw"}
                                            value={selected.optStrategyTypeCd}
                                            onChange={(selectedOption) => {
                                                setSelected({
                                                    ...selected,
                                                    optStrategyTypeCd: selectedOption,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="benchmark border-inline">
                                    <h3>Benchmark Setup</h3>

                                    <div className="form-group">
                                        <label>Primary Benchmark</label>
                                        <CustomSelect
                                            options={options.primaryBenchmarkIdOptions}
                                            customWidth={"21vw"}
                                            value={selected.primaryBenchmarkId}
                                            onChange={(selectedOption) => {
                                                console.log(selectedOption);
                                                setSelected({
                                                    ...selected,
                                                    primaryBenchmarkId: selectedOption,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Secondary Benchmark</label>
                                        <CustomSelect
                                            options={options.secondaryBenchmarkIdOptions}
                                            customWidth={"21vw"}
                                            value={selected.secondaryBenchmarkId}
                                            onChange={(selectedOption) => {
                                                setSelected({
                                                    ...selected,
                                                    secondaryBenchmarkId: selectedOption,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="constraint border-inline">
                                    <h3>Constraint Setup</h3>
                                    <div className="form-group">
                                        <label>Sector Model</label>
                                        <CustomSelect
                                            options={options.sectorModelCdOptions}
                                            value={selected.sectorModelCd}
                                            onChange={(selectedOption) => {
                                                setSelected({
                                                    ...selected,
                                                    sectorModelCd: selectedOption,
                                                });
                                            }}
                                            customWidth={"21vw"}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Country Model</label>
                                        <CustomSelect
                                            options={options.countryModelCdOptions}
                                            value={selected.countryModelCd}
                                            onChange={(selectedOption) => {
                                                setSelected({
                                                    ...selected,
                                                    countryModelCd: selectedOption,
                                                });
                                            }}
                                            customWidth={"21vw"}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>ESG Model</label>
                                        <CustomSelect
                                            options={options.esgModelCdOptions}
                                            customWidth={"21vw"}
                                            value={selected.esgModelCd}
                                            onChange={(selectedOption) => {
                                                setSelected({
                                                    ...selected,
                                                    esgModelCd: selectedOption,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="constraint border-inline">
                                    <h3>Universe Setup</h3>
                                    <div className="form-group">
                                        <label>Investible Universe</label>
                                        <CustomSelect
                                            options={options.universeIdOptions}
                                            customWidth={"21vw"}
                                            value={selected.universeId}
                                            onChange={(selectedOption) => {
                                                setSelected({
                                                    ...selected,
                                                    universeId: selectedOption,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-block-one ">
                                <div className="constraint border-inline">
                                    <h3>Alpha Setup</h3>
                                    <div className="form-group input-group">
                                        <label>Alpha Term Coefficient</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={selectedStrings.alphaTermCoefficient}
                                            onChange={(e) =>
                                                setSelectedStrings({
                                                    ...selectedStrings,
                                                    alphaTermCoefficient: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Alpha Model</label>
                                        <CustomSelect
                                            options={options.modelAlphaCdOptions}
                                            customWidth={"21vw"}
                                            value={selected.modelAlphaCd}
                                            onChange={(selectedOption) =>
                                                setSelected({
                                                    ...selected,
                                                    modelAlphaCd: selectedOption,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="constraint border-inline">
                                    <h3>Risk Term</h3>
                                    <div className="form-group input-group">
                                        <label>Risk Term Coefficient</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={selectedStrings.riskTermCoefficient}
                                            onChange={(e) =>
                                                setSelectedStrings({
                                                    ...selectedStrings,
                                                    riskTermCoefficient: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Risk Model</label>
                                        <CustomSelect
                                            options={options.modelRiskCdOptions}
                                            customWidth={"21vw"}
                                            value={selected.modelRiskCd}
                                            onChange={(selectedOption) =>
                                                setSelected({
                                                    ...selected,
                                                    modelRiskCd: selectedOption,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="constraint border-inline">
                                    <h3>Tax Term</h3>
                                    <div className="form-group input-group">
                                        <label>Tax Term Coefficient</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={selectedStrings.taxTermCoefficient}
                                            onChange={(e) =>
                                                setSelectedStrings({
                                                    ...selectedStrings,
                                                    taxTermCoefficient: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-group input-group">
                                        <label>Short Term Gain Tax Rate</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={selectedStrings.shortTermGainTaxRate}
                                            onChange={(e) =>
                                                setSelectedStrings({
                                                    ...selectedStrings,
                                                    shortTermGainTaxRate: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-group input-group">
                                        <label>Long Term Gain Tax Rate </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={selectedStrings.longTermGainTaxRate}
                                            onChange={(e) =>
                                                setSelectedStrings({
                                                    ...selectedStrings,
                                                    longTermGainTaxRate: Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Tax Model</label>
                                        <CustomSelect
                                            options={options.modelTaxCdOptions}
                                            customWidth={"21vw"}
                                            value={selected.modelTaxCd}
                                            onChange={(selectedOption) =>
                                                setSelected({
                                                    ...selected,
                                                    modelTaxCd: selectedOption,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="constraint border-inline">
                                    <h3>TCost Term</h3>
                                    <div className="form-group">
                                        <label>Transaction Cost Model</label>
                                        <CustomSelect
                                            options={options.modelTaxCdOptions}
                                            customWidth={"21vw"}
                                            value={selected.modelTaxCd}
                                            onChange={(selectedOption) =>
                                                setSelected({
                                                    ...selected,
                                                    modelTaxCd: selectedOption,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
       
        </>
    );
};

export default PortfolioConstruction;
