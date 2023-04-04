import { Label, TextInput } from "flowbite-react";
import {
  HiMail,
  HiEye,
  HiLockClosed,
  HiOutlineMail,
  HiLightBulb,
} from "react-icons/hi";
import React, { useState } from "react";

const AccountSettings = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <h2 className="font-semibold text-xl"> Actualizar correo electrónico</h2>
      <form className="flex flex-col lg:grid grid-cols-2 gap-4 lg:items-end pt-4 pb-10">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Correo electrónico nuevo</Label>
          <div className="relative">
            <TextInput
              type="email"
              id="email"
              name="email"
              icon={HiOutlineMail}
              placeholder="Correo electrónico nuevo"
              className="w-full"
            />
          </div>
        </div>
        <div>
          <button className="hover:text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-600 transition ease-in-out duration-300">
            <HiMail size={16} />
            Enviar correo de verificación
          </button>
        </div>
      </form>
      <hr className="border-gray-300 py-5" />
      <h2 className="font-semibold text-xl"> Actualizar contraseña</h2>
      <form className="flex flex-col md:grid grid-cols-2 md:items-end gap-4 pb-10">
        <div className="w-full">
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <div className="relative">
            <TextInput
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              icon={HiLockClosed}
              placeholder="Contraseña"
              className="w-full"
            />
            <HiEye
              onClick={() => setShowPassword(!showPassword)}
              className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
            />
          </div>
        </div>
        <div className="w-full">
          <Label htmlFor="repeatPassword">Repetir contraseña</Label>
          <div className="relative">
            <TextInput
              type={showPassword ? "text" : "password"}
              id="repeatPassword"
              name="repeatPassword"
              icon={HiLockClosed}
              placeholder="Repetir contraseña"
              className="w-full"
            />
            <HiEye
              onClick={() => setShowPassword(!showPassword)}
              className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
            />
          </div>
        </div>
        <div className="w-full">
          <Label htmlFor="password">Contraseña actual</Label>
          <div className="relative">
            <TextInput
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              icon={HiLockClosed}
              placeholder="Contraseña actual"
              className="w-full"
            />
            <HiEye
              onClick={() => setShowPassword(!showPassword)}
              className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
            />
          </div>
        </div>
        <div>
          <button className="hover:text-white text-center px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-600 transition ease-in-out duration-300">
            <HiLockClosed size={16} />
            Actualizar contraseña
          </button>
        </div>
      </form>
      <hr className="border-gray-300 py-5" />
      <h2 className="font-semibold text-xl"> Desactivar cuenta </h2>
      <p className="text-red-500 whitespace-normal flex gap-4 items-center py-3">
        <span>
          <HiLightBulb size={32} />
        </span>
        Al desactivar tu cuenta dejaras de aparecer en busquedas y en lista de
        contactos de otros usuarios. Tus datos personales no seran eliminados y
        podras volver a activar tu cuenta en cualquier momento iniciando sesion
        nuevamente.
      </p>
      <form className="flex justify-center">
        <button className="hover:text-white text-red-500 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition ease-in-out duration-300">
          <HiLockClosed size={16} />
          Desactivar cuenta
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
