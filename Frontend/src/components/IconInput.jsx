import React from "react";
import Input from "./Input"; 

const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <Input className="pl-10" {...props} />
  </div>
);

export default IconInput;
