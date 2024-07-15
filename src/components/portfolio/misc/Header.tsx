import React, { useEffect, useState } from "react";
import MultipleSelectCheckmarks from "../../../ui-elements/multiselect.tsx";
import Button from "../../../ui-elements/buttonTP.tsx";
import CustomSelect from "../../../ui-elements/selectTP.tsx";
import HistoricalComparisonModal from "../../modals/optimizationHistory/HistoricalComparionModalTP.tsx";
import PortfolioConstructionConfig from "../../modals/portfolioConstruction/portfolioConstructionConfigTP.tsx";
import { SelectOption } from "../../nav/Nav.tsx";
import { updateAccountId } from "../../../store/portfolio/index.ts";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountId } from "../../../store/portfolio/selector.ts";
import api, { getLocalAccessToken } from "../../../helpers/serviceTP.ts";
import { signal } from "@preact/signals-react";
import { generateRandomFourDigitNumber } from "../../modals/portfolioConstruction/lib.ts";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import OptimizationStatus from "../../modals/optimizationStatus/OptimizationStatusModal.tsx";
import { useDispatch } from "react-redux";
import {
  setCurrentOpen,
  setShowOptimizationDefinition,
  setNewAccountCreation,
} from "../../../store/nonPerstistant/index.ts";
import {
  getCurrentOpen,
  getShowOcioOptimizationDefinition,
  getShowOptimizationDefinition,
  getShowNewAccountCreation,
} from "../../../store/nonPerstistant/selectors.ts";
import OcioConstructionConfig from "../../modals/ocioConstruction/ocioConstructionConfig.tsx";
import { useOptContext } from "../../../providers/contexts/optContext.ts";
import NewAccountCreation from "../../modals/newAccountCreation/index.tsx";
import DynamicPortfolioFilterComp from "./DynamicPortfolioFilterComp.tsx";
import AcioModal from "../../modals/acioModal/AcioModal.tsx";
import axios from "axios";

export const modalOpen = signal<boolean>(false);

export type OptimizationEvent = {
  account_id: number;
  event_id: string;
  isComplete: boolean;
  message: string;
  optDefId: number;
};

export type OptimizationStep = {
  accountId: number;
  eventId: null;
  data: string[];
  finished: false;
};

const Header: React.FC<{}> = ({}) => {
  const [showOptimizationStatus, setShowOptimizationStatus] =
    useState<boolean>(false);

  const hardcodedPortfolioAction = [
    { item: "OPT - Construction", label: "OPT - Construction" },
    { item: "OPT - Status", label: "OPT - Status" },
  ];

  const [optimizationSteps, setOptimizationSteps] = useState<any | null>([]);

  const listedAccounts = useAppSelector(getAccountId);

  const [portfolioSelectedValue, setPortfolioSelected] = useState<
    SelectOption | {}
  >(listedAccounts);

  const [page, setPage] = React.useState(0);

  function dispatchCurrentOpen(val: boolean) {
    dispatch(setCurrentOpen(val));
  }

  const currentOpen = useAppSelector(getCurrentOpen);

  const dispatch = useDispatch();

  const onCloseOptimzationHistory = () => {};

  const handleOptimHistOptionChange = () => {
    setPage(1);
  };

  function dispatchShowOptimizationDefinition(val: boolean) {
    dispatch(setShowOptimizationDefinition(val));
  }

  const showOptimizationDefinition = useAppSelector(
    getShowOptimizationDefinition
  );
  const showOcioOptimizationDefinition = useAppSelector(
    getShowOcioOptimizationDefinition
  );
  const showNewAccountCreationModal = useAppSelector(getShowNewAccountCreation);

  const handleOptimisationPopup = () => {
    dispatchShowOptimizationDefinition(true);
  };

  const selectPortfolioSelector = (data: SelectOption[]) => {
    setPortfolioSelected(data);
    dispatch(updateAccountId(data));
  };

  const { setOptVal, setOpt } = useOptContext();

  useEffect(() => {
    // Find the element with the class name
    const element = document.querySelector(".max");

    // Define the click handler function
    const handleOpenClick = (e) => {
      dispatchCurrentOpen(!currentOpen);
    };

    // Check if the element exists before adding the event listener
    if (element) {
      element.addEventListener("click", handleOpenClick);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (element) {
        element.removeEventListener("click", handleOpenClick);
      }
    };
  }, [currentOpen]);

  const newAccountHandler = (name: string) => {
    dispatch(setNewAccountCreation(true));
  };

  const [acioModal, setAcioModal] = useState<boolean>(false);

  return (
    <>
      <div className="sub-header">
        <div className="dropdowns-section-one">
          <MultipleSelectCheckmarks
            changeFunction={(data) => selectPortfolioSelector(data)}
            accountCreation="Import Account"
            newAccountHandler={(name) => newAccountHandler(name)}
          />
          <DynamicPortfolioFilterComp />
          {Object.keys(portfolioSelectedValue).length > 0 && (
            <Button
              onClick={handleOptimisationPopup}
              label={"Optimization Definition"}
            />
          )}

          <CustomSelect
            defaultValue={{ label: "Portfolio Action" }}
            options={hardcodedPortfolioAction}
            onChange={async (newValue) => {
              const connectToSSE = (event: OptimizationEvent) => {
                return new Promise(async (resolve, reject) => {
                  const url = `${"https://optimisers-dev-eagle.linvest21.com"}/api/v1/optevent/status/${event.event_id}`;
                  const token = getLocalAccessToken();

                  try {
                    await fetchEventSource(url, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      onmessage(ev) {
                        console.log(
                          " 999 SSE message for eventId:",
                          event.event_id
                        );

                        setOptimizationSteps((prev) => {
                          for (const item of prev) {
                            if (item.accountId === event.account_id) {
                              item.eventId = event.event_id;
                              item.data = [...item.data, ev.data];
                            }
                          }
                          return prev;
                        });
                        console.log(ev.data);
                        const split = ev.data.split(
                          "COMPLETION_PERCENTAGE:"
                        )[1];

                        const percentage = ev.data.split(
                          "COMPLETION_PERCENTAGE:"
                        )[1];

                        if (Number(percentage)) {
                          const val =
                            Number(percentage) / listedAccounts.length;
                          setOptVal((prevVal) => (prevVal ?? 0) + val);
                        }
                        // Optionally, determine conditions here if you need to resolve (move on) based on data received
                      },

                      onerror(ev) {
                        resolve(ev);
                      },
                      onclose() {
                        setOptimizationSteps((prev) => {
                          for (const item of prev) {
                            if (item.accountId === event.accountId) {
                              item.finished = true;
                            }
                          }
                          return prev;
                        });

                        resolve(""); // This resolves the Promise, moving to the next event in the sequence
                      },
                    });
                  } catch (error) {
                    reject(error); // Reject the promise on failure to initiate SSE
                  }
                });
              };

              // Adjusted logic to process each eventId sequentially
              const processEventIdsSequentially = async (
                data: OptimizationEvent[]
              ) => {
                console.log("Processing events sequentially", data);
                for (const item of data) {
                  setOpt(true);

                  await connectToSSE(item); // Wait for each connection to close before moving to the next
                }
              };

              // Example usage within your if block or a function
              if (newValue.label === "OPT - Construction") {
                const initialstate = listedAccounts.map((item) => {
                  return {
                    accountId: item.value,
                    eventId: null,
                    data: [],
                    finished: false,
                  };
                });
                setOptimizationSteps(initialstate);
                const createPayload = listedAccounts.map((item) => {
                  return {
                    accountId: item.value,
                    optDefId: 1,
                  };
                });
                const payload = {
                  accountOptDefPairs: createPayload,
                  name: `opt ${generateRandomFourDigitNumber()}`,
                };
                // Your existing logic to create payload and send API request
                setOptVal(0);

                try {
                  const response = await axios.post(
                    "https://optimisers-dev-eagle.linvest21.com/api/v1/optevent/new",
                    payload
                  );
                  let data = response.data;

                  await processEventIdsSequentially(data.data).then(() => {
                    setOpt(false);
                  }); // Process each eventId sequentially
                } catch (error) {
                  setOpt(false);
                }
              } else if (newValue.label === "OPT - Status") {
                setShowOptimizationStatus(true);
              }
            }}
            customHeight={"2.55rem"}
          />
          <Button
            onClick={handleOptimHistOptionChange}
            label={"Optimization History"}
          />
        </div>
        <div
          className="dropdowns-section-two"
          style={{ gap: "2.5rem", justifyContent: "space-between" }}
        >
          <Button
            onClick={() => {
              setAcioModal(true);
            }}
            style={{ width: "10rem" }}
            label={"Real Time ACIO"}
          />
          <Button
            disable
            onClick={() => {}}
            style={{ width: "10rem"}}
            label={"Historical ACIO"}
            className="disable-dark"
          />
        </div>
      </div>

      {/* {showOptimizationDefinition && (
        <PortfolioConstructionConfig
          selectedPortfolio={portfolioSelectedValue}
        />
      )} */}
      {acioModal && (
        <AcioModal acioModal={acioModal} setAcioModal={setAcioModal} />
      )}

      {showOcioOptimizationDefinition && (
        <OcioConstructionConfig selectedPortfolio={portfolioSelectedValue} />
      )}
      {showOptimizationStatus && (
        <OptimizationStatus
          optimizationSteps={optimizationSteps}
          close={() => {
            setShowOptimizationStatus(false);
          }}
        />
      )}
      <HistoricalComparisonModal
        onClose={onCloseOptimzationHistory}
        page={page}
        setPage={setPage}
      />
      {showNewAccountCreationModal && <NewAccountCreation />}
    </>
  );
};

export default Header;
