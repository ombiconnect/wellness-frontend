// src/Components/ContentManagement/ContentHeader.jsx
const ContentHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
        <p className="text-gray-500">
          Manage habits, challenges, and content across all quadrants
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
          />
        </div>
        <button className="p-2 text-gray-500 hover:text-gray-700 relative">
          <i className="fa-solid fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
