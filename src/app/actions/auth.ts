'use server';

import { supabase } from '@/lib/supabase';
import type { User, UserRole } from '@/lib/auth';
import { createSession, deleteSession } from '@/lib/session';

export async function authenticateServer(
    username: string,
    password: string
) {
    try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
            console.error("ERREUR: Variables Supabase non configurées sur Vercel");
            return null; // Retourner null au lieu de throw pour éviter le crash RSC
        }

        const { data: found, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error) {
            console.warn("Supabase auth query error (likely invalid credentials):", error.message);
            return null;
        }

        if (!found) return null;

        // Créer le JWT et le Cookie sécurisé HttpOnly
        try {
            await createSession({
                id: found.id,
                role: found.role as UserRole,
                name: found.name,
            });
        } catch (sessionErr: any) {
            console.error("Session creation failed:", sessionErr);
            throw new Error(`Erreur de session: ${sessionErr.message}`);
        }

        return {
            id: found.id,
            name: found.name,
            role: found.role as UserRole,
            avatar: found.avatar || '??',
        };
    } catch (globalError: any) {
        console.error("CRITICAL AUTH SERVER ERROR:", globalError);
        // On renvoie l'erreur sous forme de message pour que le client l'affiche au lieu de crasher
        throw new Error(globalError.message || "Erreur serveur inconnue");
    }
}

export async function registerUserServer(data: { name: string, username: string, password: string }) {
    try {
        const { error } = await supabase
            .from('users')
            .insert({
                name: data.name,
                username: data.username,
                password: data.password,
                role: 'eleve' // Rôle par défaut
            });

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, error: error.message };
    }
}

export async function logoutServer() {
    await deleteSession();
}

export async function updateUserProfile(userId: string, data: { name?: string, phone?: string }) {
    try {
        const { error } = await supabase
            .from('users')
            .update(data)
            .eq('id', userId);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error("Update profile error:", error);
        return { success: false, error: error.message };
    }
}
