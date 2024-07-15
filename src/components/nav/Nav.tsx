import React, { useEffect, useRef, useState } from "react";
import ToggleSwitch from "../../ui-elements/toggleSwitchTP.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { useAppSelector } from "../../store/index.ts";
import {
    getPortfolioActions,
    portfolioSelectors,
    getAccountId,
} from "../../store/portfolio/selector.ts";
import { fetchPortfolioAction, fetchPortfolioSelectors } from "../../helpers/lib.ts";
import NotificationDropdown from "./notification/notification.tsx";
import ReusableMenu from "../../ui-elements/reusableMenu.tsx";
import CustomDropdown from "../../ui-elements/carbonDropdownTP.tsx";
import "../../styles/header.scss";
import { useDispatch } from "react-redux";
import {
    getCurrentOpen,
    getShowOcioOptimizationDefinition,
} from "../../store/nonPerstistant/selectors.ts";
import {
    setCurrentOpen,
    setShowOcioOptimizationDefinition,
} from "../../store/nonPerstistant/index.ts";
import { Button } from "@carbon/react";
import { useTheme } from "next-themes";
import api from "../../helpers/serviceTP.ts";
import OcioConstructionConfig from "../modals/ocioConstruction/ocioConstructionConfig.tsx";

interface HeaderProps {}

export interface SelectOption {
    label: string | JSX.Element;
    value: string;
}

interface Group {
    groupId: number;
    groupName: string;
    roles: string[];
    accounts: number[];
}

interface UserRoles {
    userId: number;
    userName: string;
    userEmail: string;
    group: Group[];
}

const menuItems = [
    "Equity Active PM",
    "Equity Quant PM",
    "Fixed Income PM",
    "Model PM",
    "ETF PM",
    "Tax Advisor",
    "Index Builder",
    "Log out",
];

const modelManagement = [
    { id: "option1", text: <p>Model Management</p> },
    { id: "option2", text: <p>Model Delivery</p> },
];

const Nav: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    function dispatchCurrentOpen(val: boolean) {
        dispatch(setCurrentOpen(val));
    }

    const currentOpen = useAppSelector(getCurrentOpen);

    const [userRole, setUserRole] = useState<string>("Equity Active PM");

    const dispatch = useDispatch();

    function dispatchShowOcioOptimizationDefinition(val: boolean) {
        dispatch(setShowOcioOptimizationDefinition(val));
    }
    const handleOcioOptimizationDefinition = () => {
        dispatchShowOcioOptimizationDefinition(true);
    };
    const stale = useAppSelector(getAccountId);

    useEffect(() => {
        if (window.location.href.includes("tax")) return;
        fetchPortfolioAction()(dispatch);
        try {
            fetchPortfolioSelectors(stale)(dispatch);
        } catch (error) {
            console.log("toasted");
        }

        const userType = window.location.href.split("/").pop();
        console.log(userType, "userType");

        switch (userType) {
            case "tax":
                setUserRole("Tax Advisor");
                break;
            case "dashboard":
                setUserRole("Equity Quant PM");
                break;
            case "active-equity":
                setUserRole("Equity Active PM");
                break;
            default:
                break;
        }
    }, []);

    const handleMenuItemClick = (item: string) => {
        switch (item) {
            case "Log out":
                navigate("/");
                break;
            case "Tax Advisor":
                setUserRole("Tax Advisor");
                navigate("/tax");
                break;
            case "Equity Quant PM":
                setUserRole("Equity Quant PM");
                navigate("/dashboard");
                break;
            case "Equity Active PM":
                setUserRole("Equity Active PM");
                navigate("/active-equity");
                break;
            default:
                break;
        }
    };

    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("");
    const showOcioOptimizationDefinition = useAppSelector(getShowOcioOptimizationDefinition);
    const portfolioSelectedValue = useAppSelector(getAccountId);
    useEffect(() => {
        try {
            const urlObject = new URL(url);
            const searchParams = new URLSearchParams(urlObject.search);
            if (searchParams.has("tax")) {
                setCategory("Tax");
                return;
            }
            if (searchParams.has("/dashboard")) {
                setCategory("Equity");
                return;
            }
            setCategory("Uncategorized");
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }, []);

    console.log(category, "kyahai");

    useEffect(() => {
        // Find the element with the class name
        const element = document.querySelector(".max");

        // Define the click handler function
        const handleOpenClick = (e) => {
            console.log("Div clicked!");
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

    const handleDropdownClick = (selectedItem) => {
        console.log("Selected item:", selectedItem);
        // Add your logic here
    };

    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const notificationRef = useRef<HTMLImageElement>(null);

    const [showSettings, setShowSettings] = useState<boolean>(false);
    const settingsRef = useRef<HTMLImageElement>(null);

    const refRef = useRef<HTMLImageElement>(null);
    console.log(refRef.current);

    const getButtonStyle = (path: string) => {
        return {
            fontWeight: location.pathname === path ? "bold" : "normal",
        };
    };

    const handleAlternativeResearch = () => {
        navigate("/alternativeInvestment");
    };

    const [appRoles, setAppRoles] = useState<UserRoles | null>(null);

    useEffect(() => {
        api.get("/user/roles").then((res) => {
            setAppRoles(res.data);
        });
    }, []);

    const { userName, userEmail, group } = appRoles || {};

    return (
        <Fade className="app-header-container">
            <header className="header-section">
                <div className="header">
                    <img
                        src={theme.theme == "light" ? "/ACPLogo.svg" : "/dark-ACPLogo.png"}
                        style={{ width: "10rem", marginRight: "1vw" }}
                        alt="Logo"
                    />

                    <section
                        className="middleContent"
                        style={{
                            width: "81%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <nav className="menu">
                            <ul className="dropdown-list">
                                {!window.location.href.includes("tax") && (
                                    <li>
                                        <Button
                                            onClick={() => navigate("/research")}
                                            className="nav-buttons"
                                            style={getButtonStyle("/research")}
                                        >
                                            Research
                                        </Button>
                                    </li>
                                )}
                                {window.location.href.includes("tax") && (
                                    <li>
                                        <CustomDropdown
                                            inline
                                            items={[
                                                {
                                                    id: "option1",
                                                    text: (
                                                        <p
                                                            onClick={() =>
                                                                navigate("/tax-projection")
                                                            }
                                                        >
                                                            Tax-Projection Copilot
                                                        </p>
                                                    ),
                                                },
                                                {
                                                    id: "option2",
                                                    text: (
                                                        <p onClick={() => navigate("/tax")}>
                                                            Tax-Smart Copilot
                                                        </p>
                                                    ),
                                                },
                                                {
                                                    id: "option3",
                                                    text: (
                                                        <p
                                                            onClick={() =>
                                                                handleAlternativeResearch
                                                            }
                                                        >
                                                            Alternative Investment Copilot
                                                        </p>
                                                    ),
                                                },
                                            ]}
                                            label={"Advisor Copilot"}
                                            customClassName="custom-advisor-dropdown"
                                        />
                                    </li>
                                )}

                                <li>
                                    <Button
                                        onClick={() => navigate("/dashboard")}
                                        className="nav-buttons"
                                        style={getButtonStyle("/dashboard")}
                                    >
                                        Portfolio Management
                                    </Button>
                                </li>
                                <li>
                                    <Button
                                        onClick={() => navigate("/performance")}
                                        className="nav-buttons"
                                        style={getButtonStyle("/performance")}
                                    >
                                        Performance
                                    </Button>
                                </li>
                            </ul>
                        </nav>

                        <div className="search">
                            <img
                                onClick={handleOcioOptimizationDefinition}
                                src={"/ocio.svg"}
                                alt="Ocio"
                            />
                            <img src={"/search.svg"} alt="Search" />
                            <img
                                onClick={() => {
                                    setShowNotifications(true);
                                }}
                                ref={notificationRef}
                                src={"/notification.svg"}
                                alt="Notification Bell"
                            />
                            <NotificationDropdown
                                anchor={notificationRef.current!}
                                open={showNotifications}
                                close={setShowNotifications}
                            />
                            <ToggleSwitch width={notificationRef.current?.clientWidth ?? 0} />
                            {showOcioOptimizationDefinition && (
                                <OcioConstructionConfig
                                    selectedPortfolio={portfolioSelectedValue}
                                />
                            )}
                        </div>
                    </section>

                    <ReusableMenu
                        img={"/david.png"}
                        classValue="profile-dorpdown"
                        buttonLabel={userName}
                        onItemClick={handleMenuItemClick}
                        menuItems={menuItems}
                        subHeading={userRole}
                    />
                </div>
            </header>
        </Fade>
    );
};

export default Nav;
