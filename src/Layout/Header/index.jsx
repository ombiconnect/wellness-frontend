import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { userLogout } from "../../Thunks/Auth";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { User } = useSelector((state) => state.auth);
  const pageTitles = {
    "/dashboard": {
      title: "Dashboard",
      description:
        "Admin overview of programs, focus areas, challenges, habits, and tasks.",
    },
    "/program": {
      title: "Programs",
      description: "Create and manage programs that group related focus areas.",
    },
    "/focus-area": {
      title: "Focus Areas",
      description:
        "Define focus areas within programs to organize challenges and habits.",
    },
    "/challenge": {
      title: "Challenges",
      description:
        "Create and manage challenges under focus areas to engage users.",
    },
    "/habit": {
      title: "Habits Management",
      description: "Add and manage habits linked to focus areas.",
    },
    "/task": {
      title: "Tasks",
      description:
        "Manage tasks associated with challenges to structure content and progress.",
    },
    "/member": {
      title: "Member Management",
      description:
        "Manage users, their progress, and assignments across programs and challenges.",
    },
  };

  const currentPage = pageTitles[location.pathname] || {
    title: "Dashboard",
    description: "Welcome to your dashboard",
  };

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {currentPage.title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentPage.description}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="flex items-center cursor-pointer">
              <img
                src="/profile.png"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <i className="fa-solid fa-chevron-down ml-2 text-gray-500 text-xs"></i>
            </div>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">{User.Email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
