import { Label, Spinner, TextInput } from "flowbite-react";
import {
  HiMail,
  HiEye,
  HiLockClosed,
  HiOutlineMail,
  HiLightBulb,
} from "react-icons/hi";
import React, { useState } from "react";
import { handleDisableUser, handleUpdatePassword } from "../../app/api";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Modal from "../../components/modal/Modal";
import { getSignOut } from "../../features/auth/authSlice";

const AccountSettings = ({ user, token }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [pass, setPass] = useState({
    newPassword: "",
    repeatPassword: "",
    currentPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [confirm, setConfirm] = useState("");
  const toggle = () => {
    setConfirm("");
    setActive(!active);
  };

  const notifyError = (text) => toast.error(text);
  const notifySuccess = (text) => toast.success(text);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!pass.currentPassword || !pass.newPassword || !pass.repeatPassword) {
      return notifyError(
        "Para actualizar la contraseña debes llenar todos los campos."
      );
    }

    if (pass.newPassword.length < 8) {
      return notifyError("La contraseña debe tener al menos 8 caracteres.");
    }

    if (pass.newPassword !== pass.repeatPassword) {
      return notifyError("La contraseña nueva no coinciden");
    }

    setLoading(true);

    const body = {
      id: user.id,
      password: pass.currentPassword,
      newPassword: pass.newPassword,
    };

    const res = await handleUpdatePassword(token, body);
    if (res?.status === 400 || res?.status === 401 || res?.status === 404) {
      notifyError(res.data.message);
      setLoading(false);
    }

    if (res?.status > 404) {
      notifyError("Ocurrió un error, intente nuevamente");
      setLoading(false);
    }

    if (res?.status === 200) {
      notifySuccess("Contraseña actualizada con éxito");
      setLoading(false);
      setPass({
        newPassword: "",
        repeatPassword: "",
        currentPassword: "",
      });
    }
  };

  const handleDisableAccount = async (e) => {
    e.preventDefault();
    if (!confirm) {
      return notifyError(
        "Para deshabilitar la cuenta debes confirmar la acción escribiendo tu correo electrónico"
      );
    }
    if (confirm !== user.email) {
      return notifyError("El correo electrónico no coincide");
    }
    setLoading(true);
    setActive(false);

    const res = await handleDisableUser(token, user.id, { email: confirm });
    if (res?.status === 400 || res?.status === 401 || res?.status === 404) {
      notifyError(res.data.message);
      toggle();
      setLoading(false);
    }

    if (res?.status > 404) {
      notifyError("Ocurrió un error, intente nuevamente");
      toggle();
      setLoading(false);
    }

    if (res?.status === 200) {
      notifySuccess("Cuenta deshabilitada con éxito");
      setLoading(false);
      dispatch(getSignOut());
    }
  };

  return (
    <>
      <div>
        <h2 className="font-semibold text-xl">Actualizar correo electrónico</h2>
        <form className="flex flex-col gap-4 pt-4 pb-10 md:w-2/3 lg:w-1/2">
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
          <div className="flex justify-center">
            <button className="hover:text-white border text-primary-600 border-primary-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-600 transition ease-in-out duration-300">
              <HiMail size={16} />
              Enviar correo de verificación
            </button>
          </div>
        </form>
        <hr className="border-gray-300 py-5" />
        <h2 className="font-semibold text-xl"> Actualizar contraseña</h2>
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col md:w-2/3 lg:w-1/2 gap-4 pb-10"
        >
          <div>
            <Label htmlFor="password">Contraseña actual</Label>
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                icon={HiLockClosed}
                placeholder="Contraseña actual"
                value={pass.currentPassword}
                onChange={(e) =>
                  setPass({ ...pass, currentPassword: e.target.value })
                }
              />
              <HiEye
                onClick={() => setShowPassword(!showPassword)}
                className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                icon={HiLockClosed}
                placeholder="Contraseña"
                value={pass.newPassword}
                onChange={(e) =>
                  setPass({ ...pass, newPassword: e.target.value })
                }
              />
              <HiEye
                onClick={() => setShowPassword(!showPassword)}
                className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="repeatPassword">Repetir contraseña</Label>
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                id="repeatPassword"
                name="repeatPassword"
                icon={HiLockClosed}
                placeholder="Repetir contraseña"
                value={pass.repeatPassword}
                onChange={(e) =>
                  setPass({ ...pass, repeatPassword: e.target.value })
                }
              />
              <HiEye
                onClick={() => setShowPassword(!showPassword)}
                className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button className="hover:text-white border text-primary-600 border-primary-600 text-center px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-600 transition ease-in-out duration-300">
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
          contactos de otros usuarios. Tus datos personales no seran eliminados
          y podras volver a activar tu cuenta en cualquier momento iniciando
          sesion nuevamente.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => setActive(true)}
            className="hover:text-white border border-red-500 text-red-500 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition ease-in-out duration-300"
          >
            <HiLockClosed size={16} />
            Desactivar cuenta
          </button>
        </div>
      </div>
      {active && (
        <Modal active={active} toggle={toggle}>
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-semibold text-xl">
                ¿Estás seguro que deseas desactivar tu cuenta?
              </h2>
              <p className="text-red-500 whitespace-normal flex gap-4 items-center">
                Escribe el correo electornico asosiado a esta cuenta para
                confirmar
              </p>
            </div>
            <form
              onSubmit={handleDisableAccount}
              className="flex justify-center flex-col gap-4"
            >
              <input
                type="email"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2"
                placeholder="example@example.com"
              />
              <button
                type="submit"
                className="hover:text-white border border-red-500 text-red-500 px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:bg-red-600 transition ease-in-out duration-300"
              >
                <HiLockClosed size={16} />
                Desactivar cuenta
              </button>
            </form>
          </div>
        </Modal>
      )}
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <Spinner size="xl" aria-label="Center-aligned spinner example" />
        </div>
      )}
    </>
  );
};

export default AccountSettings;
