'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { User, UserRole } from '@/lib/auth';

export async function authenticateServer(
    username: string,
    password: string
): Promise<User | null> {
    try {
        const found = await db.query.users.findFirst({
            where: and(
                eq(users.username, username),
                eq(users.password, password)
            )
        });

        if (found) {
            return {
                id: found.id,
                name: found.name,
                role: found.role as UserRole,
                avatar: found.avatar || '??',
            };
        }
        return null;
    } catch (error) {
        console.error("Database connection error in authenticateServer:", error);
        return null;
    }
}
