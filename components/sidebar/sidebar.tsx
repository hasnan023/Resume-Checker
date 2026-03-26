"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Upload,
  Users,
  Bookmark,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Upload Resume", href: "/upload", icon: Upload },
  { name: "All Candidates", href: "/fileuploaded", icon: Users },
  { name: "Shortlisted", href: "/shortlisted", icon: Bookmark },
  { name: "Resume Analysis", href: "/analysis", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = () => {
    if (theme === 'system') {
      return systemTheme === 'dark' ? <Moon className="w-[18px] h-[18px] flex-shrink-0" /> : <Sun className="w-[18px] h-[18px] flex-shrink-0" />;
    }
    return theme === 'dark' ? <Moon className="w-[18px] h-[18px] flex-shrink-0" /> : <Sun className="w-[18px] h-[18px] flex-shrink-0" />;
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`
          hidden md:flex flex-col
          bg-card border-r border-border
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[68px]" : "w-[220px]"}
          min-h-screen relative
        `}
      >
        {/* Logo */}
        <div
          className={`
            flex items-center gap-2.5 h-16 px-4
            border-b border-border
            ${collapsed ? "justify-center px-0" : ""}
          `}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-[15px] text-foreground tracking-tight whitespace-nowrap">
              Resume Reader
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5">
          {navItems.map(({ name, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium transition-all duration-150
                  ${collapsed ? "justify-center px-2" : ""}
                  ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }
                `}
                title={collapsed ? name : undefined}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                  }`}
                />
                {!collapsed && (
                  <span className="whitespace-nowrap">{name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="px-2 pb-4 space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            className={`
              w-full flex items-center gap-3 rounded-lg px-3 py-2.5
              text-sm font-medium text-muted-foreground
              hover:bg-accent hover:text-accent-foreground
              transition-all duration-150
              ${collapsed ? "justify-center px-2" : ""}
            `}
            title={collapsed ? `Theme: ${theme}` : `Current theme: ${theme}`}
          >
            {!mounted ? (
              <div className="w-[18px] h-[18px] flex-shrink-0" />
            ) : theme === 'system' ? (
              <Monitor className="w-[18px] h-[18px] flex-shrink-0" />
            ) : (
              getThemeIcon()
            )}
            {!collapsed && mounted && (
              <span> {theme === 'system' ? 'System' : theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            )}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              w-full flex items-center gap-3 rounded-lg px-3 py-2.5
              text-sm font-medium text-muted-foreground
              hover:bg-accent hover:text-accent-foreground
              transition-all duration-150
              ${collapsed ? "justify-center px-2" : ""}
            `}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around items-center h-16 px-2">
        {navItems.slice(0, 5).map(({ name, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center gap-1 px-2 py-1 rounded-lg
                transition-colors duration-150 min-w-[48px]
                ${active ? "text-foreground" : "text-muted-foreground"}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}