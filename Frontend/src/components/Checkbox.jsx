const Checkbox = ({ id, ...props }) => (
  <input
    type="checkbox"
    id={id}
    className="h-4 w-4 text-red-500 focus:ring-red-400"
    {...props}
  />
);

export default Checkbox;
