import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    RiMenuLine,
    RiCloseLine,
    RiStoreLine,
    RiSunLine,
    RiMoonLine,
} from 'react-icons/ri';
import { UserMenu } from './components/UserMenu';
import { NotificationDropdown } from './components/NotificationDropdown';
import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';
import { useAppSelector, useAppDispatch } from '../shared/hooks';
import { toggleDarkMode } from '../app/uiSlice';

export interface MenuItem {
    to: string;
    label: string;
    icon: React.ElementType;
}

interface BaseDashboardLayoutProps {
    menuItems: MenuItem[];
    title: string;
    roleLabel?: string;
}

export function BaseDashboardLayout({ menuItems, title, roleLabel }: BaseDashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const dispatch = useAppDispatch();
    const isDark = useAppSelector((s) => s.ui.darkMode);

    const currentPage = menuItems.find((i) =>
        location.pathname === i.to || location.pathname.startsWith(i.to + '/')
    )?.label || 'Overview';

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden font-sans">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-56 flex flex-col bg-white dark:bg-gray-900
                    border-r border-slate-200 dark:border-slate-800
                    lg:static lg:translate-x-0 transition-transform duration-200
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo */}
                <div className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                            <RiStoreLine size={14} className="text-white" />
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                            KrushiKranti
                        </span>
                    </Link>
                    <button
                        className="lg:hidden text-slate-400 p-0.5"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <RiCloseLine size={18} />
                    </button>
                </div>

                {/* Role label */}
                {roleLabel && (
                    <div className="px-5 pt-5 pb-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {roleLabel}
                        </p>
                    </div>
                )}

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                    {menuItems.map((item) => {
                        const isActive =
                            location.pathname === item.to ||
                            (item.to !== '/' && location.pathname.startsWith(item.to + '/'));
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium
                                    ${isActive
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <item.icon size={16} className="shrink-0" />
                                <span className="truncate">{item.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to storefront */}
                <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <RiStoreLine size={16} />
                        <span>Storefront</span>
                    </Link>
                </div>
            </aside>

            {/* ── Main area ─────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-14 shrink-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4">
                    {/* Mobile menu toggle */}
                    <button
                        className="lg:hidden p-1 text-slate-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <RiMenuLine size={20} />
                    </button>

                    {/* Page title */}
                    <div className="flex-1">
                        <h1 className="text-sm font-semibold text-slate-800 dark:text-white">
                            {title} &rsaquo; <span className="text-slate-400 font-normal">{currentPage}</span>
                        </h1>
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-1">
                        {/* Language switcher */}
                        <LanguageSwitcher />

                        {/* Theme toggle */}
                        <button
                            onClick={() => dispatch(toggleDarkMode())}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title={isDark ? 'Switch to light' : 'Switch to dark'}
                        >
                            {isDark ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
                        </button>

                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* Divider */}
                        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

                        {/* User menu */}
                        <UserMenu />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 max-w-screen-xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
