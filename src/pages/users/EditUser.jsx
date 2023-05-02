import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUpdateProfile } from "../../features/auth/authSlice";
import { handleUpdateUser } from "../../app/api";
import { Label, TextInput, Select } from "flowbite-react";

const EditUser = ({ token, user, setIsEditUser }) => {
  const dispatch = useDispatch();

  const [users, setUser] = useState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    state: user.state,
    city: user.city,
    zipCode: user.zipCode,
    street: user.street,
    password: user.password,
  });

  const notifyError = (text) => toast.error(text);
  const notifySuccess = (text) => toast.success(text);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!users.firstName || !users.lastName || !users.email || !users.phone) {
      return notifyError("Todos los campos son obligatorios");
    }
    const res = await handleUpdateUser(token, users);

    if (
      res?.response.status === 400 ||
      res?.response.status === 401 ||
      res?.response.status === 404
    ) {
      notifyError(res.response.data.message);
    }

    if (res?.status > 404) {
      notifyError("Ocurrió un error, intente nuevamente");
    }

    if (res?.status === 200) {
      notifySuccess("Usuario actualizado");
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getUpdateProfile(res));
    }
  };
  return (
    <form
      className="flex flex-col md:grid md:grid-cols-12 gap-y-2 gap-x-10 mx-5"
      onSubmit={handleSubmit}
      method="PUT"
    >
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="firstName" value="Nombre (s)" />
        </div>
        <TextInput
          id="firstName"
          type="firstName"
          placeholder="Nombre(s)"
          required={true}
          value={users.firstName}
          onChange={(e) => setUser({ ...users, firstName: e.target.value })}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="lastName" value="Apellido (s)" />
        </div>
        <TextInput
          id="lastName"
          type="lastName"
          required={true}
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
          type="phone"
          placeholder="1234567890"
          required={true}
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
          required={true}
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
          required={true}
          value={users.state}
          onChange={(e) => setUser({ ...users, state: e.target.value })}
        >
          <option>Jalisco</option>
          <option>Chihuahua</option>
          <option>CDMX</option>
          <option>Putas</option>
        </Select>
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="city" value="Ciudad" />
        </div>
        <TextInput
          id="city"
          type="city"
          placeholder="Ciuadad"
          value={users.city}
          onChange={(e) => setUser({ ...users, city: e.target.value })}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="mb-2 block">
          <Label htmlFor="zipCode" value="Codigo Postal" />
        </div>
        <TextInput
          id="zipcode"
          type="zipCode"
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
          type="street"
          placeholder="Av. Ejemplo #123"
          value={users.street}
          onChange={(e) => setUser({ ...users, street: e.target.value })}
        />
      </div>
      <div className="flex justify-center md:justify-end col-span-12 py-4">
        <button
          className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2 transition ease-in-out duration-200"
          type="button"
          onClick={() => setIsEditUser(false)}
        >
          Cancelar
        </button>
        <button
          className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          type="submit"
        >
          Actualizar
        </button>
      </div>
    </form>
  );
};

export default EditUser;
