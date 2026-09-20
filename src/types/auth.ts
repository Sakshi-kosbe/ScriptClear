export interface User {
  id: string;
  email: string;
  name: string;
  role: 'caregiver' | 'clinician' | 'patient' | 'admin';
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  organization?: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  user: User;
  expiresAt: number; // Unix timestamp in milliseconds
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: 'caregiver' | 'clinician' | 'patient';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: AuthSession;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}
