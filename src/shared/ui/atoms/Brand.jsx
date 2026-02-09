import React from "react";
import IconWhite from "../../../assets/icon.svg";
import IconBlue from "../../../assets/icon_alter.svg";

export const Brand = ({
  theme = "light",
  showSlogan = true,
  textClassName = "",
  iconClassName = "h-8 w-8",
}) => {
  const isDark = theme === "dark";
  return (
    <div className="flex items-center gap-2">
      <img
        src={isDark ? IconWhite : IconBlue}
        alt="Rentas24"
        className={iconClassName}
      />
      <div className={textClassName}>
        <p className={`text-base font-extrabold leading-none ${isDark ? "text-white" : "text-brand-950"}`}>
          Rentas24
        </p>
        {showSlogan && (
          <p className={`text-[11px] leading-none ${isDark ? "text-brand-200" : "text-brand-600"}`}>
            Busca, encuentra, renta
          </p>
        )}
      </div>
    </div>
  );
};

export default Brand;
