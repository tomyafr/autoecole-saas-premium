'use server';

import { supabase } from '@/lib/supabase';

export async function getUserProfile(targetId: string, requestorId: string, requestorRole: string) {
    try {
        // Obtenir l'utilisateur cible
        const { data: targetUser, error } = await supabase
            .from('users')
            .select('id, name, username, role, center_id, created_at')
            .eq('id', targetId)
            .single();

        if (error || !targetUser) return { success: false, error: 'User not found' };

        // Sécurité :
        // Un élève ne doit pas pouvoir voir l'historique ou le profil détaillé d'un moniteur,
        // (à moins que ce soit juste son nom/prenom public).
        // L'admin voit tout. Le moniteur voit les élèves.

        const profile: any = {
            id: targetUser.id,
            name: targetUser.name,
            role: targetUser.role,
            username: targetUser.username,
            createdAt: targetUser.created_at,
        };

        const { data: center } = await supabase.from('centers').select('name').eq('id', targetUser.center_id).single();
        profile.centerName = center?.name || 'Non affecté';

        if (targetUser.role === 'eleve') {
            // Stats & Historique pour ÉLÈVE
            // Accessible à admin, moniteur, et l'élève lui-même
            if (requestorRole === 'admin' || requestorRole === 'moniteur' || requestorId === targetId) {
                const { data: lessons } = await supabase
                    .from('lessons')
                    .select('*, instructor:users!instructor_id(name)')
                    .eq('student_id', targetId)
                    .order('date', { ascending: false });

                const { data: appts } = await supabase
                    .from('appointments')
                    .select('*, instructor:users!instructor_id(name)')
                    .eq('student_id', targetId)
                    .order('date', { ascending: false });

                profile.lessonsCount = lessons?.length || 0;
                profile.apptsCount = appts?.length || 0;

                // On peut construire un historique fusionné
                const history: any[] = [];
                (lessons || []).forEach((l: any) => history.push({ ...l, typeName: 'Leçon', person: l.instructor?.name || 'Inconnu', statusDisplay: l.status === 'done' ? 'Terminé' : 'Inconnu' }));
                (appts || []).forEach((a: any) => history.push({ ...a, typeName: `Rdv ${a.type}`, person: a.instructor?.name || 'Inconnu', statusDisplay: a.status === 'completed' ? 'Complété' : a.status === 'pending' ? 'À venir' : 'Annulé' }));

                history.sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());
                profile.history = history;
            } else {
                return { success: false, error: 'Unauthorized' };
            }
        } else if (targetUser.role === 'moniteur') {
            // Stats & Historique pour MONITEUR
            // Historique accessible uniquement à admin (et le moniteur lui-même ?)
            if (requestorRole === 'admin' || requestorId === targetId) {
                const { data: givenLessons } = await supabase
                    .from('lessons')
                    .select('*, student:users!student_id(name)')
                    .eq('instructor_id', targetId)
                    .order('date', { ascending: false });

                profile.lessonsGiven = givenLessons?.length || 0;
                profile.history = (givenLessons || []).map((l: any) => ({ ...l, typeName: 'Leçon dispensée', person: l.student?.name || 'Inconnu', statusDisplay: 'Terminée' }));
            } else {
                // Pour un élève (si besoin), juste le profil basique sans l'historique
                profile.history = [];
            }
        } else {
            // Admin ou autre
            profile.history = [];
        }

        return { success: true, profile };
    } catch (e: any) {
        console.error("Erreur profil public:", e);
        return { success: false, error: e.message };
    }
}
