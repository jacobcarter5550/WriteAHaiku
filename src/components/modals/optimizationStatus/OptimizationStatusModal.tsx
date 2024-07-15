import React, { useRef } from "react";
import SmallModal from "../../../ui-elements/modals/SmallModal.tsx";
import { Accordion } from "@carbon/react";
import { AccordionItem, Slider, TextInput, Dropdown } from "@carbon/react";
import { OptimizationEvent, OptimizationStep } from "../../portfolio/misc/Header.tsx";
import Button from "../../../ui-elements/buttonTP.tsx";
import { useAppSelector } from "../../../store/index.ts";
import { getAccountId } from "../../../store/portfolio/selector.ts";
import { Theme } from "@carbon/react";
import { useTheme } from "next-themes";

type OptimizationStatusProps = {
    close: () => void;
    optimizationSteps: OptimizationStep[] | null;
};

const OptimizationStatus: React.FC<OptimizationStatusProps> = ({ close, optimizationSteps }) => {
    const theme = useTheme();
    const buttons = (
        <section style={{ display: "flex", width: "90%", flexDirection: "row-reverse" }}>
            <Button className={"pop-btn"} label="Done" onClick={close} />
        </section>
    );

    const heightRef = useRef<HTMLDivElement>(null);

    const accountids = useAppSelector(getAccountId);
    console.log(accountids);

    console.log(optimizationSteps)
    return (
        <>
            <SmallModal buttons={buttons} open={true} closeDialog={close}>
                <div className="optimizationModal">
                    <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
                        Optimization Status
                    </h2>
                    <section className="contentWrapper">
                        <div className="accountStatuses col">
                            <section className="title">Accounts in Optimization</section>
                            <section
                                style={{
                                    height: "35rem",
                                    overflowX: "unset",
                                }}
                                ref={heightRef}
                                className="body"
                            >
                                {optimizationSteps?.map((item) => {

                                    const isFinished = item.data.some(dataEntry => dataEntry.includes("COMPLETION_PERCENTAGE : 100"));
                                    return (
                                        <aside
                                            className="accountItem"
                                            style={{
                                                display: "flex",
                                                width: "100%",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <p>
                                                {
                                                    accountids.find(
                                                        (account) =>
                                                            Number(account.value) == item.accountId
                                                    )?.label
                                                }
                                            </p>
                                            <p
                                                style={{
                                                    color: isFinished ? "green" : "orange",
                                                }}
                                            >
                                                {isFinished ? "Completed" : "In Progress"}
                                            </p>
                                        </aside>
                                    );
                                })}
                            </section>
                        </div>
                        <div className="accountItems col">
                            <section className="title">Completed Steps</section>
                            <section
                                style={{
                                    padding: "0px",
                                    overflowX: "unset",
                                    height: "35rem",
                                }}
                                className="body"
                            >
                                {optimizationSteps
                                    ?.map((item) => {
                                        const isFinished = item.data.some(dataEntry => dataEntry.includes("COMPLETION_PERCENTAGE : 100"));
                                        if (item.eventId) {
                                            return (
                                                <section style={{ margin: "0rem 0px" }}>
                                                    <Theme
                                                        theme={
                                                            theme.theme == "light"
                                                                ? "white"
                                                                : "g100"
                                                        }
                                                    >
                                                        <Accordion>
                                                            <AccordionItem
                                                                //@ts-ignore
                                                                style={{ padding: ".225rem 0px" }}
                                                                open={!isFinished}
                                                                title={
                                                                    <p
                                                                        style={{
                                                                            width: "10rem",
                                                                            overflow: "hidden",
                                                                            textOverflow:
                                                                                "ellipsis",
                                                                            whiteSpace: "nowrap",
                                                                        }}
                                                                    >
                                                                        {item.eventId}
                                                                    </p>
                                                                }
                                                            >
                                                                {item.data.map((item) => {
                                                                    return <p>{item}</p>;
                                                                })}
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </Theme>
                                                </section>
                                            );
                                        } else {
                                            return undefined;
                                        }
                                    })
                                    .filter((item) => item !== undefined)}
                            </section>
                        </div>
                        <div className="messages col">
                            <section className="title">Infeasibility Solutions</section>
                            <section
                                className="body"
                                style={{ height: "35rem", overflowX: "unset" }}
                            ></section>
                        </div>
                    </section>
                </div>
            </SmallModal>
        </>
    );
};

export default OptimizationStatus;
