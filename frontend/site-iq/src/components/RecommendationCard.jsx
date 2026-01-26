// components/RecommendationCard.jsx
import React from 'react';

const RecommendationCard = ({ content }) => {
  return (
    <div className="bg-purple-50 shadow-md rounded-xl p-6 border border-purple-200">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
      />
    </div>
  );
};

export default RecommendationCard;
