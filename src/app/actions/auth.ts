'use server';

import { supabase } from '@/lib/supabase';
import type { User, UserRole } from '@/lib/auth';
import { createSession, deleteSession } from '@/lib/session';

export async function authenticateServer(
    username: string,
    password: string
) {
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            console.error("ERREUR: NEXT_PUBLIC_SUPABASE_URL manquante dans Vercel");
            return null;
        }
        const { data: found, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !found) {
            return null;
        }

        // Créer le JWT et le Cookie sécurisé HttpOnly
        await createSession({
            id: found.id,
            role: found.role as UserRole,
            name: found.name,
        });

        return {
            id: found.id,
            name: found.name,
            role: found.role as UserRole,
            avatar: found.avatar || '??',
        };
    } catch (error) {
        console.error("Database connection error in authenticateServer:", error);
        return null;
    }
}

export async function logoutServer() {
    await deleteSession();
}
