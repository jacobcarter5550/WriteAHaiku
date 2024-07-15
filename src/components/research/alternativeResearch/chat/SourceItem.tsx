import React from "react";

const SourceItem: React.FC<{
  sourceItemData: any | null;
}> = ({ sourceItemData }) => {
  function getDomainWithoutSubdomain(url: string) {
    try {
      const parsedUrl = new URL(url);
      const parts = parsedUrl.hostname.split(".");
      return parts.length >= 2 ? parts[0] : parsedUrl.hostname;
    } catch (error) {
      console.error("Error parsing URL:", error);
      return "Unknown";
    }
  }
  return (
    <div
      className="source-item"
      onClick={() => window.open(sourceItemData?.uri, "_blank")}
    >
      <div>
        {sourceItemData?.title?.length > 35
          ? sourceItemData?.title?.slice(0, 35) + "..."
          : sourceItemData?.title}
      </div>
      <div className="source-link-box">
        <img
          src={
            sourceItemData?.source_metadata?.favicon
              ? sourceItemData?.source_metadata?.favicon
              : "/sourceLinkIcon.svg"
          }
          alt="source link"
        />
        <div>
          {getDomainWithoutSubdomain(
            sourceItemData?.source_metadata?.displayed_link
          )?.length > 10
            ? getDomainWithoutSubdomain(
                sourceItemData?.source_metadata?.displayed_link
              ).slice(0, 8) + "..."
            : getDomainWithoutSubdomain(
                sourceItemData?.source_metadata?.displayed_link
              )}
        </div>
        <div> {sourceItemData?.uuid}</div>
      </div>
    </div>
  );
};

export default SourceItem;
