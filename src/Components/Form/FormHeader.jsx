const FormHeader = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center">
        <h1 className="ml-3 text-2xl font-bold text-gray-900">
          Wellness Admin Portal
        </h1>
      </div>
      {title && (
        <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
      )}
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default FormHeader;
