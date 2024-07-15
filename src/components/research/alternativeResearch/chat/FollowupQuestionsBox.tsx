import React, { useEffect, useState } from 'react';
import './FollowupQuestionsBox.css';

interface FollowupQuestionsBoxProps {
  followups: string[];
  onPromptClick: (promptText: string) => void;
}

const FollowupQuestionsBox: React.FC<FollowupQuestionsBoxProps> = ({ followups, onPromptClick }) => {
  const [visibleFollowups, setVisibleFollowups] = useState<string[]>([]);

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];

    followups.forEach((followup, index) => {
      const timeoutId = setTimeout(() => {
        setVisibleFollowups(prev => [...prev, followup]);
      }, index * 200); // Adjust the delay as needed
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [followups]);

  if (followups.length === 0) {
    return null;
  }

  return (
    <div className="followup-questions-box">
      <h3 className="followup-title">Related</h3>
      <ul className="followup-list">
        {visibleFollowups.map((followup, index) => (
          <li key={index} className="followup-item" onClick={() => onPromptClick(followup)}>
            <span>{followup}</span>
            <span className="plus-sign">+</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowupQuestionsBox;
