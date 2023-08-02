import React, { useEffect, useState } from "react";
import { Tabs } from "flowbite-react";
import { MdAccountCircle } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getUpdateProfile } from "../../features/auth/authSlice";
import { Spinner } from "flowbite-react";

import { handleUpdatePhotoProfile } from "../../app/api";
import EditUser from "./EditUser";
import { toast } from "react-hot-toast";
import Modal from "../../components/modal/Modal";
import {
  deleteProfileImage,
  uploadCover,
  uploadProfile,
} from "../../utils/firebase";
import ShowUser from "./ShowUser";
import AccountSettings from "./AccountSettings";
import UserDocuments from "./UserDocuments";
import { HiAdjustments, HiClipboardList, HiCreditCard, HiUserCircle } from "react-icons/hi";

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
    setPhoto(null);
  };

  const notifyError = (text) => toast.error(text);
  const notifySuccess = (text) => toast.success(text);

  useEffect(() => {
    if (photo?.size > 5242880) {
      notifyError(
        "La imagen no debe pesar más de 5MB, selecciona otra imagen."
      );
      setPhoto(null);
    }
  }, [photo]);

  const onUpdatePhoto = async (e) => {
    e?.preventDefault();
    setIsLoading(true);

    let url = "";
    if (typePhoto === "profile") {
      url = await uploadProfile(photo);
    } else {
      url = await uploadCover(photo);
    }

    const body = { photo: url, type: typePhoto };

    const res = await handleUpdatePhotoProfile(token, body, user.id);

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
      if (user.photos?.cover && typePhoto === "cover") {
        await deleteProfileImage(user.photos.cover);
      }
      if (user.photos?.profile && typePhoto === "profile") {
        await deleteProfileImage(user.photos.profile);
      }
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
      <div className="flex flex-col min-h-[88vh] mx-auto bg-gray-50 ">
        <div className="w-full bg-primary-200 h-64 relative">
          <div
            onClick={() => openModal("cover")}
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
            src={user?.photos?.cover || "https://picsum.photos/id/10/1280/720/"}
            alt="cover"
            className="w-full h-full object-cover object-center "
          />
          <div className="flex flex-col items-center absolute inset-x-0 -bottom-16">
            <div
              onClick={() => openModal("profile")}
              className="absolute h-40 w-40 rounded-full cursor-pointer bg-black/0 opacity-0 hover:opacity-100 hover:bg-black/50 transition-all ease-in-out duration-200"
            >
              <div className="flex flex-col justify-center items-center h-full w-full">
                <RiImageAddFill size={32} className="text-white" />
                <p>
                  <span className="text-white text-xs">Cambiar imagen</span>
                </p>
              </div>
            </div>
            {user?.photos?.profile ? (
              <div className="bg-white rounded-full">
                <img
                  src={user.photos.profile}
                  alt="profile"
                  className="w-40 h-40 rounded-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="bg-white rounded-full">
                <MdAccountCircle className="text-primary-400 h-40 w-40" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-full gap-4 mt-20 pb-10">
          <Tabs.Group
            aria-label="Tabs with underline"
            style="underline"
            className="w-full whitespace-nowrap flex-nowrap overflow-auto"
          >
            <Tabs.Item
              title="Información de contacto"
              active={true}
              icon={HiUserCircle}
              className="p-10"
            >
              {isEditUser ? (
                <EditUser
                  user={user}
                  token={token}
                  setIsEditUser={setIsEditUser}
                />
              ) : (
                <ShowUser user={user} setIsEditUser={setIsEditUser} />
              )}
            </Tabs.Item>
            <Tabs.Item icon={HiAdjustments} active={true} title="Configuración de la cuenta">
              <AccountSettings user={user} token={token} />
            </Tabs.Item>
            <Tabs.Item icon={HiClipboardList} title="Mis documentos">
              <UserDocuments />
            </Tabs.Item>
            <Tabs.Item icon={HiCreditCard} title="Métodos de pago">Métodos de pago</Tabs.Item>
            {/* <Tabs.Item title="Notifications">Notifications</Tabs.Item> */}
          </Tabs.Group>
        </div>
      </div>
      {/* input file hidden */}
      {active && (
        <Modal active={active} toggle={toggle}>
          <form
            onSubmit={onUpdatePhoto}
            method="patch"
            encType="multipart/form-data"
          >
            {user?.photos[typePhoto] || photo ? (
              photo ? (
                <div className="bg-white rounded-full flex justify-center items-center py-2">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="upload_photo"
                    className="w-auto max-w-[80vw] h-96 object-cover object-center"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-full flex justify-center items-center py-2">
                  <img
                    src={
                      typePhoto === "profile"
                        ? user.photos.profile
                        : user.photos.cover
                    }
                    alt="upload_photo"
                    className="w-auto max-w-[80vw] h-96 object-cover object-center"
                  />
                </div>
              )
            ) : (
              <div className="flex justify-center items-center bg-white rounded-full">
                <MdAccountCircle className="text-primary-400 h-40 w-40" />
              </div>
            )}

            {!isLoading && (
              <input
                type="file"
                onChange={(e) => setPhoto(e.target.files[0])}
                accept="image/*"
                max="5242880"
                size={5242880}
              />
            )}

            {photo && !isLoading && (
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
      )}
    </div>
  );
};

export default Users;
