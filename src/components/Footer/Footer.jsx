import React from "react";
import logo_full from "../../assets/icon_white.svg";
const Footer = () => {
  return (
    <footer className="grid grid-cols-12 bg-primary-600 text-white py-4 px-4 gap-2 items-center text-center text-xs">
      <div className="col-span-12 sm:col-span-6 lg:col-span-4 justify-center flex gap-2 items-center">
        <img src={logo_full} alt="logo" className="w-12" />
        <div>
          <p className="text-left font-bold text-2xl">Rentas24</p>
          <p className="text-xs">BUSCA, ENCUENTRA, RENTA</p>
        </div>
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-4 flex flex-col gap-2">
        <p>Teléfono: 322 123 4567</p>
        <p>
          Email:{" "}
          <a
            href="mailto:rcontacto@rentas24.com"
            className=" hover:text-primary-300"
          >
            contacto@rentas24.com
          </a>
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4  text-center">
        <p>© 2023 - Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
