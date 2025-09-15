const NoData = ({ name, icon, noMatch = false }) => {
  if (noMatch) {
    name = `No ${name} found with the specified filter`;
  } else {
    name = `No ${name} created yet`;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-full p-8 text-center bg-white rounded-lg border border-gray-200">
        <i className={`fa-solid ${icon} text-4xl text-gray-300 mb-2`}></i>
        <h3 className="text-lg font-medium text-gray-500">{name}</h3>
        {noMatch == false && (
          <p className="text-gray-400 mt-1">
            Create your first {name} to get started
          </p>
        )}
      </div>
    </div>
  );
};
export default NoData;
