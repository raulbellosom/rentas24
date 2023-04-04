import React, { useState } from "react";
import { Tabs } from "flowbite-react";
import { MdAccountCircle } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getUpdateProfile } from "../../features/auth/authSlice";
import { Spinner } from "flowbite-react";

import { updatePhotoProfile } from "../../app/api";
import EditUser from "./EditUser";
import { toast } from "react-hot-toast";
import Modal from "../../components/modal/Modal";
import {
  deleteProfileImage,
  uploadPortada,
  uploadProfile,
} from "../../utils/firebase";
import ShowUser from "./ShowUser";
import AccountSettings from "./AccountSettings";

const Users = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [typePhoto, setTypePhoto] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);
  const toggle = () => {
    setActive(!active);
  };

  const notifyError = (text) => toast.error(text);
  const notifySuccess = (text) => toast.success(text);

  const onUpdatePhoto = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    let url = "";
    if (typePhoto === "photo") {
      url = await uploadProfile(photo);
    } else {
      url = await uploadPortada(photo);
    }

    const body = { photo: url, type: typePhoto };

    const res = await updatePhotoProfile(token, body, user.id);

    if (
      res?.response?.status === 400 ||
      res?.response?.status === 401 ||
      res?.response?.status === 404
    ) {
      notifyError(res.response.data.message);
    }

    if (res?.status > 404) {
      notifyError("Ocurrió un error, intente nuevamente");
    }

    if (res?.status === 200) {
      await deleteProfileImage(user.photo);
      notifySuccess("Usuario actualizado");
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getUpdateProfile(res));
      setActive(false);
    }
    setIsLoading(false);
    setPhoto(null);
  };

  const openModal = (type) => {
    setTypePhoto(type);
    setActive(true);
  };

  return (
    <div>
      <div className="flex flex-col h-[88vh] mx-auto  ">
        <div className="w-full bg-teal-400 h-60 relative">
          <div
            onClick={() => openModal("portada")}
            className="absolute h-full w-full cursor-pointer bg-black/0 opacity-0 hover:opacity-100 hover:bg-black/50 transition-all ease-in-out duration-200"
          >
            <div className="flex flex-col justify-center items-center h-full w-full">
              <RiImageAddFill size={32} className="text-white" />
              <p>
                <span className="text-white text-xs">Cambiar imagen</span>
              </p>
            </div>
          </div>
          <img
            src={user?.portada || "https://picsum.photos/id/10/1280/720/"}
            alt="portada"
            className="w-full h-full object-cover object-center "
          />
          <div className="flex flex-col items-center absolute inset-x-0 -bottom-16">
            <div
              onClick={() => openModal("photo")}
              className="absolute h-40 w-40 rounded-full cursor-pointer bg-black/0 opacity-0 hover:opacity-100 hover:bg-black/50 transition-all ease-in-out duration-200"
            >
              <div className="flex flex-col justify-center items-center h-full w-full">
                <RiImageAddFill size={32} className="text-white" />
                <p>
                  <span className="text-white text-xs">Cambiar imagen</span>
                </p>
              </div>
            </div>
            {user?.photo ? (
              <div className="bg-white rounded-full">
                <img
                  src={user.photo}
                  alt="profile"
                  className="w-40 h-40 rounded-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="bg-white rounded-full">
                <MdAccountCircle className="text-primary-300 h-40 w-40" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-full grid grid-cols-12 gap-4 pt-24 bg-gray-50 ">
          <div className="col-span-12 rounded-xl">
            <Tabs.Group
              aria-label="Tabs with underline"
              style="underline"
              className="w-full whitespace-nowrap flex-nowrap overflow-auto m-0"
            >
              <Tabs.Item title="Información de contacto" active={true}>
                <div className="pb-10">
                  {isEditUser ? (
                    <EditUser
                      user={user}
                      token={token}
                      setIsEditUser={setIsEditUser}
                    />
                  ) : (
                    <ShowUser user={user} setIsEditUser={setIsEditUser} />
                  )}
                </div>
              </Tabs.Item>
              <Tabs.Item active={true} title="Configuración de la cuenta">
                <div className="pb-10 md:px-6 bg-gray-50">
                  <AccountSettings user={user} />
                </div>
              </Tabs.Item>
              <Tabs.Item title="Documentos">Documentos</Tabs.Item>
              <Tabs.Item title="Metodos de pago">Metodos de pago</Tabs.Item>
              {/* <Tabs.Item title="Notifications">Notifications</Tabs.Item> */}
            </Tabs.Group>
          </div>
        </div>
      </div>
      {/* input file hidden */}
      <Modal active={active} toggle={toggle}>
        <form
          onSubmit={onUpdatePhoto}
          method="patch"
          encType="multipart/form-data"
        >
          {user?.photo ? (
            photo ? (
              <div className="bg-white rounded-full flex justify-center items-center py-2">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="profile"
                  className="w-auto max-w-[72vw] h-72 object-cover object-center"
                />
              </div>
            ) : (
              <div className="bg-white rounded-full flex justify-center items-center py-2">
                <img
                  src={typePhoto === "photo" ? user.photo : user.portada}
                  alt="profile"
                  className="w-auto max-w-[72vw] h-72 object-cover object-center"
                />
              </div>
            )
          ) : (
            <div className="flex justify-center items-center bg-white rounded-full">
              <MdAccountCircle className="text-primary-300 h-40 w-40" />
            </div>
          )}

          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            accept="image/*"
          />

          {photo && (
            <div className="flex justify-center items-center py-2">
              <button
                onClick={(e) => onUpdatePhoto(e)}
                className="bg-primary-600 text-white rounded-md px-4 py-2 mt-4"
              >
                Cambiar foto
              </button>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-center">
              <Spinner
                aria-label="Extra large spinner example"
                color={"info"}
                size="xl"
              />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default Users;
