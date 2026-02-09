import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Label, Select, TextInput } from "../../shared/ui";
import { handleUpdateUser } from "../../app/api";
import { getUpdateProfile } from "../../features/auth/authSlice";

const EditUser = ({ token, user, setIsEditUser }) => {
  const dispatch = useDispatch();
  const [users, setUser] = useState({
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    email: user.email || "",
    state: user.address?.state || "",
    city: user.address?.city || "",
    zipCode: user.address?.postal_code || "",
    street: user.address?.street_1 || "",
  });

  const notifyError = (text) => toast.error(text);
  const notifySuccess = (text) => toast.success(text);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!users.firstName || !users.lastName || !users.email || !users.phone) {
      notifyError("Todos los campos obligatorios deben estar completos");
      return;
    }

    const res = await handleUpdateUser(token, users);
    if (res.ok) {
      notifySuccess("Usuario actualizado");
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getUpdateProfile(res));
      setIsEditUser(false);
      return;
    }

    notifyError(res?.data?.message || res.error || "No se pudo actualizar");
  };

  return (
    <form onSubmit={handleSubmit} method="PUT" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand-950">Editar perfil</h2>
          <p className="mt-1 text-sm text-brand-600">
            Actualiza tus datos de contacto para mantener tu cuenta al dia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditUser(false)}
          className="inline-flex w-full items-center justify-center rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 sm:w-auto"
        >
          Cancelar
        </button>
      </div>

      <section className="space-y-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          Informacion principal
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="firstName" value="Nombre" />
            </div>
            <TextInput
              id="firstName"
              type="text"
              required
              placeholder="Nombre"
              value={users.firstName}
              onChange={(e) => setUser({ ...users, firstName: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="lastName" value="Apellido" />
            </div>
            <TextInput
              id="lastName"
              type="text"
              required
              placeholder="Apellido"
              value={users.lastName}
              onChange={(e) => setUser({ ...users, lastName: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone" value="Telefono" />
            </div>
            <TextInput
              id="phone"
              type="tel"
              placeholder="3221234567"
              required
              value={users.phone}
              onChange={(e) => setUser({ ...users, phone: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Correo" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="user@example.com"
              required
              value={users.email}
              onChange={(e) => setUser({ ...users, email: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          Direccion
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="state" value="Estado" />
            </div>
            <Select
              id="state"
              value={users.state}
              onChange={(e) => setUser({ ...users, state: e.target.value })}
            >
              <option value="">Selecciona un estado</option>
              <option>Jalisco</option>
              <option>Chihuahua</option>
              <option>Ciudad de Mexico</option>
              <option>Nayarit</option>
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="city" value="Ciudad" />
            </div>
            <TextInput
              id="city"
              type="text"
              placeholder="Ciudad"
              value={users.city}
              onChange={(e) => setUser({ ...users, city: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="zipCode" value="Codigo Postal" />
            </div>
            <TextInput
              id="zipCode"
              type="text"
              placeholder="12345"
              value={users.zipCode}
              onChange={(e) => setUser({ ...users, zipCode: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="street" value="Calle" />
            </div>
            <TextInput
              id="street"
              type="text"
              placeholder="Av. Ejemplo #123"
              value={users.street}
              onChange={(e) => setUser({ ...users, street: e.target.value })}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setIsEditUser(false)}
          className="inline-flex w-full items-center justify-center rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 sm:w-auto"
        >
          Cancelar cambios
        </button>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 sm:w-auto"
        >
          Guardar perfil
        </button>
      </div>
    </form>
  );
};

export default EditUser;
