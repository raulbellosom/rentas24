import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Brand } from "../../shared/ui";
import Footer from "../../components/Footer/Footer";

export const LegalLayout = () => {
  return (
    <div className="r24-min-h-dvh flex flex-col bg-brand-50">
      <header className="sticky top-0 z-20 border-b border-brand-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 r24-safe-pt">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-brand-700 hover:bg-brand-100"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>
          <Brand theme="light" showSlogan={false} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 r24-safe-pb">
        <Outlet />
      </main>
      <Footer compact />
    </div>
  );
};

export default LegalLayout;
