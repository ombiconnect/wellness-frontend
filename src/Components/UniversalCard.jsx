import React from "react";

const UniversalCard = ({
  item,
  onEdit,
  onDelete,
  className = "",
  showActions = true,
}) => {
  // Default values
  const defaultIcon = "fa-layer-group";
  const hasColor = item.color && item.color !== "";

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-md ${className}`}
      style={{
        borderLeft: hasColor ? `4px solid ${item.color}` : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: hasColor ? `${item.color}20` : "#dbeafe", // blue-50 default
          }}
        >
          <i
            className={`fa-solid ${item.icon || defaultIcon}`}
            style={{
              color: hasColor ? item.color : "#2563eb",
            }}
          ></i>
        </div>
        {showActions && (
          <div className="flex space-x-2">
            <button
              className="cursor-pointer p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => onEdit(item)}
            >
              <i className="fa-solid fa-pen text-sm"></i>
            </button>
            <button
              className="cursor-pointer p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => onDelete(item)}
            >
              <i className="fa-solid fa-trash text-sm"></i>
            </button>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1 h-6 overflow-hidden leading-6">
        {item.title}
      </h3>

      {/* Status badges section - only show if item has status */}
      {item.status && (
        <div className="flex flex-wrap gap-2 mb-3 h-6">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              item.status
            )}`}
          >
            {getStatusLabel(item.status)}
          </span>
          {item.isDefault && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Default
            </span>
          )}
        </div>
      )}

      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 overflow-hidden leading-relaxed">
        {item.subtitle}
      </p>

      {/* Metrics grid - only show if metrics exist */}
      {item.metrics && Object.keys(item.metrics).length > 0 && (
        <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
          {Object.entries(item.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="text-lg font-bold"
                style={{
                  color: hasColor ? item.color : "#2563eb", // blue-600 default
                }}
              >
                {typeof value === "number" ? value.toLocaleString() : value}
              </div>
              <div className="text-xs text-gray-500 font-medium capitalize">
                {key}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
        Created: {new Date(item.created).toLocaleDateString()}
      </div>
    </div>
  );
};

// Helper functions for status
const getStatusColor = (status) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    archived: "bg-gray-100 text-gray-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const getStatusLabel = (status) => {
  const statusLabels = {
    active: "Active",
    draft: "Draft",
    archived: "Archived",
  };
  return statusLabels[status] || status;
};

export default UniversalCard;
