import React from "react";
import { MdModeEdit } from "react-icons/md";

const ShowUser = ({ user, setIsEditUser }) => {
  return (
    <div>
      <div className="flex items-center justify-end">
        {/* <h2 className="font-semibold text-xl">Información de contacto</h2> */}

        <button
          className=" hover:text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-600 transition ease-in-out duration-300"
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
          <p className="font-medium">Telefono:</p>
          <p className="text-primary-500">{user.phone}</p>
        </div>
        {/* Pais, Estado, Codigo Postal, Dirección  */}
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Pais:</p>
          <p className="text-primary-500">México</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Estado:</p>
          <p className="text-primary-500">Jalisco</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Ciudad:</p>
          <p className="text-primary-500">Puerto Vallarta</p>
        </div>
        <div className="col-span-1 flex flex-col gap-1">
          <p className="font-medium">Dirección:</p>
          <p className="text-primary-500">
            Niños Heroes #654, Santo Domingo, Ixtapa
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowUser;
