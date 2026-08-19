import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

// ─── Storage key ─────────────────────────────────────────────────────────────

const USERS_KEY = "nutriflex_users";
const SESSION_KEY = "nutriflex_session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

/** Very simple hash — good enough for a demo without a backend. */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
}

// Pre-computed hash for "demo1234" — avoids stale localStorage issues
const DEMO_HASH = simpleHash("demo1234");

const DEMO_USER: StoredUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@nutriflex.ai",
  passwordHash: DEMO_HASH,
};

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const stored: StoredUser[] = raw ? (JSON.parse(raw) as StoredUser[]) : [];
    // Always ensure demo account exists with correct hash
    const hasDemo = stored.some(u => u.email === DEMO_USER.email);
    if (!hasDemo) {
      const updated = [DEMO_USER, ...stored];
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
      return updated;
    }
    // Fix demo hash if it was stored with wrong value
    const fixed = stored.map(u =>
      u.email === DEMO_USER.email ? { ...u, passwordHash: DEMO_HASH } : u
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(fixed));
    return fixed;
  } catch { return [DEMO_USER]; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

function writeSession(user: AuthUser, remember: boolean) {
  const val = JSON.stringify(user);
  sessionStorage.setItem(SESSION_KEY, val);
  if (remember) localStorage.setItem(SESSION_KEY, val);
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession());

  const login = useCallback(async (
    email: string,
    password: string,
    remember: boolean,
  ): Promise<{ ok: boolean; error?: string }> => {
    // Demo account shortcut — always works regardless of stored hash
    if (email.toLowerCase() === "demo@nutriflex.ai" && password === "demo1234") {
      const authUser: AuthUser = { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email };
      writeSession(authUser, remember);
      setUser(authUser);
      return { ok: true };
    }
    const users = getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() &&
           u.passwordHash === simpleHash(password),
    );
    if (!found) return { ok: false, error: "Invalid email or password." };
    const authUser: AuthUser = { id: found.id, name: found.name, email: found.email };
    writeSession(authUser, remember);
    setUser(authUser);
    return { ok: true };
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: simpleHash(password),
    };
    saveUsers([...users, newUser]);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
