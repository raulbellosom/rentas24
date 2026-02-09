import React, { useEffect, useMemo, useState } from "react";
import { Toaster, resolveValue, toast } from "react-hot-toast";
import { CheckCircle2, CircleAlert, Info, Loader2, X } from "lucide-react";

const DESKTOP_QUERY = "(min-width: 1024px)";

const toneByType = {
  success: "r24-toast-success",
  error: "r24-toast-error",
  loading: "r24-toast-loading",
  blank: "r24-toast-info",
  custom: "r24-toast-info",
};

const ToastIcon = ({ type }) => {
  if (type === "success") {
    return <CheckCircle2 size={18} className="text-emerald-300" />;
  }
  if (type === "error") {
    return <CircleAlert size={18} className="text-rose-300" />;
  }
  if (type === "loading") {
    return <Loader2 size={18} className="animate-spin text-accent-300" />;
  }
  return <Info size={18} className="text-brand-200" />;
};

export const R24Toaster = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(DESKTOP_QUERY).matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event) => setIsDesktop(event.matches);
    setIsDesktop(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const position = isDesktop ? "bottom-right" : "top-center";
  const containerStyle = useMemo(
    () =>
      isDesktop
        ? {
            right: "max(16px, env(safe-area-inset-right, 0px) + 12px)",
            bottom: "calc(56px + env(safe-area-inset-bottom, 0px) + 14px)",
          }
        : {
            top: "calc(env(safe-area-inset-top, 0px) + 12px)",
          },
    [isDesktop]
  );

  return (
    <Toaster
      position={position}
      gutter={12}
      containerStyle={containerStyle}
      toastOptions={{
        duration: 5200,
        success: { duration: 4200 },
        error: { duration: 7200 },
      }}
    >
      {(t) => (
        <div
          className={`r24-toast-shell ${toneByType[t.type] || toneByType.blank} ${
            t.visible ? "r24-toast-enter" : "r24-toast-exit"
          }`}
          role={t.type === "error" ? "alert" : "status"}
          aria-live={t.type === "error" ? "assertive" : "polite"}
        >
          <div className="r24-toast-icon-wrap">
            <ToastIcon type={t.type} />
          </div>
          <div className="r24-toast-message">{resolveValue(t.message, t)}</div>
          <button
            type="button"
            className="r24-toast-close"
            onClick={() => toast.dismiss(t.id)}
            aria-label="Cerrar notificacion"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </Toaster>
  );
};
