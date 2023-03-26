import React, { useState, useRef, useEffect } from "react";
import {
  Tabs,
  Button,
  Label,
  TextInput,
  Select,
} from "flowbite-react";
import { MdAccountCircle } from "react-icons/md";
import { toast } from "react-hot-toast";
import { updateUser } from "../../app/api";
import { useSelector } from "react-redux";
import { getUpdateProfile } from "../../features/auth/authSlice"
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
      notifySuccess('Usuario actualizado')
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getUpdateProfile(res));
    }
  };

  return (
    <div>
      <div className="flex flex-col h-[88vh] mx-auto  bg-gray-50">
        <div className="w-full bg-teal-400 h-60"></div>
        <div className="w-full h-full grid grid-cols-12 gap-4 p-5">
          <div className="bg-white col-span-2 rounded-2xl border-2 ml-5">
            <div className="flex flex-col items-center ">
              <MdAccountCircle size={100} className="text-slate-300" />
              <p className="text-sm font-bold">Edgar Meneses</p>
            </div>
            <div className="py-6">
              <div className="flex py-4 px-2 border-t justify-between items-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                <p className="text-xs text-center">Opportunities applied</p>
                <span className="text-xs p-1 rounded-full bg-blue-300 text-white font-bold">
                  23
                </span>
              </div>
              <div className="flex py-4 px-2 border-t justify-between items-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                <p className="text-xs text-center">Opportunities applied</p>
                <span className="text-xs p-1 rounded-full bg-blue-300 text-white font-bold">
                  23
                </span>
              </div>
              <div className="flex py-4 px-2 border-t justify-between items-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                <p className="text-xs text-center">Opportunities applied</p>
                <span className="text-xs p-1 rounded-full bg-blue-300 text-white font-bold">
                  23
                </span>
              </div>
              <div className="flex flex-col gap-4 py-4 px-2 border-t justify-center items-center ">
                <div className="border w-full text-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                  <p className="text-xs py-2 px-6">View Public Profile</p>
                </div>
                <div className="border  w-full text-center hover:bg-blue-600 transition delay-75 duration-200 ease-in-out">
                  <p className="text-xs text-blue-600 py-2 px-6 hover:text-white">
                    https://facebook.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-9 col-span-12 rounded-2xl border-2 ">
            <Tabs.Group aria-label="Tabs with underline" style="underline">
              <Tabs.Item title="Account Settings" active={true}>
                <div>
                  <form
                    className="grid grid-cols-12 gap-y-2 gap-x-10 mx-5"
                    onSubmit={handleSubmit}
                    method="PUT"
                  >
                    <div className="col-span-6">
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
                    <div className="col-span-6">
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
                    <div className="col-span-6">
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
                    <div className="col-span-6">
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
                    <div className="col-span-6">
                      <div className="mb-2 block">
                        <Label htmlFor="state" value="Estado" />
                      </div>
                      <Select id="state" required={true} value={users.state}
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
                    <div className="col-span-6">
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
                    <div className="col-span-6">
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
                    <div className="col-span-6">
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
                    <div className="flex justify-end col-span-12 mt-2">
                      <Button type="submit">Actualizar</Button>
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
