const InputField = ({
  id,
  type = "text",
  rows = "",
  label,
  icon,
  placeholder,
  value,
  onChange,
  className = "",
  error,
  required = false,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`fa-solid ${icon} text-gray-400`}></i>
          </div>
        )}
        {type === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`${
              icon ? "pl-10" : "pl-3"
            } block w-full px-3 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none ${
              error
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            {...props}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${
              icon ? "pl-10" : "pl-3"
            } block w-full px-3 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none ${
              error
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            {...props}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
