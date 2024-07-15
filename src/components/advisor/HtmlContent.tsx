import React, { useEffect, useState } from 'react';

const HtmlContent = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/content.html')
      .then(response => response.text())
      .then(data => setHtmlContent(data))
      .catch(error => console.error('Error fetching HTML content:', error));
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default HtmlContent;