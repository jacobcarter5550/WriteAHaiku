import React, { useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from "@carbon/react";
import MultiStepForm from './multistep/MultiStepForm.tsx'

export enum InvestmentENUMS {
    CLIENT_ONBOARDING = "Client Onboarding",
    INVESTMENT_OPTIONS = "Investment Options",
    PORTFOLIO_MANAGEMENT = "Portfolio Management",
    COMPLIANCE = "Compliance",
    CLIENT_ENGAGEMENT = "Client Engagement",
    EDUCATION = "Education",
    NOTIFICATIONS = "Notifications",
}

const tabData: InvestmentENUMS[] = [
    InvestmentENUMS.CLIENT_ONBOARDING,
    InvestmentENUMS.INVESTMENT_OPTIONS,
    InvestmentENUMS.PORTFOLIO_MANAGEMENT,
    InvestmentENUMS.COMPLIANCE,
    InvestmentENUMS.CLIENT_ENGAGEMENT,
    InvestmentENUMS.EDUCATION,
    InvestmentENUMS.NOTIFICATIONS,
];

function viewRenderer(secState: InvestmentENUMS) {
    switch (secState) {
        case InvestmentENUMS.CLIENT_ONBOARDING:
            return <MultiStepForm />;
        case InvestmentENUMS.INVESTMENT_OPTIONS:
            return <div>Investment Options</div>;
        case InvestmentENUMS.PORTFOLIO_MANAGEMENT:
            return <div>Portfolio Management</div>;
        case InvestmentENUMS.COMPLIANCE:
            return <div>Compliance</div>;
        case InvestmentENUMS.CLIENT_ENGAGEMENT:
            return <div>Client Engagement</div>;
        case InvestmentENUMS.EDUCATION:
            return <div>Client Education</div>;
        case InvestmentENUMS.NOTIFICATIONS:
            return <div>Notifications</div>;
        default:
            return <div>Invalid view option</div>;
    }
}

const AlternativeResearch: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedView, setSelectedView] = useState<InvestmentENUMS>(InvestmentENUMS.CLIENT_ONBOARDING);

    /**
     * Handles tab change event.
     * @param index - The index of the selected tab.
     */
    const handleTabChange = (index: number): void => {
        console.log(`Tab changed to index: ${index}`);
        setCurrentIndex(index);
        setSelectedView(tabData[index]);
    };

    return (
        <div className='alternative-investment'>
            <Tabs
                selectedIndex={currentIndex}
                onChange={(tabInfo) => handleTabChange(tabInfo.selectedIndex)}
            >
                <TabList aria-label="Financial Data Tabs" style={{ alignItems: "center" }}>
                    {tabData.map((tab, index) => (
                        <Tab style={{ margin: "0 0.2rem 0", paddingBottom: "3px" }} key={index}>
                            {tab}
                        </Tab>
                    ))}
                </TabList>
            </Tabs>
            <div className="security-view-tab-body">
                {viewRenderer(selectedView)}
            </div>
        </div>
    );
};

export default AlternativeResearch;
