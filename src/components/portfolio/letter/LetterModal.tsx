/* eslint-disable jsx-a11y/alt-text */
// import fetch from "fetch";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ModalType, {
  ModalTypeEnum,
} from "../../../ui-elements/modals/ModalType.tsx";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Stack } from "@mui/material";
import Button from "../../../ui-elements/buttonTP.tsx";
import { useAppSelector } from "../../../store/index.ts";
import {
  getAuthor,
  getShowLetter,
} from "../../../store/nonPerstistant/selectors.ts";
import { useDispatch } from "react-redux";
import { setShowLetter } from "../../../store/nonPerstistant/index.ts";
import axios from "axios";
import LoadingSmall from "../../../ui-elements/LoadingSmall.tsx";
import {
  getAccountDetails,
  getAccountIdForSummary,
} from "../../../store/portfolio/selector.ts";
import { toast } from "react-toastify";
import { getPDFData } from "../../../store/pdf/selectors.ts";
import ImageComponent from "../../../ui-elements/ImageComponent.tsx";
// import { getPDF } from "../portfolioLib.tsx";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const LetterModal: React.FC<{
  visible: boolean;
  states: {
    pdfData: any;
    binaryPDFData: any;
    setBinaryPDFData: React.Dispatch<any>;
    setPDFData: React.Dispatch<any>;
  };
}> = ({ visible, states }) => {
  const dispatch = useDispatch();

  const author = useAppSelector(getAuthor);

  function dispatchShowLetter(val: boolean) {
    dispatch(setShowLetter(val));
  }

  const persistedPDFData = useAppSelector(getPDFData);
  const close = () => {
    dispatchShowLetter(false);
  };
  const [numPages, setNumPages] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    console.log(numPages, nextNumPages);
    setNumPages(nextNumPages);
  }

  const account = useAppSelector(getAccountIdForSummary);

  async function getPDF() {
    setLoading(true);
    try {
      fetch(
        `${process.env.REACT_APP_AI_URL}/am-report/dynamic?acct_id=${account}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.arrayBuffer()) // Process the response as an ArrayBuffer
        .then((buffer) => {
          states.setBinaryPDFData(buffer);
          const base64String = btoa(
            new Uint8Array(buffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setLoading(false);
          states.setPDFData(base64String); // Now you can use this base64String as the source for your PDF viewer

          return { binaryPDFData: buffer, PDFData: base64String };
        });
    } catch (error) {
      setLoading(false);
      toast.error("Error generating letter");
    }
  }

  const increment = () => {
    if (page !== numPages) {
      setPage((page) => page + 1);
    }
  };

  const decrement = () => {
    if (page !== 1) {
      setPage((page) => page - 1);
    }
  };

  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (persistedPDFData == null && account !== undefined && visible) {
      getPDF();
    }

    if (persistedPDFData) {
      setLoading(false);
      states.setPDFData(persistedPDFData);
    }
  }, [states.pdfData, persistedPDFData, account]);

  useEffect(() => {
    if (states.binaryPDFData) {
      const blob = new Blob([states.binaryPDFData], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setFileUrl(url);

      // Cleanup the blob URL when the component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [states.binaryPDFData]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  function downloadPdf() {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "downloaded.pdf"; // The default name for the downloaded file
    link.click();
  }

  const letterButtons = (
    <Stack
      direction="row-reverse"
      alignItems="center"
      width="97%"
      mt="1em"
      spacing={2}
    >
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          width: "2.5vw",
          minWidth: "2.5vw",
          justifyContent: "center",
        }}
        className={"pop-btnNeg"}
        label={
          (<img src="/page--last.svg" style={{ width: "1.5rem" }} />) as any
        }
        onClick={increment}
      />

      <Button
        style={{
          display: "flex",
          alignItems: "center",
          width: "2.5vw",
          minWidth: "2.5vw",
          justifyContent: "center",
        }}
        className={"pop-btnNeg"}
        label={
          (<img src="/page--first.svg" style={{ width: "1.5rem" }} />) as any
        }
        onClick={decrement}
      />
      {states.pdfData && (
        <>
          <Button
            disable={loading}
            className={"pop-btnNeg"}
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: "2.5vw",
              justifyContent: "center",
            }}
            onClick={downloadPdf}
            label="Download"
          />
          <Button
            disable={loading && !states.binaryPDFData}
            ref={buttonRef}
            label="Regenerate"
            onClick={() => {
              getPDF();
            }}
            className={"pop-btnNeg"}
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: "2.5vw",
              justifyContent: "center",
            }}
          />
          <Button
            style={{ width: "4rem", minWidth: "3rem" }}
            className={"pop-btnNeg"}
            onClick={async () => {
              try {
                const fileUrl = `http://localhost:3000/0045.wav`; // Path to your .wav file in the public directory
                const response = await fetch(fileUrl);
                const blob = await response.blob(); // Create a blob from the fetched file

                const formData = new FormData();
                formData.append("file", blob, "example.wav");

                const requestOptions = {
                  method: "POST",
                  body: formData,
                  redirect: "follow",
                };

                await fetch(
                  "http://0.0.0.0:8006/ava/process-audio",
                  requestOptions
                );
              } catch (error) {}
              try {
                const response = await fetch(
                  " http://0.0.0.0:8006/ava/get-static-audio"
                );
                console.log(response);
              } catch (error) {
                console.log(error);
              }
            }}
            label={
              <ImageComponent
                style={{ width: "1.7rem" }}
                src="microphone-icon.svg"
              />
            }
          />
        </>
      )}
    </Stack>
  );

  return (
    <ModalType
      open={visible}
      buttons={letterButtons}
      type={ModalTypeEnum.SMALL}
      closeDialog={close}
    >
      <h3 style={{ marginBottom: "1vh" }}>{author?.split("+")[0]}</h3>
      <div style={{ width: "200px", height: "200px" }}></div>
      <span style={{ border: !loading ? "1.5px solid black" : "" }}>
        <div className="pdf-document-wrapper" style={{}}>
          {states.pdfData && !loading ? (
            <Document
              file={`data:application/pdf;base64,${states.pdfData}`}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={console.error}
            >
              <Page scale={4} pageNumber={page} />
            </Document>
          ) : (
            <section>
              <LoadingSmall />
              <p>
                You can safely close this window while your letter is generated!
              </p>
            </section>
          )}
        </div>
      </span>
      {states.pdfData && !loading && (
        <p>
          Page {page} of {numPages}
        </p>
      )}
    </ModalType>
  );
};

export default LetterModal;
