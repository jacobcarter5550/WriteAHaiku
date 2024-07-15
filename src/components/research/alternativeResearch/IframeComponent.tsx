import React from 'react';

const IframeComponent = () => {
  const iframeStyles = {
    width: '100%',
    height: '80vh',
    border: 'none',
  };

  return (
    <iframe
      src="https://alpha.dev/chat"
      style={iframeStyles}
      title="Alpha Dev Chat"
    ></iframe>
  );
};

export default IframeComponent;
