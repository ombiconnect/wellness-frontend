// src/Components/ContentManagement/QuadrantTabs.jsx
const QuadrantTabs = ({ activeQuadrant, onQuadrantChange }) => {
  const tabs = [
    { id: "health", label: "Health & Vitality", color: "health" },
    { id: "growth", label: "Inner Growth & Grit", color: "growth" },
    {
      id: "relationships",
      label: "Relationships & Leadership",
      color: "relationships",
    },
    { id: "wealth", label: "Wealth & Freedom", color: "wealth" },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 font-medium ${
            activeQuadrant === tab.id
              ? `text-${tab.color} border-b-2 border-${tab.color}`
              : "text-gray-500"
          }`}
          onClick={() => onQuadrantChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default QuadrantTabs;
