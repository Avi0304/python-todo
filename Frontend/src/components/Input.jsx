const Input = ({ id, type = "text", placeholder, className = "", ...props }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`w-full rounded border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${className}`}
      {...props}
    />
  );
};

export default Input;
