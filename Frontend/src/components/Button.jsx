const Button = ({ children, type = "button", className = "", ...props }) => {
  return (
    <button
      type={type}
      className={`rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
