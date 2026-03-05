export type UserRole = 'eleve' | 'moniteur' | 'admin';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
    username?: string;
    phone?: string;
}

export function getDashboardPath(role: UserRole): string {
    return `/dashboard/${role}`;
}

const AUTH_STORAGE_KEY = 'autodrive_user';

export function saveUser(user: User): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
}

export function getUser(): User | null {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        if (data) {
            try {
                return JSON.parse(data) as User;
            } catch {
                return null;
            }
        }
    }
    return null;
}

export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
}
