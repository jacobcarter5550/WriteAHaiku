import React, { useState } from "react";
import Button from "../../../ui-elements/buttonTP.tsx";
import { SecViewOptions } from "./securtityViewTP.tsx";

const ButtonMenu: React.FC<{
  secView: SecViewOptions;
  setSecViewState: React.Dispatch<React.SetStateAction<SecViewOptions>>;
}> = ({ setSecViewState, secView }) => {

  return (
    <section className="buttons">
      <Button
        onClick={() => {
          setSecViewState(SecViewOptions.OVERVIEW);
        }}
        className="pb"
        label="Overview"
      />
      <Button
        onClick={() => {
          setSecViewState(SecViewOptions.BALANCESHEET);
        }}
        className="pb"
        label="Balance Sheet "
      />
      <Button
        onClick={() => {
          setSecViewState(SecViewOptions.CASHFLOW);
        }}
        className="pb"
        label="Cash Flow "
      />
      <Button
        onClick={() => {
          setSecViewState(SecViewOptions.FINANCIALS);
        }}
        className="pb"
        label="Financials "
      />
      <Button onClick={() => {}} className="pb" label="Estimates" />
      <Button onClick={() => {}} className="pb" label="ESG " />
      <Button onClick={() => {}} className="pb" label="Ownership" />
      <Button onClick={() => {}} className="pb" label="Debit Cards" />
      <Button onClick={() => {}} className="pb" label="Peers & Valuation " />
      <Button onClick={() => {}} className="pb" label="Derivatives" />
      <Button onClick={() => {}} className="pb" label="Fillings" />
      <Button onClick={() => {}} className="pb" label="360 Menu" />
    </section>
  );
};

export default ButtonMenu;
