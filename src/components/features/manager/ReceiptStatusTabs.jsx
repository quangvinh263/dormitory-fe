import React from 'react';
import clsx from 'clsx';

const PaymentStatusTabs = ({ currentTab, onTabChange, counts }) => {
  const tabs = [
    { id: 'pending', label: 'Chưa thanh toán', count: counts.pending },
    { id: 'completed', label: 'Đã thanh toán', count: counts.completed },
  ];

  return (
    <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center w-full md:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "flex-1 md:w-48 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            currentTab === tab.id
              ? "bg-sky-400 text-gray-900 shadow-sm" // Active state
              : "text-gray-500 hover:text-gray-700" // Inactive state
          )}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};

export default PaymentStatusTabs;