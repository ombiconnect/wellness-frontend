const DropDown = ({
  id,
  label,
  required = false,
  optionsObject = [],
  options = [],
  selected = "",
  onChange = () => {},
  className = "",
  placeholder = "Select an option",
  error,
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

      <select
        id={id}
        value={selected}
        onChange={onChange}
        className={`block w-full px-3 py-2 border cursor-pointer ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none ${
          error
            ? "focus:ring-red-500 focus:border-red-500"
            : "focus:ring-blue-500 focus:border-blue-500"
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>

        {Array.isArray(options) &&
          options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}

        {Array.isArray(optionsObject) &&
          optionsObject.map((option, index) => (
            <option key={index} value={option.id}>
              {option.name}
            </option>
          ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DropDown;
