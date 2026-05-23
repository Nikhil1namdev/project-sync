import React, { useState } from 'react';

const EditableRow = ({ initialValue }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <td onClick={() => setIsEditing(true)} className="px-4 py-2 cursor-pointer">
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="border p-1 w-full"
        />
      ) : (
        value
      )}
    </td>
  );
};

export default EditableRow;
