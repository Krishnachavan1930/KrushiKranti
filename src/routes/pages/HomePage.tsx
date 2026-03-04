import { Link } from "react-router-dom";
import { FaLeaf, FaTruck, FaShieldAlt, FaHandshake, FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

// Count-up component — animates from 0 to `end` when scrolled into view
function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const startTime = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-8 px-4 bg-white dark:bg-gray-950">
      <span className="text-3xl font-extrabold mb-1" style={{ color: "#16a34a" }}>
        {count}{suffix}
      </span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const features = [
    {
      icon: FaLeaf,
      label: "01",
      title: t("home.fresh_organic"),
      description: t("home.fresh_organic_desc"),
      color: "#16a34a",
      bg: "#f0fdf4",
      darkBg: "rgba(22,163,74,0.08)",
    },
    {
      icon: FaTruck,
      label: "02",
      title: t("home.fast_delivery"),
      description: t("home.fast_delivery_desc"),
      color: "#0284c7",
      bg: "#f0f9ff",
      darkBg: "rgba(2,132,199,0.08)",
    },
    {
      icon: FaShieldAlt,
      label: "03",
      title: t("home.quality_assured"),
      description: t("home.quality_assured_desc"),
      color: "#7c3aed",
      bg: "#faf5ff",
      darkBg: "rgba(124,58,237,0.08)",
    },
    {
      icon: FaHandshake,
      label: "04",
      title: t("home.support_farmers"),
      description: t("home.support_farmers_desc"),
      color: "#d97706",
      bg: "#fffbeb",
      darkBg: "rgba(217,119,6,0.08)",
    },
  ];

  const stats = [
    { end: 50, suffix: "K+", label: "Active Farmers" },
    { end: 200, suffix: "+", label: "Cities Covered" },
    { end: 98, suffix: "%", label: "Quality Pass Rate" },
    { end: 24, suffix: "h", label: "Avg. Delivery Time" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Blurred Video Background */}
      <section className="relative text-white py-20 lg:py-32 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
        >
          <source src="/homepg.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              {t("home.hero_title")}
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl">
              {t("home.hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-8 rounded-lg"
              >
                {t("home.browse_products")}
                <FaArrowRight size={15} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 border border-white text-white font-bold py-3 px-8 rounded-lg"
              >
                {t("home.become_seller")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us — Professional Split Layout */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container-custom">

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div>
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#16a34a", letterSpacing: "0.2em" }}
              >
                Why KrushiKranti
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {t("home.why_choose_us")}
              </h2>
              <div
                className="mt-4 h-1 w-16 rounded-full"
                style={{ background: "#16a34a" }}
              />
            </div>
            <p className="max-w-sm text-slate-500 dark:text-slate-400 text-base leading-relaxed lg:text-right">
              {t("home.why_choose_desc")}
            </p>
          </div>

          {/* Feature Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex items-start gap-5 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Icon Block */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: feature.bg }}
                >
                  <feature.icon size={26} style={{ color: feature.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ color: feature.color }}
                    >
                      {feature.label}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Strip */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            {stats.map((stat) => (
              <StatCounter key={stat.label} end={stat.end} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Curved separator for modern transition */}
      <div className="-mt-8 lg:-mt-12 text-slate-50 dark:text-gray-900">
        <svg
          className="w-full h-12 lg:h-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,256L48,234.7C96,213,192,171,288,154.7C384,139,480,149,576,154.7C672,160,768,160,864,154.7C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* About/Detail Section - Simple & Minimal */}
      <section className="py-20 bg-slate-50 dark:bg-gray-900 border-y border-slate-100 dark:border-slate-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                {t("home.empowering_farmers")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {t("home.empowering_desc")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Direct Farmer Access",
                  "Market Price Data",
                  "Bulk Procurement",
                  "Organic Certification",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold"
              >
                {t("home.learn_more")}
                <FaArrowRight size={15} />
              </Link>
            </div>
            <div className="bg-slate-200 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80"
                alt="Agricultural landscape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Final simple push */}
      <section className="py-20 bg-primary-600 text-white text-center">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-4">{t("home.ready_started")}</h2>
          <p className="text-primary-50 mb-8 max-w-xl mx-auto">
            {t("home.join_thousands")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-accent-400 text-slate-900 font-bold py-3 px-10 rounded-lg"
            >
              {t("auth.create_account")}
            </Link>
            <Link
              to="/products"
              className="border border-white text-white font-bold py-3 px-10 rounded-lg"
            >
              {t("home.browse_products")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
