import React from "react";
import { Mail, MapPin, Pencil, Phone, UserRound } from "lucide-react";

const formatValue = (value) => {
  if (value === null || value === undefined) return "No registrado";
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : "No registrado";
};

const ShowUser = ({ user, setIsEditUser }) => {
  const fullAddress = [
    user.address?.street_1,
    user.address?.number_ext,
    user.address?.colony,
    user.address?.city,
    user.address?.state,
    user.address?.country,
    user.address?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  const fields = [
    { label: "Nombre", value: user.firstName, icon: UserRound },
    { label: "Apellido", value: user.lastName, icon: UserRound },
    { label: "Correo", value: user.email, icon: Mail },
    { label: "Telefono", value: user.phone, icon: Phone },
    { label: "Pais", value: user.address?.country, icon: MapPin },
    { label: "Estado", value: user.address?.state, icon: MapPin },
    { label: "Ciudad", value: user.address?.city, icon: MapPin },
    { label: "Direccion", value: fullAddress, icon: MapPin },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand-950">Informacion de contacto</h2>
          <p className="mt-1 text-sm text-brand-600">
            Datos visibles en tu perfil de propietario y cuenta.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 sm:w-auto"
          onClick={() => setIsEditUser(true)}
        >
          <Pencil size={15} />
          Editar perfil
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => {
          const Icon = field.icon;
          const value = formatValue(field.value);
          const mutedValue = value === "No registrado";

          return (
            <article
              key={field.label}
              className="rounded-2xl border border-brand-200 bg-brand-50 p-4"
            >
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
                <Icon size={14} className="text-brand-500" />
                {field.label}
              </p>
              <p className={`mt-2 text-sm font-medium ${mutedValue ? "text-brand-500" : "text-brand-900"}`}>
                {value}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ShowUser;
