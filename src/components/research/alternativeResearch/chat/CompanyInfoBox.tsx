// CompanyInfoBox.tsx
import React from 'react';
import { CompanyInfo } from './types.ts';

interface CompanyInfoBoxProps {
    companyInfo: CompanyInfo;
}

const CompanyInfoBox: React.FC<CompanyInfoBoxProps> = ({ companyInfo }) => {
    console.log(companyInfo);
    return (
        <div className="info-box">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={companyInfo.image}
                    alt={`${companyInfo.companyName} logo`}
                    className="company-logo"
                    style={{ marginRight: '10px' }}
                />
                <a
                    href={companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center' }}
                >
                    <h2 style={{ margin: 0 }}>{companyInfo.companyName}</h2>
                </a>
            </div>
            <p><strong>Symbol:</strong> {companyInfo.symbol}</p>
            <p><strong>Sector:</strong> {companyInfo.sector}</p>
            <p><strong>Industry:</strong> {companyInfo.industry}</p>
            <p><strong>Price:</strong> ${companyInfo.price?.toFixed(2)}</p>
            <p><strong>Beta:</strong> {companyInfo.beta}</p>
            <p><strong>Volume Average:</strong> {companyInfo.volAvg}</p>
            <p><strong>Market Cap:</strong> {companyInfo.mktCap}</p>
            <p><strong>Last Dividend:</strong> {companyInfo.lastDiv}</p>
            <p><strong>Range:</strong> {companyInfo.range}</p>
            <p><strong>Changes:</strong> {companyInfo.changes}</p>
            <p><strong>Currency:</strong> {companyInfo.currency}</p>
            <p><strong>ISIN:</strong> {companyInfo.isin}</p>
            <p><strong>Exchange:</strong> {companyInfo.exchange}</p>
            <p><strong>CEO:</strong> {companyInfo.ceo}</p>
            <p><strong>Country:</strong> {companyInfo.country}</p>
            <p><strong>Full Time Employees:</strong> {companyInfo.fullTimeEmployees}</p>
            <p><strong>Phone:</strong> {companyInfo.phone}</p>
            <p><strong>Address:</strong> {companyInfo.address}, {companyInfo.city}, {companyInfo.state}, {companyInfo.zip}</p>
            <p><strong>Website:</strong> <a href={companyInfo.website} target="_blank" rel="noopener noreferrer">{companyInfo.website}</a></p>
            <p><strong>Description:</strong> {companyInfo.description}</p>
        </div>
    );
};

export default CompanyInfoBox;
