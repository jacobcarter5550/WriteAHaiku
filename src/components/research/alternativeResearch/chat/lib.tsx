import React from "react";
import DOMPurify from "dompurify";

export function transformResponseToHtml(data, sourceDataArray) {
  const response = data.response;
  // console.log(sourceDataArray);
  const numbersArray: number[] = [];
  // Split the response into sections based on the presence of "\n\n"
  const sections = response.split("\n\n");
  let html = "";
  const handleClick = (uri) => {
    window.open(uri, "_blank");
  };
  sections.forEach((section) => {
    // Split into lines for further processing
    const lines = section.split("\n");
    lines.forEach((line) => {
      line = line.replace(/^\s*-\s*/, "");
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const matches = line.match(/\[(\d+)\]/g);
      line = line.replace(/\[(\d+)\]/g, (match, number) => {
        const sourceData = sourceDataArray.find(
          (item) => item.uuid === parseInt(number)
        );
        if (sourceData) {
          return `<a class="source-link" href="${sourceData?.uri}">
          ${number}
        </a>`;
        }
        return match;
      });
      if (matches) {
        matches.forEach((match) => {
          const numberMatch = match.match(/\d+/);
          if (numberMatch) {
            const number = numberMatch[0];
            numbersArray.push(Number(number));
          }
        });
      }
      html += `<p>${line}</p>`;
    });
    html += "<br/>";
  });

  return { html: html, numbersArray: numbersArray };
}

export const HtmlContent = ({ htmlString }) => {
  // Sanitize the HTML string
  const cleanHtml = DOMPurify.sanitize(htmlString);

  // Use dangerouslySetInnerHTML to set the HTML content
  return (
    <div className="tileItem" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  );
};
