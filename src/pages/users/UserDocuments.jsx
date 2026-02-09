import React, { useState } from "react";
import { FileUp, FileText, Trash2 } from "lucide-react";

const UserDocuments = () => {
  const [files, setFiles] = useState([]);

  const onPickFiles = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    if (nextFiles.length <= 0) return;
    setFiles((prev) => [...prev, ...nextFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-brand-950">Documentacion</h2>
        <p className="mt-1 text-sm text-brand-600">
          Sube tus documentos para validar tu cuenta y acelerar revisiones.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-5">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <FileUp size={22} />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-900">Subir archivos</p>
            <p className="text-xs text-brand-600">PDF, JPG o PNG de hasta 5MB</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-brand-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
            Seleccionar archivos
            <input type="file" multiple className="sr-only" onChange={onPickFiles} />
          </label>
        </div>
      </div>

      {files.length > 0 ? (
        <div className="space-y-2 rounded-2xl border border-brand-200 bg-white p-4">
          <p className="text-sm font-semibold text-brand-800">Archivos seleccionados</p>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2"
            >
              <p className="inline-flex min-w-0 items-center gap-2 text-sm text-brand-700">
                <FileText size={14} className="shrink-0" />
                <span className="truncate">{file.name}</span>
              </p>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-100"
                aria-label="Eliminar archivo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default UserDocuments;
