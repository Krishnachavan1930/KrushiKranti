import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { label: t("about.stats.farmers"), value: "3,200+" },
    { label: t("about.stats.products"), value: "12,000+" },
    { label: t("about.stats.orders"), value: "85,000+" },
    { label: t("about.stats.states"), value: "18" },
  ];

  const pillars = [
    {
      title: t("about.mission.title"),
      body: t("about.mission.body"),
    },
    {
      title: t("about.vision.title"),
      body: t("about.vision.body"),
    },
    {
      title: t("about.offers.title"),
      body: t("about.offers.body"),
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">
            {t("about.label")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
            {t("about.hero_title")}
            <br />
            <span className="text-green-600">{t("about.hero_highlight")}</span>
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            {t("about.description")}
          </p>
        </div>
      </section>

      {/* Stats row */}
      <section className="bg-green-600 text-white px-4 md:px-8 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm text-green-100 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
            {t("about.drives_us")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t("about.story.title")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            {t("about.story.para1")}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            {t("about.story.para2")}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400"
          >
            {t("about.browse_link")} →
          </Link>
        </div>
      </section>
    </main>
  );
}
