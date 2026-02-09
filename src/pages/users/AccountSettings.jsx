import { Label, Spinner, TextInput } from "../../shared/ui";
import { HiEye, HiEyeOff, HiLightBulb, HiLockClosed } from "react-icons/hi";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleDisableUser, handleUpdatePassword } from "../../app/api";
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
      notifyError("Para actualizar la contraseña debes llenar todos los campos.");
      return;
    }

    if (pass.newPassword.length < 8) {
      notifyError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (pass.newPassword !== pass.repeatPassword) {
      notifyError("La contraseña nueva no coincide.");
      return;
    }

    setLoading(true);
    const res = await handleUpdatePassword(token, {
      id: user.id,
      password: pass.currentPassword,
      newPassword: pass.newPassword,
    });

    if (res.ok) {
      notifySuccess("Contraseña actualizada con éxito");
      setPass({
        newPassword: "",
        repeatPassword: "",
        currentPassword: "",
      });
      setLoading(false);
      return;
    }

    notifyError(res?.data?.message || res.error || "No se pudo actualizar");
    setLoading(false);
  };

  const handleDisableAccount = async (e) => {
    e.preventDefault();
    if (!confirm) {
      notifyError(
        "Para deshabilitar la cuenta debes confirmar la acción escribiendo tu correo electrónico"
      );
      return;
    }
    if (confirm !== user.email) {
      notifyError("El correo electrónico no coincide");
      return;
    }

    setLoading(true);
    setActive(false);

    const res = await handleDisableUser(token, user.id, { email: confirm });
    if (res.ok) {
      notifySuccess("Cuenta deshabilitada con éxito");
      dispatch(getSignOut());
      setLoading(false);
      return;
    }

    notifyError(res?.data?.message || res.error || "No se pudo deshabilitar");
    setLoading(false);
  };

  return (
    <>
      <div>
        <h2 className="font-semibold text-xl">Actualizar contraseña</h2>
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col md:w-2/3 lg:w-1/2 gap-4 pb-10 pt-4"
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
              {!showPassword ? (
                <HiEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
                />
              ) : (
                <HiEyeOff
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-6 w-6 absolute right-7 md:right-3 top-2 text-gray-400 cursor-pointer hover:text-primary-500"
                />
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <TextInput
              type={showPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              icon={HiLockClosed}
              placeholder="Nueva contraseña"
              value={pass.newPassword}
              onChange={(e) => setPass({ ...pass, newPassword: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="repeatPassword">Repetir contraseña</Label>
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
          </div>
          <div className="flex justify-end">
            <button className="hover:text-white border text-primary-600 border-primary-600 text-center px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-600 transition ease-in-out duration-300">
              <HiLockClosed size={16} />
              Actualizar contraseña
            </button>
          </div>
        </form>
        <hr className="border-gray-300 py-5" />
        <h2 className="font-semibold text-xl">Desactivar cuenta</h2>
        <p className="text-red-500 whitespace-normal flex gap-4 items-center py-3">
          <span>
            <HiLightBulb size={32} />
          </span>
          Al desactivar tu cuenta dejarás de aparecer en búsquedas y listados.
          Tus datos no se eliminan; puedes reactivar al volver a iniciar sesión.
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
                ¿Estás seguro de desactivar tu cuenta?
              </h2>
              <p className="text-red-500 whitespace-normal">
                Escribe tu correo asociado para confirmar.
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
          <Spinner size="xl" ariaLabel="Loading" />
        </div>
      )}
    </>
  );
};

export default AccountSettings;

