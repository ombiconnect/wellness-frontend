import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: "fa-gauge-high", path: "/dashboard" },
    { name: "Members", icon: "fa-users", path: "/members" },
    { name: "Programs", icon: "fa-layer-group", path: "/program" },
    { name: "Focus Areas", icon: "fa-bullseye", path: "/focus-area" },
    { name: "Habits", icon: "fa-repeat", path: "/habit" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 sticky top-0 flex flex-col ">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-800">Wellness</h1>
      </div>

      <nav className="space-y-2 flex-1 ">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`cursor-pointer w-full text-left flex items-center px-4 py-3  rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-blue-50 text-primary"
                : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <i className={`fa-solid ${item.icon} w-6`}></i>
              <span>{item.name}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
