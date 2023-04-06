import React, { useState } from "react";

const UserDocuments = ({ user }) => {
  const [files, setFiles] = useState([]);
  const handleDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };
  return (
    <div>
      <h2 className="font-semibold text-xl"> Actualizar correo electrónico</h2>
      {/* dropzone to uploads files */}
      <form
        onDrag={handleDrop}
        className="flex flex-col lg:grid grid-cols-2 gap-4 lg:items-end pt-4 pb-10"
      >
        <div className="w-40 h-40 bg-primary-200 border-dashed border-4 border-black"></div>
      </form>
    </div>
  );
};

export default UserDocuments;
