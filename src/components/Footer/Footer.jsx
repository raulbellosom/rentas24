import React from "react";
import { Mail, Phone } from "lucide-react";
import { Brand } from "../../shared/ui";

const Footer = ({ compact = false }) => {
  if (compact) {
    return (
      <footer className="grid min-h-14 items-center bg-brand-950 px-4 text-[11px] text-brand-100 md:grid-cols-[auto_1fr_auto] md:px-8 r24-safe-pb">
        <div className="flex items-center gap-3">
          <Brand theme="dark" showSlogan={false} iconClassName="h-6 w-6" />
        </div>
        <div className="hidden items-center justify-center gap-6 text-brand-200 md:flex">
          <p className="inline-flex items-center gap-2">
            <Phone size={12} className="text-accent-400" />
            322 123 4567
          </p>
          <a
            href="mailto:contacto@rentas24.com"
            className="inline-flex items-center gap-2 transition hover:text-accent-300"
          >
            <Mail size={12} className="text-accent-400" />
            contacto@rentas24.com
          </a>
        </div>
        <div className="text-right text-brand-300">© 2026 Rentas24</div>
      </footer>
    );
  }

  return (
    <footer className="grid gap-3 border-t border-brand-800/60 bg-brand-950 px-4 py-6 text-xs text-brand-100 md:grid-cols-3 md:px-8 r24-safe-pb">
      <div className="flex items-center gap-3">
        <Brand theme="dark" iconClassName="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <p className="inline-flex items-center gap-2">
          <Phone size={13} className="text-accent-400" />
          322 123 4567
        </p>
        <p>
          <a
            href="mailto:contacto@rentas24.com"
            className="inline-flex items-center gap-2 hover:text-accent-300"
          >
            <Mail size={13} className="text-accent-400" />
            contacto@rentas24.com
          </a>
        </p>
      </div>
      <div className="text-brand-300 md:text-right">
        <p>© 2026 Rentas24</p>
        <p>Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
