import React from "react";
import Button from "./Form/Button";

const PageHeader = ({
  searchPlaceholder = "Search programs by name...",
  searchValue = "",
  onSearchChange,
  statusFilterValue = "all",
  onStatusFilterChange,
  onCreateButtonClick,
  createButtonText = "Create Program",
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <select
            value={statusFilterValue}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <Button
          onClick={onCreateButtonClick}
          size="medium"
          className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i>
          <span>{createButtonText}</span>
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
