import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, PlusCircle, Sparkles, UserPlus2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cards from "../../components/cards/Cards";
import { routes } from "../../router/paths";
import { Brand, EmptyState } from "../../shared/ui";

const homeHero =
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80";

function Home() {
  const { articles } = useSelector((state) =>
    state?.articles !== undefined ? state.articles : {}
  );
  const { user, token } = useSelector((state) => state.auth);
  const hasSession = Boolean(token && user?.id);

  return (
    <div className="p-3 md:p-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl border border-brand-300/30 bg-brand-950 text-brand-50 shadow-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(38,186,245,0.28),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_8%,rgba(30,153,118,0.18),transparent_40%)]" />
        <div className="relative grid items-center gap-6 p-6 md:p-10 lg:grid-cols-[1.08fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200/30 bg-brand-100/10 px-3 py-1 text-xs uppercase tracking-wider text-brand-100">
              <Sparkles size={14} />
              Panel Appwrite 1.8.1
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Renta más rápido con anuncios listos para publicar.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-brand-100/80 md:text-base">
              Gestiona propiedades, fotos, descripciones y disponibilidad en una
              sola experiencia optimizada para móvil y escritorio.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={hasSession ? routes.ownerPropertyNew : routes.register}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-400"
              >
                {hasSession ? <PlusCircle size={18} /> : <UserPlus2 size={18} />}
                {hasSession ? "Crear anuncio" : "Únete para publicar"}
              </Link>
              <Link
                to={routes.properties}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-200/50 px-5 py-3 text-sm font-semibold text-brand-100 transition hover:bg-brand-900/70"
              >
                Explorar propiedades
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              <img
                src={homeHero}
                alt="Rentas24"
                className="h-full w-full rounded-2xl border border-brand-300/30 object-cover shadow-lg"
              />
              <div className="absolute left-0 top-0 rounded-br-xl border-b border-r border-brand-200/20 bg-brand-950/85 px-3 py-2 backdrop-blur-sm">
                <Brand theme="dark" showSlogan={false} iconClassName="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brand-950">Propiedades destacadas</h2>
          <p className="text-sm text-brand-600">{articles?.length || 0} resultados</p>
        </div>
        {articles?.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article) => (
              <Cards key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              title="No hay propiedades publicadas aún"
              message="Cuando existan publicaciones activas en la base de datos, aparecerán aquí automáticamente."
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
