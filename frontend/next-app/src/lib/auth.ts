export type UserRole = 'admin' | 'user';

export interface AuthUser {
  username: string;
  role: UserRole;
  displayName: string;
}

// Demo credentials
const DEMO_ACCOUNTS: Record<string, { password: string; role: UserRole; displayName: string }> = {
  admin: {
    password: 'admin123',
    role: 'admin',
    displayName: 'Admin User',
  },
  user: {
    password: 'user123',
    role: 'user',
    displayName: 'Demo User',
  },
};

export function authenticate(username: string, password: string): AuthUser | null {
  const account = DEMO_ACCOUNTS[username.toLowerCase()];
  if (!account || account.password !== password) return null;
  return {
    username: username.toLowerCase(),
    role: account.role,
    displayName: account.displayName,
  };
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_user');
    if (!stored) return null;
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser): void {
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem('auth_user');
}

// Permission checks
export function canAccessAdmin(role?: UserRole): boolean {
  return role === 'admin' || role === 'user';
}

export function canModify(role?: UserRole): boolean {
  return role === 'admin';
}
