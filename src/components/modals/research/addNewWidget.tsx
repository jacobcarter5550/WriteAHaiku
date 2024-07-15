import React, { useState } from "react";
import ModalType, { ModalTypeEnum } from "../../../ui-elements/modals/ModalType.tsx";
import { Tabs, Tab, TabList } from "@carbon/react";
import CustomizeWidget from "./customiseWidget.tsx";
import { useTheme } from "next-themes";
import { Theme } from "@carbon/react";
interface Props {
    flag: any;
    updateFlag: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
    modal: {
        display: "flex",
        alignItems: "center",
        padding: "40px",
        zIndex: 1000,
        backgroundColor: "#F4F4F4",
    },
    heading: {
        paddingBottom: "30px",
    },
};

enum TabLabels {
    Charts = "Charts",
    Lists = "Table",
    NewsAlerts = "News & Alerts",
}

const AddWidget: React.FC<Props> = ({ flag, updateFlag }) => {
    const theme = useTheme();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [customiseWidgetPopup, setCustomiseWidgetPopup] = useState<boolean>(false);


    const renderContent = (): JSX.Element => {
        switch (selectedTab) {
            case 0:
                return <Charts handlePopup={setCustomiseWidgetPopup} />;
            case 1:
                return <Lists />;
            case 2:
                return <NewsAlerts />;
            case 3:
                return <Texts />;
            default:
                return <Charts handlePopup={setCustomiseWidgetPopup} />;
        }
    };

    return (
        <>
            <ModalType
                type={ModalTypeEnum.SMALL}
                open={flag}
                style={styles.modal}
                closeDialog={updateFlag}
                buttons={[]}
            >
                <h3 style={styles.heading}>Add a module</h3>
                <div className="tab-list-wrappwer">
                    <Tabs onChange={(data) => setSelectedTab(data.selectedIndex)}>
                        <TabList
                            aria-label="Tab navigation"
                            aria-orientation="vertical"
                            role="tablist"
                        >
                            {Object.values(TabLabels).map((label, index) => (
                                <Tab key={index}>{label}</Tab>
                            ))}
                        </TabList>
                    </Tabs>
                    <div className="module-page">
                        <div className="module-content">
                            <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                                {renderContent()}
                            </Theme>
                        </div>
                    </div>
                </div>
            </ModalType>
            <Theme theme={theme.theme == "light" ? "white" : "g100"}>
                <CustomizeWidget
                    flag={customiseWidgetPopup}
                    updateFlag={() => setCustomiseWidgetPopup(false)}
                />
            </Theme>
        </>
    );
};

const Charts = ({ handlePopup }) => (
    <div className="module-grid">
        <div className="module-item" onClick={() => handlePopup(true)}>
            <img src={"/chart.png"} alt="Microphone" />
            <h3>Fundamental Chart</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/scatter.svg"} alt="Microphone" />
            <h3>Fundamental Chart</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/treemap.svg"} alt="Microphone" />
            <h3>Fundamental Chart</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/candlestick.svg"} alt="Microphone" />
            <h3>Fundamental Chart</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
    </div>
);

const Lists = () => (
    <div className="module-grid">
        <div className="module-item">
            <img src={"/chart.png"} alt="Microphone" />
            <h3>Table</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/scatter.svg"} alt="Microphone" />
            <h3>Table</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/treemap.svg"} alt="Microphone" />
            <h3>Table</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/candlestick.svg"} alt="Microphone" />
            <h3>Table</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
    </div>
);

const NewsAlerts = () => (
    <div className="module-grid">
        <div className="module-item">
            <img src={"/chart.png"} alt="Microphone" />
            <h3>News and Alerts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/scatter.svg"} alt="Microphone" />
            <h3>News and Alerts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/treemap.svg"} alt="Microphone" />
            <h3>News and Alerts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/candlestick.svg"} alt="Microphone" />
            <h3>News and Alerts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
    </div>
);

const Texts = () => (
    <div className="module-grid">
        <div className="module-item">
            <img src={"/chart.png"} alt="Microphone" />
            <h3>Texts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/scatter.svg"} alt="Microphone" />
            <h3>Texts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/treemap.svg"} alt="Microphone" />
            <h3>Texts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
        <div className="module-item">
            <img src={"/candlestick.svg"} alt="Microphone" />
            <h3>Texts</h3>
            <p> Add a saved fundamental chart or start from one of our templates</p>
        </div>
    </div>
);

export default AddWidget;
