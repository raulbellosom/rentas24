import React from "react";
import { useDropzone } from "react-dropzone";
import { RiDeleteBinLine, RiImageAddFill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { HiDownload } from "react-icons/hi";

const Dropzone = ({ file, files, setFiles, filetype = [] }) => {
  const notifyError = (text) => toast.error(text);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 5) {
      notifyError("Solo puedes seleccionar hasta 5 imágenes.");
      return;
    }

    if (files.length + acceptedFiles.length > 5) {
      notifyError(
        "Solo puedes tener hasta 5 imágenes, elimina alguna para continuar. Actualmente tienes " +
          files.length +
          " imágenes seleccionadas. "
      );
      return;
    }

    if (!filetype.find((type) => type === acceptedFiles[0].type)) {
      notifyError("El formato de la imagen no es valido, selecciona otra.");
      return;
    }

    if (acceptedFiles.some((file) => file.size > 1000000)) {
      notifyError("Alguna imagen es demasiado grande, selecciona otra.");
      return;
    }

    if (file) {
      setFiles(files.map((f) => (f === file ? acceptedFiles[0] : f)));
    } else {
      setFiles([...files, ...acceptedFiles]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Permitir múltiples archivos
  });

  return (
    <div
      {...getRootProps()}
      className={`text-center ${
        isDragActive
          ? "border-2 border-dashed border-primary-400"
          : "border-2 border-dashed border-gray-200"
      } flex flex-col justify-center items-center h-40 w-40 rounded-md cursor-pointer relative hover:shadow-inner hover:shadow-gray-500/50 transition ease-in-out ${
        file ? "hover:scale-110 " : ""
      } duration-200 `}
    >
      {file && (
        <div
          onClick={() => setFiles(files.filter((f) => f !== file))}
          className="absolute top-0 right-0 bg-white hover:bg-red-500 transition ease-in-out duration-200 rounded-full p-1 m-2"
        >
          <RiDeleteBinLine className="text-red-400 text-2xl hover:text-white transition ease-in-out duration-200" />
        </div>
      )}

      <input type="file" {...getInputProps()} />
      {isDragActive ? (
        <>
          <p className="text-primary-400 text-sm whitespace-normal">
            Suelta la(s) imagen(es)
          </p>
          <HiDownload className="text-primary-400 text-4xl" />
        </>
      ) : file ? (
        <img
          className="h-full w-full object-cover rounded-md"
          src={
            file.toString().startsWith("h") ? file : URL.createObjectURL(file)
          }
          alt="Imagen del articulo"
        />
      ) : (
        <>
          <RiImageAddFill className="text-gray-400 " />
          <p className="text-gray-400 text-sm whitespace-normal">
            Arrastra una o varias imágenes
          </p>
          <p className="text-gray-400 text-sm whitespace-normal">
            o has click aquí
          </p>
        </>
      )}
    </div>
  );
};

export default Dropzone;
