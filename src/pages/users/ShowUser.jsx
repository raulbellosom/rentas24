import React from "react";
import { MdModeEdit } from "react-icons/md";

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

  return (
    <div>
      <div className="flex items-center justify-end">
        <button
          className="hover:text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-600 transition ease-in-out duration-300"
          onClick={() => setIsEditUser(true)}
        >
          <MdModeEdit size={16} />
          Editar
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:grid grid-cols-2 md:gap-5 text-md pl-3 whitespace-normal">
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Nombre(s):</p>
          <p className="text-primary-500">{user.firstName}</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Apellido(s):</p>
          <p className="text-primary-500">{user.lastName}</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Email:</p>
          <p className="text-primary-500">{user.email}</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Teléfono:</p>
          <p className="text-primary-500">{user.phone}</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">País:</p>
          <p className="text-primary-500">{user.address?.country || "-"}</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Estado:</p>
          <p className="text-primary-500">{user.address?.state || "-"}</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Ciudad:</p>
          <p className="text-primary-500">{user.address?.city || "-"}</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Dirección:</p>
          <p className="text-primary-500">{fullAddress || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowUser;
