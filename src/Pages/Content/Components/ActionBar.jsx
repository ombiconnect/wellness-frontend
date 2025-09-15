// src/Components/ContentManagement/ActionBar.jsx
const ActionBar = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
      <div className="flex space-x-4">
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Levels</option>
          <option>Basic</option>
          <option>Advanced</option>
          <option>Pro</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Status</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
      </div>
      <div className="flex space-x-3">
        <button className="bg-health text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center">
          <i className="fa-solid fa-trophy mr-2"></i> New Challenge
        </button>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center">
          <i className="fa-solid fa-plus mr-2"></i> Add New Habit
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
