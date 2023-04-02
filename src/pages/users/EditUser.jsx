import React, { useState, useRef, useEffect } from "react";
import { Tabs, Button, Label, TextInput, Select } from "flowbite-react";
import { MdAccountCircle } from "react-icons/md";
import { toast } from "react-hot-toast";
import { updateUser } from "../../app/api";
import { useSelector } from "react-redux";
import { getUpdateProfile } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

const EditUser = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

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
    const res = await updateUser(token, users);
    console.log(res);
    if (res?.status === 400 || res?.status === 401 || res?.status === 404) {
      notifyError(res.data.message);
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
    <div className="">
      <div className="flex flex-col h-[88vh] mx-auto  ">
        <div className="w-full bg-teal-400 h-60 relative">
          <img
            src="https://flowbite.com/docs/images/blog/image-3.jpg"
            alt="portada"
            className="w-full h-full object-cover object-center "
          />
          <div className="flex flex-col items-center absolute inset-x-0 -bottom-16">
            <div className="bg-primary-600 rounded-full ">
              <MdAccountCircle size={150} className="text-white" />
            </div>
          </div>
        </div>
        <div className="w-full h-full grid grid-cols-12 gap-4 p-5 pt-20 bg-gray-50 ">
          <div className="col-span-12 rounded-xl border-2 py-10">
            <Tabs.Group
              aria-label="Tabs with underline"
              style="underline"
              className="w-full"
            >
              <Tabs.Item title="Account Settings" active={true}>
                <div>
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
                        placeholder="Edgar Eduardo"
                        required={true}
                        value={users.firstName}
                        onChange={(e) =>
                          setUser({ ...users, firstName: e.target.value })
                        }
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
                        placeholder="Meneses Barragán"
                        value={users.lastName}
                        onChange={(e) =>
                          setUser({ ...users, lastName: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="mb-2 block">
                        <Label htmlFor="phone" value="Teléfono" />
                      </div>
                      <TextInput
                        id="phone"
                        type="phone"
                        placeholder="3151090629"
                        required={true}
                        value={users.phone}
                        onChange={(e) =>
                          setUser({ ...users, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="mb-2 block">
                        <Label htmlFor="email" value="Correo electrónico" />
                      </div>
                      <TextInput
                        id="email"
                        type="email"
                        placeholder="edgar@gmail.com"
                        required={true}
                        value={users.email}
                        onChange={(e) =>
                          setUser({ ...users, email: e.target.value })
                        }
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
                        onChange={(e) =>
                          setUser({ ...users, state: e.target.value })
                        }
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
                        placeholder="La Huerta"
                        value={users.city}
                        onChange={(e) =>
                          setUser({ ...users, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="mb-2 block">
                        <Label htmlFor="zipCode" value="Codigo Postal" />
                      </div>
                      <TextInput
                        id="zipcode"
                        type="zipCode"
                        placeholder="48870"
                        value={users.zipCode}
                        onChange={(e) =>
                          setUser({ ...users, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="mb-2 block">
                        <Label htmlFor="street" value="Dirección" />
                      </div>
                      <TextInput
                        id="street"
                        type="street"
                        placeholder="Constitución #35"
                        value={users.street}
                        onChange={(e) =>
                          setUser({ ...users, street: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-center md:justify-end col-span-12 py-4">
                      <button
                        className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        type="submit"
                      >
                        Actualizar
                      </button>
                    </div>
                  </form>
                </div>
              </Tabs.Item>
              <Tabs.Item active={true} title="Company Settings">
                Company Settings
              </Tabs.Item>
              <Tabs.Item title="Documents">Documents</Tabs.Item>
              <Tabs.Item title="Billing">Billing</Tabs.Item>
              <Tabs.Item title="Notifications">Notifications</Tabs.Item>
            </Tabs.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
