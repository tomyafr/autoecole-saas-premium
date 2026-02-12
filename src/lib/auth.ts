export type UserRole = 'eleve' | 'moniteur' | 'admin';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar: string;
}

interface Credentials {
    username: string;
    password: string;
    user: User;
}

const USERS_DB: Credentials[] = [
    {
        username: 'eleve',
        password: 'eleve54',
        user: {
            id: 'u1',
            name: 'Lucas Bernard',
            role: 'eleve',
            avatar: 'LB',
        },
    },
    {
        username: 'moniteur',
        password: 'moniteur54',
        user: {
            id: 'u2',
            name: 'Marc Dupont',
            role: 'moniteur',
            avatar: 'MD',
        },
    },
    {
        username: 'admin',
        password: 'admin54',
        user: {
            id: 'u3',
            name: 'Sophie Martin',
            role: 'admin',
            avatar: 'SM',
        },
    },
];

export function authenticate(
    username: string,
    password: string
): User | null {
    const found = USERS_DB.find(
        (c) => c.username === username && c.password === password
    );
    return found ? found.user : null;
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
