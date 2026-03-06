import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiTarget, FiUsers, FiShoppingBag } from "react-icons/fi";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
            alt="Agricultural landscape"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <p className="text-primary-400 font-bold uppercase tracking-[0.3em] mb-4 animate-fade-in-down">
            {t("about.intro_subtitle")}
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
            {t("about.hero_title")}{" "}
            <span className="text-primary-500">{t("about.hero_highlight")}</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
            {t("about.hero_tagline")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-600/20 flex items-center gap-2 group"
            >
              <FiShoppingBag className="group-hover:translate-x-1 transition-transform" />
              {t("about.browse_link")}
            </Link>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold">
                  <FiCheckCircle />
                  {t("about.vision_label")}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                  {t("about.vision_title")}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t("about.description")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <FiTarget className="text-primary-600 mb-4" size={24} />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("about.mission_label")}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("about.mission_desc")}</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <FaHistory className="text-primary-600 mb-4" size={24} />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("about.history_label")}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t("about.history_desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <img
                  src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=800&auto=format&fit=crop"
                  alt="Fresh produce"
                  className="rounded-3xl object-cover h-64 w-full shadow-2xl"
                />
                <div className="bg-[#fde176] p-8 rounded-3xl text-slate-900">
                  <p className="text-4xl font-black mb-1">100%</p>
                  <p className="text-sm font-bold uppercase tracking-wider">{t("about.quality_guarantee")}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-primary-600 p-8 rounded-3xl text-white">
                  <FiUsers size={32} className="mb-4" />
                  <p className="text-2xl font-black leading-tight">{t("about.community_focus")}</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop"
                  alt="Farmer at work"
                  className="rounded-3xl object-cover h-80 w-full shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values / Why Us */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-16">
            {t("about.drives_us")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                key: "transparency",
                icon: FiCheckCircle
              },
              {
                key: "impact",
                icon: FiTarget
              },
              {
                key: "innovation",
                icon: FaHistory
              }
            ].map((value, idx) => (
              <div key={idx} className="group p-10 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 text-left">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <value.icon className="text-primary-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {t(`about.value_title_${value.key}`)}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t(`about.value_desc_${value.key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
