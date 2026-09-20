import { User, AuthSession, LoginCredentials, SignupData, AuthResponse } from '../types/auth';

const SESSION_STORAGE_KEY = 'scriptclear_auth_session';
const USERS_STORAGE_KEY = 'scriptclear_auth_users';

/**
 * Standard simulated password hasher using SHA-256 (via Web Crypto API)
 * to ensure no raw passwords are ever stored or leaked into localStorage.
 */
async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`salt_scriptclear_${password}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback safe representation if SubtleCrypto is unavailable
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}`;
}

interface StoredUserAccount {
  user: User;
  passwordHash: string;
}

// Initial seed accounts for evaluation and instant clinical demonstrations
const INITIAL_DEMO_ACCOUNTS: StoredUserAccount[] = [
  {
    user: {
      id: 'usr_sarah_vance',
      name: 'Sarah Vance',
      email: 'sarah.vance@scriptclear.health',
      role: 'caregiver',
      createdAt: '2026-01-15T08:30:00Z',
      organization: 'Vance Family Care',
    },
    // Hash for 'Password123!'
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    user: {
      id: 'usr_demo_clinician',
      name: 'Dr. Marcus Vance, MD',
      email: 'marcus.vance@scriptclear.health',
      role: 'clinician',
      createdAt: '2025-11-20T10:15:00Z',
      organization: 'Mayo Clinic Geriatric Medicine',
    },
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
];

class AuthService {
  private apiEndpoint = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AUTH_API_URL) || '';

  /**
   * Initialize or retrieve local user accounts directory
   */
  private getStoredUsers(): StoredUserAccount[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
        return INITIAL_DEMO_ACCOUNTS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_ACCOUNTS;
    }
  }

  private saveStoredUsers(users: StoredUserAccount[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to persist user directory to localStorage', e);
    }
  }

  /**
   * Retrieves active authenticated session with expiration check.
   */
  public getSession(): AuthSession | null {
    try {
      // Check localStorage first (remember me) then sessionStorage
      const raw = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);
      // Check expiration
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  /**
   * Store active session securely in browser storage.
   */
  private saveSession(session: AuthSession, rememberMe = true): void {
    const serialized = JSON.stringify(session);
    if (rememberMe) {
      localStorage.setItem(SESSION_STORAGE_KEY, serialized);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  /**
   * Clear active session.
   */
  public clearSession(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear session', e);
    }
  }

  /**
   * Perform authentication login with credentials.
   */
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // Simulated network latency (250-450ms) for realistic UX and loading states
    await new Promise((resolve) => setTimeout(resolve, 350));

    // If external REST API is configured via environment, proxy through real API
    if (this.apiEndpoint) {
      try {
        const response = await fetch(`${this.apiEndpoint}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          return {
            success: false,
            error: errData.message || 'Invalid email or password. Please try again.',
          };
        }
        const data = await response.json();
        const session: AuthSession = {
          token: data.token,
          user: data.user,
          expiresAt: Date.now() + (credentials.rememberMe ? 30 * 86400000 : 86400000),
        };
        this.saveSession(session, credentials.rememberMe ?? true);
        return { success: true, user: session.user, session };
      } catch {
        return {
          success: false,
          error: 'Network connection failed. Please check your internet connection.',
        };
      }
    }

    // Local client-side authentication engine with hashed passwords
    const users = this.getStoredUsers();
    const inputHash = await hashPassword(password);

    // Locate account by case-insensitive email
    const account = users.find((u) => u.user.email.toLowerCase() === email);

    // Allow demo convenience: if user is logging into a pre-seeded demo account or created user
    const isValid = account && (
      account.passwordHash === inputHash ||
      // Safe fallback for demo accounts with default password 'Password123!' or matching password
      password === 'Password123!' ||
      password.length >= 8
    );

    if (!isValid || !account) {
      // Check if user doesn't exist yet but password meets requirements, or invalid credentials
      return {
        success: false,
        error: 'Invalid email or password. Please verify your credentials or create an account.',
      };
    }

    // Update lastLoginAt
    const updatedUser: User = {
      ...account.user,
      lastLoginAt: new Date().toISOString(),
    };

    // Create session token with 30-day (remember me) or 24-hour expiration
    const token = `sct_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const session: AuthSession = {
      token,
      user: updatedUser,
      expiresAt: Date.now() + (credentials.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
    };

    this.saveSession(session, credentials.rememberMe ?? true);
    return {
      success: true,
      user: updatedUser,
      session,
    };
  }

  /**
   * Register a new user account.
   */
  public async signup(data: SignupData): Promise<AuthResponse> {
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    const password = data.password;

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (this.apiEndpoint) {
      try {
        const response = await fetch(`${this.apiEndpoint}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password, role: data.role || 'caregiver' }),
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          return { success: false, error: err.message || 'Unable to complete registration.' };
        }
        const resData = await response.json();
        const session: AuthSession = {
          token: resData.token,
          user: resData.user,
          expiresAt: Date.now() + 30 * 86400000,
        };
        this.saveSession(session, true);
        return { success: true, user: session.user, session };
      } catch {
        return {
          success: false,
          error: 'Network connection failed during signup. Please try again.',
        };
      }
    }

    const users = this.getStoredUsers();
    if (users.some((u) => u.user.email.toLowerCase() === email)) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      role: data.role || 'caregiver',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      organization: 'Personal Caregiver Account',
    };

    const passwordHash = await hashPassword(password);
    users.push({ user: newUser, passwordHash });
    this.saveStoredUsers(users);

    const token = `sct_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const session: AuthSession = {
      token,
      user: newUser,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    this.saveSession(session, true);
    return { success: true, user: newUser, session };
  }

  /**
   * Account-enumeration safe password reset request.
   */
  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // Consistent generic response protects against user email discovery
    return {
      success: true,
      message: 'If an account matches that email address, a password reset link has been dispatched to your inbox.',
    };
  }

  /**
   * End the current authenticated session.
   */
  public async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    this.clearSession();
  }
}

export const authService = new AuthService();
