import React, { useState } from 'react';

const Toolbar = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // You can add tab logic here
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="w-full bg-background fixed top-0 left-0 right-0 z-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Avatar */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border border-gray-400 text-gray-700 font-semibold flex items-center justify-center">
              E
            </div>
          </div>

          {/* Center: Tabs */}
          <nav className="flex space-x-8 text-sm font-medium ml-20">
            <div
              onClick={() => handleTabClick('analytics')}
              className={`cursor-pointer pb-1 ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Analytics
            </div>
            <div
              onClick={() => handleTabClick('tbd1')}
              className={`cursor-pointer pb-1 ${
                activeTab === 'tbd1'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              TBD
            </div>
            <div
              onClick={() => handleTabClick('tbd2')}
              className={`cursor-pointer pb-1 ${
                activeTab === 'tbd2'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              TBD
            </div>
          </nav>

          {/* Right: Share + Print (not buttons) */}
          <div className="flex space-x-2">
            <div
              onClick={handlePrint}
              className="px-3 py-1.5 border text-sm rounded border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Print Page
            </div>
            <div
            //   onClick={() => alert('Share placeholder')}
              className="px-3 py-1.5 border text-sm rounded border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              Share
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
