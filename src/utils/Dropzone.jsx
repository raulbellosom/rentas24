// Dropzone input file

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiDeleteBinLine, RiImageAddFill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { HiDownload, HiOutlineDocumentRemove } from "react-icons/hi";

const Dropzone = ({ file, files, setFiles, filetype = [] }) => {
  const notifyError = (text) => toast.error(text);

  const onDrop = (acceptedFiles) => {
    if (!filetype.find((type) => type === acceptedFiles[0].type)) {
      notifyError("El formato de la imagen no es valido, selecciona otra.");
      return;
    }

    if (acceptedFiles.size > 1000000) {
      notifyError("La imagen es demasiado grande, selecciona otra.");
      return;
    }

    if (file) {
      setFiles(files.map((f) => (f === file ? acceptedFiles[0] : f)));
    } else {
      setFiles([...files, acceptedFiles[0]]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`${
        isDragActive
          ? "border-2 border-dashed border-primary-400"
          : "border-2 border-dashed border-gray-200"
      } flex flex-col justify-center items-center h-40 w-40 rounded-md cursor-pointer relative hover:shadow-inner hover:shadow-gray-500/50 transition ease-in-out ${
        file ? "hover:scale-110 " : ""
      } duration-200 `}
    >
      {/* button to remove item */}
      {file && (
        <button
          onClick={() => setFiles(files.filter((f) => f !== file))}
          className="absolute top-0 right-0 bg-white hover:bg-red-500 transition ease-in-out duration-200 rounded-full p-1 m-2"
        >
          <RiDeleteBinLine className="text-red-400 text-2xl hover:text-white transition ease-in-out duration-200" />
        </button>
      )}

      <input type="file" {...getInputProps()} />
      {isDragActive ? (
        <>
          <p className="text-primary-400 text-sm">Suelta la imagen</p>
          <HiDownload className="text-primary-400 text-4xl" />
        </>
      ) : file ? (
        <img
          className="h-full w-full object-cover rounded-md"
          src={URL.createObjectURL(file)}
          alt="Imagen del articulo"
        />
      ) : (
        <>
          <RiImageAddFill className="text-gray-400 text-4xl" />
          <p className="text-gray-400 text-sm">Arrastra una imagen</p>
          <p className="text-gray-400 text-sm">o has click aquí</p>
        </>
      )}
    </div>
  );
};

export default Dropzone;
