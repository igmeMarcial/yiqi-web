'use client'

import React, { useState } from 'react'

interface TabsProps {
  onFilter: (type: string) => void
}

const Tabs: React.FC<TabsProps> = ({ onFilter }) => {
  const [selectedTab, setSelectedTab] = useState<string>('All')

  const tabs = [
    { label: 'All', value: 'All' },
    { label: 'Online', value: 'ONLINE' },
    { label: 'In Person', value: 'IN_PERSON' }
  ]

  const handleTabClick = (value: string) => {
    setSelectedTab(value)
    onFilter(value)
  }

  return (
    <div className="flex justify-end mt-20">
      <div className="flex bg-gray-800 p-2 rounded-lg space-x-2">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`py-2 px-4 rounded-md text-sm transition-colors ${
              selectedTab === tab.value
                ? 'font-bold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity'
                : 'font-bold bg-gray-700 text-gray-300 hover:bg-gray-600 font-medium '
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
