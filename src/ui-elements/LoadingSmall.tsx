import React, { useEffect, useRef, useState } from "react";

const LoadingSmall: React.FC<{
  setOverride?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOverride }) => {
  return (
    <div className="loadingSmall">
      <div className="loaderHolder">
        <i className="loader8"></i>
      </div>
    </div>
  );
};

export default LoadingSmall;
