// src/Components/ContentManagement/HabitCard.jsx
const HabitCard = ({ habit }) => {
  const { icon, level, status, title, description, difficulty } = habit;

  const getLevelClass = (level) => {
    switch (level) {
      case "Basic":
        return "bg-green-100 text-health";
      case "Advanced":
        return "bg-yellow-100 text-wealth";
      case "Pro":
        return "bg-purple-100 text-growth";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-primary";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (difficulty) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fa-solid fa-star ${
          i < difficulty ? "text-yellow-400" : "text-gray-300"
        }`}
      ></i>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <i className={`fa-solid ${icon} text-health text-xl`}></i>
        </div>
        <div className="flex space-x-2">
          <span
            className={`px-2 py-1 ${getLevelClass(level)} text-xs rounded-full`}
          >
            {level}
          </span>
          <span
            className={`px-2 py-1 ${getStatusClass(
              status
            )} text-xs rounded-full`}
          >
            {status}
          </span>
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-500">Difficulty:</span>
          <div className="flex">{renderStars(difficulty)}</div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-500">
            <i className="fa-solid fa-pen"></i>
          </button>
          <button className="p-2 text-gray-400 hover:text-red-500">
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
