import React from "react";

const Card = ({
  program,
  onEdit,
  onDelete,
  className = "",
  showActions = true,
}) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-800",
  };

  const statusLabels = {
    active: "Active",
    draft: "Draft",
    archived: "Archived",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
          <i className="fa-solid fa-layer-group text-blue-600"></i>
        </div>
        {showActions && (
          <div className="flex space-x-2">
            <button
              className="cursor-pointer p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => onEdit(program)}
            >
              <i className="fa-solid fa-pen text-sm"></i>
            </button>
            <button
              className="cursor-pointer p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => onDelete(program)}
            >
              <i className="fa-solid fa-trash text-sm"></i>
            </button>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1 h-6 overflow-hidden leading-6">
        {program.name}
      </h3>

      <div className="flex flex-wrap gap-2 mb-3 h-6">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[program.status]
          }`}
        >
          {statusLabels[program.status]}
        </span>
        {program.isDefault && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Default
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 overflow-hidden leading-relaxed">
        {program.description}
      </p>

      <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {program.quadrants}
          </div>
          <div className="text-xs text-gray-500 font-medium">Quadrants</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {program.habits}
          </div>
          <div className="text-xs text-gray-500 font-medium">Habits</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {program.members.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 font-medium">Members</div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
        Created: {new Date(program.created).toLocaleDateString()}
      </div>
    </div>
  );
};

export default Card;
