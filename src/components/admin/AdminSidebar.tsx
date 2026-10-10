"use client";

import { createContext, useContext, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SIDEBAR_COOKIE } from "@/lib/admin-path";
import { cn } from "@/lib/utils";

/**
 * The panel's sidebar can be put away for more room, like Claude's: one
 * button in the header hides it and the same button brings it back. The
 * choice is kept in a cookie, so the layout renders it already open or
 * closed and nothing jumps on load.
 *
 * Only from 1280px, where the sidebar exists; below that the navigation is
 * the strips above the page and there is nothing to hide.
 */

type Sidebar = { open: boolean; toggle: () => void };

const SidebarContext = createContext<Sidebar | null>(null);

function useSidebar() {
  const sidebar = useContext(SidebarContext);
  if (!sidebar) throw new Error("useSidebar needs a SidebarProvider above it");
  return sidebar;
}

export function SidebarProvider({
  initialOpen,
  children,
}: {
  initialOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(initialOpen);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "open" : "closed"}; path=/; max-age=31536000; samesite=lax`;
  };
  return (
    <SidebarContext.Provider value={{ open, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function SidebarToggle() {
  const { open, toggle } = useSidebar();
  const Icon = open ? PanelLeftClose : PanelLeftOpen;
  const label = open ? "Hide sidebar" : "Show sidebar";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls="admin-sidebar"
      aria-label={label}
      title={label}
      className="hidden size-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white active:scale-[0.96] xl:inline-flex"
    >
      <Icon className="size-5" strokeWidth={1.9} aria-hidden />
    </button>
  );
}

/**
 * The sidebar and the page side by side. Closed, the sidebar's column
 * shrinks to nothing and its links are made invisible, which also takes
 * them out of the tab order, so a keyboard user does not walk through a
 * menu they cannot see. Every `xl:` here: below 1280px the navigation is
 * the strips at the top of the page, and closing changes nothing.
 */
export function SidebarFrame({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const { open } = useSidebar();
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[112rem] px-4 sm:px-6 xl:grid xl:px-8",
        "motion-reduce:transition-none xl:transition-[grid-template-columns,column-gap] xl:duration-300 xl:ease-out",
        open
          ? "xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-8"
          : "xl:grid-cols-[0rem_minmax(0,1fr)] xl:gap-0",
      )}
    >
      <aside
        id="admin-sidebar"
        className={cn(
          "py-5 xl:sticky xl:top-[72px] xl:h-[calc(100vh-72px)] xl:overflow-x-hidden xl:overflow-y-auto xl:py-6",
          "motion-reduce:transition-none xl:transition-opacity xl:duration-200",
          open
            ? "xl:border-line xl:border-r xl:pr-4"
            : "xl:pointer-events-none xl:opacity-0",
        )}
      >
        <div className={open ? undefined : "xl:invisible"}>
          <div className="xl:w-[12rem]">{nav}</div>
        </div>
      </aside>
      <main id="main" className="min-w-0 pb-12 xl:py-6">
        {children}
      </main>
    </div>
  );
}
