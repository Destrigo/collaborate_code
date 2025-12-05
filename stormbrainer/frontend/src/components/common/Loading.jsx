// frontend/src/components/common/Loading.jsx

import React from 'react';

const Loading = ({ message = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-gray-400">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default Loading;