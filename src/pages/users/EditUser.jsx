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
      notifyError("Todos los campos son obligatorios");
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
    <form
      className="flex flex-col md:grid md:grid-cols-12 gap-y-2 gap-x-10 mx-5"
      onSubmit={handleSubmit}
      method="PUT"
    >
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="firstName" value="Nombre(s)" />
        </div>
        <TextInput
          id="firstName"
          type="text"
          required
          placeholder="Nombre(s)"
          value={users.firstName}
          onChange={(e) => setUser({ ...users, firstName: e.target.value })}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="lastName" value="Apellido(s)" />
        </div>
        <TextInput
          id="lastName"
          type="text"
          required
          placeholder="Apellido(s)"
          value={users.lastName}
          onChange={(e) => setUser({ ...users, lastName: e.target.value })}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="phone" value="Teléfono" />
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
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="email" value="Correo electrónico" />
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
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="state" value="Estado" />
        </div>
        <Select
          id="state"
          required
          value={users.state}
          onChange={(e) => setUser({ ...users, state: e.target.value })}
        >
          <option value="">Selecciona un estado</option>
          <option>Jalisco</option>
          <option>Chihuahua</option>
          <option>Ciudad de México</option>
          <option>Nayarit</option>
        </Select>
      </div>
      <div className="col-span-12 md:col-span-6">
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
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="zipCode" value="Código Postal" />
        </div>
        <TextInput
          id="zipCode"
          type="text"
          placeholder="12345"
          value={users.zipCode}
          onChange={(e) => setUser({ ...users, zipCode: e.target.value })}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="street" value="Dirección" />
        </div>
        <TextInput
          id="street"
          type="text"
          placeholder="Av. Ejemplo #123"
          value={users.street}
          onChange={(e) => setUser({ ...users, street: e.target.value })}
        />
      </div>
      <div className="flex justify-center md:justify-end gap-4 col-span-12 py-4">
        <button
          className="flex items-center justify-center gap-3 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2 text-center hover:scale-110 transition ease-in-out duration-200 cursor-pointer border border-gray-300"
          type="button"
          onClick={() => setIsEditUser(false)}
        >
          Cancelar
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 flex justify-center items-center gap-2 hover:scale-110 transition ease-in-out duration-200"
          type="submit"
        >
          Actualizar
        </button>
      </div>
    </form>
  );
};

export default EditUser;

