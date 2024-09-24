import React from 'react';

const StatusBadge = ({ status }: { status: 'pending' | 'completed' | 'failed' }) => {
  const statusStyles = {
    pending: 'bg-yellow-500 text-white',
    completed: 'bg-green-500 text-white',
    failed: 'bg-red-500 text-white',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
