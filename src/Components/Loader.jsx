import React from "react";

const Loader = ({ size = "medium", color = "blue", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-t-blue-500",
    gray: "border-t-gray-500",
    green: "border-t-green-500",
    red: "border-t-red-500",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[60]">
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin ${colorClasses[color]} ${className}`}
      />
    </div>
  );
};

export default Loader;
