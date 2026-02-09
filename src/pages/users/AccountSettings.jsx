import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HiEye, HiEyeOff, HiLockClosed } from "react-icons/hi";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Label, Spinner, TextInput } from "../../shared/ui";
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
    setActive((prev) => !prev);
  };

  const notifyError = (text) => toast.error(text);
  const notifySuccess = (text) => toast.success(text);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!pass.currentPassword || !pass.newPassword || !pass.repeatPassword) {
      notifyError("Para actualizar la contrasena debes llenar todos los campos.");
      return;
    }

    if (pass.newPassword.length < 8) {
      notifyError("La contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (pass.newPassword !== pass.repeatPassword) {
      notifyError("La contrasena nueva no coincide.");
      return;
    }

    setLoading(true);
    const res = await handleUpdatePassword(token, {
      id: user.id,
      password: pass.currentPassword,
      newPassword: pass.newPassword,
    });

    if (res.ok) {
      notifySuccess("Contrasena actualizada con exito");
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
      notifyError("Para deshabilitar la cuenta debes escribir tu correo");
      return;
    }
    if (confirm !== user.email) {
      notifyError("El correo electronico no coincide");
      return;
    }

    setLoading(true);
    setActive(false);

    const res = await handleDisableUser(token, user.id, { email: confirm });
    if (res.ok) {
      notifySuccess("Cuenta deshabilitada con exito");
      dispatch(getSignOut());
      setLoading(false);
      return;
    }

    notifyError(res?.data?.message || res.error || "No se pudo deshabilitar");
    setLoading(false);
  };

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-brand-950">Actualizar contrasena</h2>
              <p className="mt-1 text-sm text-brand-600">
                Usa una contrasena fuerte y unica para proteger tu cuenta.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 sm:w-auto"
            >
              {showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="password">Contrasena actual</Label>
              <TextInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                icon={HiLockClosed}
                placeholder="Contrasena actual"
                value={pass.currentPassword}
                onChange={(e) => setPass({ ...pass, currentPassword: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="newPassword">Nueva contrasena</Label>
              <TextInput
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                icon={HiLockClosed}
                placeholder="Nueva contrasena"
                value={pass.newPassword}
                onChange={(e) => setPass({ ...pass, newPassword: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="repeatPassword">Repetir contrasena</Label>
              <TextInput
                type={showPassword ? "text" : "password"}
                id="repeatPassword"
                name="repeatPassword"
                icon={HiLockClosed}
                placeholder="Repetir contrasena"
                value={pass.repeatPassword}
                onChange={(e) => setPass({ ...pass, repeatPassword: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 sm:w-auto"
              >
                <HiLockClosed size={16} />
                Actualizar contrasena
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
            <ShieldAlert size={13} />
            Zona sensible
          </div>

          <h3 className="mt-4 text-lg font-semibold text-rose-800">Desactivar cuenta</h3>
          <p className="mt-2 text-sm text-rose-700">
            Tu perfil dejara de aparecer en busquedas y listados. Podras reactivarlo al
            volver a iniciar sesion.
          </p>

          <div className="mt-4 rounded-xl border border-rose-200 bg-white p-3 text-sm text-rose-700">
            <p className="inline-flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              Esta accion requiere confirmacion con tu correo electronico.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActive(true)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white"
          >
            <HiLockClosed size={16} />
            Desactivar cuenta
          </button>
        </section>
      </div>

      {active ? (
        <Modal active={active} toggle={toggle}>
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold text-brand-950">Confirmar desactivacion</h2>
              <p className="mt-1 text-sm text-brand-600">
                Escribe tu correo asociado para confirmar la accion.
              </p>
            </div>

            <form onSubmit={handleDisableAccount} className="flex flex-col gap-4">
              <input
                type="email"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-xl border border-brand-200 px-4 py-2"
                placeholder="example@example.com"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white"
              >
                <HiLockClosed size={16} />
                Confirmar desactivacion
              </button>
            </form>
          </div>
        </Modal>
      ) : null}

      {loading ? (
        <div className="fixed left-0 top-0 flex r24-h-dvh w-screen items-center justify-center bg-black bg-opacity-50">
          <Spinner size="xl" ariaLabel="Loading" />
        </div>
      ) : null}
    </>
  );
};

export default AccountSettings;
