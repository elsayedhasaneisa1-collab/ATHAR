"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ATHAR_THEMES, DEFAULT_SUPPORT_CONTACTS, type AdminRole, type MembershipCode } from "@/lib/constants";

export interface ClientUser {
  id: string;
  username: string;
  phone: string;
  email: string | null;
  governorate: string;
  role: AdminRole;
  accountStatus: string;
  membershipPlan: MembershipCode;
  membershipStartsAt: string | null;
  membershipExpiresAt: string | null;
  verificationStatus: string;
  verificationBadge: string | null;
  onboardingCompleted: boolean;
  bio: string | null;
  publicProfile: boolean;
  publicLinks: Array<{ label: string; url: string }>;
  avatarUrl: string;
  canUploadAvatar: boolean;
  createdAt: string;
}

export interface ClientPlan {
  code: MembershipCode;
  nameAr: string;
  priceEgp: number;
  invitationLimit: number;
  invitationLimitScope: string;
  habitLimit: number;
  ogImageLimit: number;
  canVerify: boolean;
  canUploadAvatar: boolean;
  canUseStudio: boolean;
  canCreatePrivateCampaign: boolean;
}

export interface ClientSettings {
  prayerCity: string;
  prayerMethod: number;
  hijriAdjustment: number;
  quranFontSize: number;
  lastQuranSurah: number;
  lastQuranAyah: number;
  khatmaPlanDays: number;
  khatmaCurrentJuz: number;
  notificationsSystem: boolean;
  notificationsMembership: boolean;
  notificationsCampaigns: boolean;
}

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

interface AtharContextValue {
  user: ClientUser | null;
  plan: ClientPlan | null;
  settings: ClientSettings | null;
  unreadNotifications: number;
  loadingAuth: boolean;
  theme: string;
  setTheme: (themeId: string) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  toast: (item: Omit<ToastItem, "id">) => void;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
  supportContacts: typeof DEFAULT_SUPPORT_CONTACTS;
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
}

const AtharContext = createContext<AtharContextValue | null>(null);

function resolveAppliedTheme(themeId: string): string {
  if (themeId === "system") {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "midnight-dark";
  }
  return themeId;
}

export function AtharProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [plan, setPlan] = useState<ClientPlan | null>(null);
  const [settings, setSettings] = useState<ClientSettings | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [theme, setThemeState] = useState("midnight-dark");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [supportContacts, setSupportContacts] = useState(DEFAULT_SUPPORT_CONTACTS);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { ...item, id }]);
      setTimeout(() => dismissToast(id), 4500);
    },
    [dismissToast]
  );

  const setTheme = useCallback((themeId: string) => {
    const valid = ATHAR_THEMES.some((t) => t.id === themeId) ? themeId : "midnight-dark";
    setThemeState(valid);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("athar_theme", valid);
      } catch {
        // Ignore storage restrictions
      }
      document.documentElement.setAttribute("data-theme", resolveAppliedTheme(valid));
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setUser(data.user || null);
      setPlan(data.plan || null);
      setSettings(data.settings || null);
      setUnreadNotifications(Number(data.unreadNotifications || 0));
    } catch {
      // Offline / transient
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setPlan(null);
      setSettings(null);
      setUnreadNotifications(0);
      setShowOnboarding(false);
      toast({ type: "success", title: "تم تسجيل الخروج بأمان" });
    }
  }, [toast]);

  useEffect(() => {
    // Load local theme preference immediately (zero DB call)
    try {
      const saved = window.localStorage.getItem("athar_theme");
      if (saved && ATHAR_THEMES.some((t) => t.id === saved)) {
        setThemeState(saved);
        document.documentElement.setAttribute("data-theme", resolveAppliedTheme(saved));
      }
    } catch {
      // Ignore
    }

    refreshUser();

    // Load dynamic support links once
    fetch("/api/support")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.contacts) setSupportContacts({ ...DEFAULT_SUPPORT_CONTACTS, ...d.contacts });
      })
      .catch(() => undefined);

    // Register PWA Service Worker safely
    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, [refreshUser]);

  return (
    <AtharContext.Provider
      value={{
        user,
        plan,
        settings,
        unreadNotifications,
        loadingAuth,
        theme,
        setTheme,
        refreshUser,
        logout,
        toast,
        toasts,
        dismissToast,
        supportContacts,
        showOnboarding,
        setShowOnboarding,
      }}
    >
      {children}
    </AtharContext.Provider>
  );
}

export function useAthar() {
  const ctx = useContext(AtharContext);
  if (!ctx) throw new Error("useAthar must be used within AtharProvider");
  return ctx;
}
