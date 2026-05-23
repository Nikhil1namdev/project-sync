import React from "react";
import EditableRow from "./EditableRow";

const TRow = ({ data }) => {
  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200 text-sm text-gray-800">
      {Object.values(data).map((value, index) => (
        <EditableRow key={index} initialValue={value} />
      ))}
    </tr>
  );
};

export default TRow;
