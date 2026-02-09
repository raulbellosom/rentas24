import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js/min";
import { Spinner } from "../../shared/ui";

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return String(Math.random()).slice(2);
};

const normalizeSearchText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const MAX_VISIBLE_ROWS = 7;
const ROW_HEIGHT = 44;
const SEARCH_HEIGHT = 52;
const EMPTY_HEIGHT = 80;

const SelectCountryInput = ({ selectedCountry = {}, getPhoneCode }) => {
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [filterCountry, setFilterCountry] = useState("");

  useEffect(() => {
    const loadCountries = () => {
      setIsLoading(true);
      try {
        const displayNames =
          typeof Intl !== "undefined" && Intl.DisplayNames
            ? new Intl.DisplayNames(["es"], { type: "region" })
            : null;

        const mapped = getCountries()
          .map((iso2) => ({
            id: makeId(),
            iso2,
            name: displayNames?.of(iso2) || iso2,
            phone_code: getCountryCallingCode(iso2),
          }))
          .filter((country) => country.phone_code)
          .sort((a, b) => a.name.localeCompare(b.name, "es"));

        setAllCountries(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    if (!showMenu) return;
    const rafId = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setShowMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowMenu(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showMenu]);

  const countries = useMemo(() => {
    if (!filterCountry) return allCountries;

    const tokens = normalizeSearchText(filterCountry).split(/\s+/).filter(Boolean);

    return allCountries.filter((country) => {
      const name = normalizeSearchText(country.name);
      const iso2 = normalizeSearchText(country.iso2);
      const dialWithPlus = `+${country.phone_code}`;
      const dialNoPlus = String(country.phone_code);

      return tokens.every((token) => {
        const tokenNoPlus = token.replace(/^\+/, "");
        return (
          name.includes(token) ||
          iso2.includes(token) ||
          dialWithPlus.includes(token) ||
          dialNoPlus.includes(tokenNoPlus)
        );
      });
    });
  }, [allCountries, filterCountry]);

  const handleValueChange = (country) => {
    getPhoneCode(country);
    setShowMenu(false);
  };

  const visibleRows = Math.min(Math.max(countries.length, 1), MAX_VISIBLE_ROWS);
  const dropdownHeight =
    SEARCH_HEIGHT + (countries.length > 0 ? visibleRows * ROW_HEIGHT : EMPTY_HEIGHT);

  return (
    <div>
      {isLoading ? (
        <Spinner size="sm" ariaLabel="Countries" />
      ) : (
        <div ref={wrapperRef} className="relative flex cursor-pointer">
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="r24-input-shell r24-input-shell-dark flex w-full items-center justify-between text-left text-sm text-brand-50"
          >
            {Object.keys(selectedCountry).length > 0 ? (
              <span className="flex items-center gap-3 overflow-hidden">
                <span className="inline-flex h-5 min-w-8 items-center justify-center rounded-md bg-brand-800 px-1 text-[10px] uppercase text-brand-100">
                  {selectedCountry.iso2}
                </span>
                <span className="truncate">+{selectedCountry.phone_code} {selectedCountry.name}</span>
              </span>
            ) : (
              <span className="text-brand-300/60">Seleccionar</span>
            )}
            <ChevronDown className="h-4 w-4 text-brand-300" />
          </button>

          {showMenu && (
            <div
              className="absolute left-0 top-[calc(100%+0.45rem)] z-20 w-full min-w-0 overflow-hidden rounded-2xl border border-brand-300/30 bg-brand-950/95 shadow-2xl ring-1 ring-accent-400/20 backdrop-blur"
              style={{ height: `${dropdownHeight}px` }}
            >
              <div className="r24-input-shell r24-input-shell-dark sticky top-0 z-10 rounded-none border-x-0 border-t-0 border-b border-brand-300/30 px-3">
                <Search className="h-4 w-4 text-brand-300/70" />
                <input
                  ref={searchInputRef}
                  className="r24-input-base r24-input-base-dark"
                  type="text"
                  placeholder="Buscar pais, codigo o prefijo (+52, mx)..."
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                />
              </div>

              <div className="h-[calc(100%-52px)] overflow-y-auto">
                {countries.length > 0 ? (
                  countries.map((country) => (
                    <button
                      key={country.id}
                      type="button"
                      className={`flex h-11 w-full items-center justify-between gap-2 border-b border-brand-300/20 px-4 text-sm transition ${
                        country.phone_code === selectedCountry.phone_code
                          ? "bg-accent-500/15 text-accent-100"
                          : "text-brand-100 hover:bg-brand-900/80"
                      }`}
                      onClick={() => handleValueChange(country)}
                    >
                      <span className="flex w-full items-center gap-3 text-left">
                        <span className="inline-flex h-5 min-w-8 items-center justify-center rounded-md bg-brand-100/90 px-1 text-[10px] font-semibold uppercase text-brand-700">
                          {country.iso2}
                        </span>
                        {country.name}
                      </span>
                      <span className="whitespace-nowrap text-brand-300">+ {country.phone_code}</span>
                    </button>
                  ))
                ) : (
                  <div className="flex h-20 items-center justify-center px-4 text-sm text-brand-300">
                    No encontramos paises con ese criterio.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectCountryInput;
