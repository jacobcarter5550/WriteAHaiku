import React, { FC, useState, useEffect } from "react";
import Label from "../../ui-elements/label.tsx";
import CustomSelect from "../../ui-elements/selectTP.tsx";
import api from "../../helpers/serviceTP.ts";


const Portfolio: FC = () => {
    const [states, setState] = useState([]);

    const [cities, setCity] = useState([]);

    const [accounts, setAccount] = useState([]);

    const [client, setClient] = useState([]);

    function convertToSelect(inputArray: any, overflow?: boolean, name?: string): any {
        //@ts-ignore
        return inputArray.map((item) => ({
            value: <p>{JSON.stringify(item.messageId)}</p>,
            label: overflow ? (
                <p
                    style={{
                        width: name === "account" ? "9rem" : "5rem",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                    }}
                    title={item}
                >
                    {item}
                </p>
            ) : (
                item
            ),
        }));
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(
                    `${process.env.REACT_APP_TAX_ADVISOR}/api/tax/advisor/getAdvisorAttributes`
                );
                const { stateSet, citySet, clientNameSet, accountNameSet } = data;
                const createStateOptions = (options) =>
                    options.map((option) => ({ label: option, value: option }));
                const totalState = convertToSelect(stateSet, true, "state");
                const totalCity = convertToSelect(citySet, true, "city");
                const totalAccountName = convertToSelect(accountNameSet, true, "account");
                const totalClientName = convertToSelect(clientNameSet, true, "client");
                setState(totalState);
                setCity(totalCity);
                setAccount(totalAccountName);
                setClient(totalClientName);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <div className="client-portfolio">
                <div className="portfolio-details white-bg">
                    <Label className="main-label">Client Portfolios:</Label>
                    <div className="block">
                        <Label>States</Label>
                        <span>{states.length}</span>
                    </div>
                    <div className="block">
                        <Label>City</Label>
                        <span>{cities.length}</span>
                    </div>
                    <div className="block">
                        <Label>Clients</Label>
                        <span>{client.length}</span>
                    </div>
                    <div className="block">
                        <Label>Portfolios</Label>
                        <span>{accounts.length}</span>
                    </div>
                </div>
                <div className="demographic-wrapper">
                    <Label className="main-label">Portfolio Demographics:</Label>
                    <div className="portfolio-demographics">
                        <CustomSelect customWidth="8rem" options={states} placeholder="State" />
                        <CustomSelect customWidth="8rem" options={cities} placeholder="City" />
                        <CustomSelect customWidth="8rem" options={client} placeholder="Client" />
                        <CustomSelect
                            customWidth="13.5rem"
                            options={accounts}
                            placeholder="Account"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Portfolio;
