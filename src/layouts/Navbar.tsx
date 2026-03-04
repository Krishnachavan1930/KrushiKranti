import { Link } from "react-router-dom";
import { RiSunLine, RiMoonLine, RiMenuLine, RiCloseLine, RiShoppingCartLine, RiHeartLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../shared/hooks";
import { toggleDarkMode } from "../app/uiSlice";
import { LanguageSwitcher } from "../shared/components/LanguageSwitcher";
import { UserMenu } from "./components/UserMenu";
import { NotificationDropdown } from "./components/NotificationDropdown";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.ui);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { itemCount } = useAppSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: t("common.home") },
    { to: "/products", label: t("common.products") },
    { to: "/about", label: t("common.about") },
    { to: "/contact", label: t("common.contact") },
  ];

  return (
    <nav
      className={`sticky top-0 z-[100] border-b backdrop-blur-md transition-colors duration-200 ${isScrolled
        ? "bg-white/95 dark:bg-gray-950/95 border-slate-200 dark:border-slate-800"
        : "bg-white/70 dark:bg-gray-950/70 border-transparent"
        }`}
    >
      <div className="container-custom h-16 flex items-center justify-between">
        {/* Logo - Wordmark only */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <span className="text-primary-600 dark:text-primary-400">Krushi</span>
            <span className="text-accent-500">Kranti</span>
          </span>
        </Link>

        {/* Desktop Nav - Clean & Flat */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold text-slate-600 dark:text-slate-400 active:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons & Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-none"
              title={
                darkMode ? t("common.switch_light") : t("common.switch_dark")
              }
            >
              {darkMode ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

          <Link to="/wishlist" className="p-1.5 text-slate-500 transition-none">
            <RiHeartLine size={18} />
          </Link>

          <Link
            to="/cart"
            className="p-1.5 text-slate-500 transition-none relative"
          >
            <RiShoppingCartLine size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <NotificationDropdown />

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden lg:block" />

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="hidden lg:flex items-center gap-4 ml-2">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                {t("common.login")}
              </Link>
              <Link to="/register" className="btn-primary py-1.5 px-4 text-xs">
                {t("common.register")}
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600"
          >
            {mobileMenuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Flat Transition */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-950 border-t border-slate-100 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 text-center text-sm font-bold border border-slate-200 rounded-lg dark:border-slate-800"
              >
                {t("common.login")}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary p-3 text-center text-sm"
              >
                {t("common.register")}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
