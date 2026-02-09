import React, { useEffect, useState } from "react";
import { Spinner } from "../../shared/ui";
import { MdAccountCircle } from "react-icons/md";
import { RiImageAddFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, FileText, Shield, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { handleUpdatePhotoProfile } from "../../app/api";
import { getUpdateProfile } from "../../features/auth/authSlice";
import Modal from "../../components/modal/Modal";
import { deleteProfileImage, uploadCover, uploadProfile } from "../../utils/storage";
import EditUser from "./EditUser";
import ShowUser from "./ShowUser";
import AccountSettings from "./AccountSettings";
import UserDocuments from "./UserDocuments";

const tabs = [
  { id: "contact", label: "Informacion", icon: UserRound },
  { id: "security", label: "Configuracion", icon: Shield },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "payments", label: "Pagos", icon: CreditCard },
];

const Users = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [typePhoto, setTypePhoto] = useState("");
  const { token, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);
  const [activeTab, setActiveTab] = useState("contact");

  const toggle = () => {
    setActive((prev) => !prev);
    setPhoto(null);
  };

  const notifyError = (text) => toast.error(text);
  const notifySuccess = (text) => toast.success(text);

  useEffect(() => {
    if (photo?.size > 5 * 1024 * 1024) {
      notifyError("La imagen no debe pesar mas de 5MB.");
      setPhoto(null);
    }
  }, [photo]);

  const onUpdatePhoto = async (e) => {
    e?.preventDefault();
    if (!photo) return;

    setIsLoading(true);
    const url = typePhoto === "profile" ? await uploadProfile(photo) : await uploadCover(photo);
    const res = await handleUpdatePhotoProfile(token, { photo: url, type: typePhoto }, user.id);

    if (res.ok) {
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
    } else {
      notifyError(res?.data?.message || res.error || "No se pudo actualizar");
    }

    setIsLoading(false);
    setPhoto(null);
  };

  const openModal = (type) => {
    setTypePhoto(type);
    setActive(true);
  };

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Perfil de usuario";
  const roleLabel = user?.role?.name || "Cuenta propietaria";

  return (
    <div className="r24-min-h-dvh bg-brand-50">
      <div className="mx-auto w-full max-w-6xl p-3 sm:p-5">
        <section className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-sm">
          <div className="relative h-44 w-full bg-primary-200 sm:h-56 md:h-64">
            <button
              type="button"
              onClick={() => openModal("cover")}
              className="absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-brand-950/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-brand-950/70"
            >
              <RiImageAddFill size={14} />
              Cambiar portada
            </button>

            {user?.photos?.cover ? (
              <img
                src={user.photos.cover}
                alt="cover"
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600" />
            )}

            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-950/30 to-transparent" />
          </div>

          <div className="relative px-4 pb-5 pt-16 sm:px-6">
            <div className="absolute -top-12 left-4 sm:-top-16 sm:left-6">
              <div className="relative">
                {user?.photos?.profile ? (
                  <img
                    src={user.photos.profile}
                    alt="profile"
                    className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-xl sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="rounded-3xl border-4 border-white bg-brand-50 shadow-xl">
                    <MdAccountCircle className="h-24 w-24 text-primary-400 sm:h-32 sm:w-32" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => openModal("profile")}
                  className="absolute -bottom-2 -right-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-white text-brand-700 shadow-md transition hover:bg-brand-100"
                  aria-label="Cambiar foto de perfil"
                >
                  <RiImageAddFill size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold text-brand-950">{fullName}</h1>
                <p className="truncate text-sm text-brand-600">{user?.email || "sin-correo@rentas24.com"}</p>
              </div>
              <span className="inline-flex w-fit items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                {roleLabel}
              </span>
            </div>
          </div>
        </section>

        <nav className="mt-4 overflow-x-auto">
          <div className="inline-flex min-w-full gap-2 rounded-2xl border border-brand-200 bg-white p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const activeTabClass =
                tab.id === activeTab
                  ? "bg-brand-950 text-white shadow-sm"
                  : "bg-brand-100/70 text-brand-700 hover:bg-brand-100";
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id !== "contact") {
                      setIsEditUser(false);
                    }
                    setActiveTab(tab.id);
                  }}
                  className={`inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition ${activeTabClass}`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <section className="mt-4 rounded-3xl border border-brand-200 bg-white p-4 shadow-sm sm:p-6">
          {activeTab === "contact" ? (
            isEditUser ? (
              <EditUser user={user} token={token} setIsEditUser={setIsEditUser} />
            ) : (
              <ShowUser user={user} setIsEditUser={setIsEditUser} />
            )
          ) : null}

          {activeTab === "security" ? <AccountSettings user={user} token={token} /> : null}

          {activeTab === "documents" ? <UserDocuments /> : null}

          {activeTab === "payments" ? (
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 text-brand-700">
              <h2 className="text-lg font-semibold text-brand-950">Metodos de pago</h2>
              <p className="mt-2 text-sm">
                Esta seccion estara disponible proximamente. Aqui podras administrar
                tarjetas y cuentas para pagos y cobros.
              </p>
            </div>
          ) : null}
        </section>
      </div>

      {active ? (
        <Modal active={active} toggle={toggle}>
          <form
            onSubmit={onUpdatePhoto}
            method="patch"
            encType="multipart/form-data"
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-semibold text-brand-950">
                {typePhoto === "profile" ? "Actualizar foto de perfil" : "Actualizar portada"}
              </h3>
              <p className="mt-1 text-sm text-brand-600">
                Usa una imagen clara y en buena calidad. Maximo 5MB.
              </p>
            </div>

            {user?.photos?.[typePhoto] || photo ? (
              photo ? (
                <div className="flex justify-center rounded-2xl border border-brand-200 bg-brand-50 p-3">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="upload_photo"
                    className="h-auto max-h-[60dvh] w-auto max-w-[80vw] rounded-xl object-cover object-center"
                  />
                </div>
              ) : (
                <div className="flex justify-center rounded-2xl border border-brand-200 bg-brand-50 p-3">
                  <img
                    src={typePhoto === "profile" ? user.photos.profile : user.photos.cover}
                    alt="upload_photo"
                    className="h-auto max-h-[60dvh] w-auto max-w-[80vw] rounded-xl object-cover object-center"
                  />
                </div>
              )
            ) : (
              <div className="flex justify-center rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <MdAccountCircle className="h-24 w-24 text-primary-400" />
              </div>
            )}

            {!isLoading ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100">
                  <RiImageAddFill size={16} />
                  Seleccionar imagen
                  <input
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    accept="image/*"
                    max="5242880"
                    className="sr-only"
                  />
                </label>

                {photo ? (
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
                  >
                    Guardar imagen
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="flex justify-center">
                <Spinner size="xl" ariaLabel="Updating" />
              </div>
            )}
          </form>
        </Modal>
      ) : null}
    </div>
  );
};

export default Users;
