// src/Components/ContentManagement/StatsOverview.jsx
const StatsOverview = ({ stats }) => {
  const statsConfig = [
    {
      key: "health",
      label: "Health Habits",
      icon: "fa-heart-pulse",
      color: "health",
    },
    {
      key: "growth",
      label: "Growth Habits",
      icon: "fa-brain",
      color: "growth",
    },
    {
      key: "relationships",
      label: "Relationship Habits",
      icon: "fa-people-group",
      color: "relationships",
    },
    {
      key: "wealth",
      label: "Wealth Habits",
      icon: "fa-coins",
      color: "wealth",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat) => (
        <div
          key={stat.key}
          className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-${stat.color}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stats[stat.key]}</h3>
            </div>
            <i
              className={`fa-solid ${stat.icon} text-${stat.color} text-xl`}
            ></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
