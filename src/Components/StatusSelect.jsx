const StatusSelect = ({
  id = "program-status",
  label = "Status",
  required = true,
  value,
  onChange,
  className = "",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  selectClassName = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
  options = [
    { value: "DRAFT", label: "Draft" },
    { value: "ACTIVE", label: "Active" },
  ],
  error,
  ...props
}) => {
  const finalSelectClassName = error
    ? selectClassName
        .replace("border-gray-300", "border-red-500")
        .replace("focus:ring-primary", "focus:ring-red-500")
    : selectClassName;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        className={finalSelectClassName}
        {...props}
      >
        <option value="">Select {label.toLowerCase()}...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value.toLocaleLowerCase()}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default StatusSelect;
