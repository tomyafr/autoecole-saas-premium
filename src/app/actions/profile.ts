'use server';

import { supabase } from '@/lib/supabase';

export async function getUserProfile(targetId: string, requestorId: string, requestorRole: string) {
    try {
        // Obtenir l'utilisateur cible (SANS le mot de passe)
        const { data: targetUser, error } = await supabase
            .from('users')
            .select('id, name, username, role, center_id, created_at, phone, avatar')
            .eq('id', targetId)
            .single();

        if (error || !targetUser) return { success: false, error: 'Utilisateur introuvable' };

        const profile: any = {
            name: targetUser.name,
            role: targetUser.role,
            username: targetUser.username,
            createdAt: targetUser.created_at,
            phone: targetUser.phone || null,
            avatar: targetUser.avatar || null,
        };

        // Centre
        const { data: center } = await supabase.from('centers').select('name, city').eq('id', targetUser.center_id).single();
        profile.centerName = center?.name || 'Non affecté';
        profile.centerCity = center?.city || '';

        // ===== PROFIL ÉLÈVE =====
        if (targetUser.role === 'eleve') {
            // Accessible à admin, moniteur, et l'élève lui-même
            if (requestorRole === 'admin' || requestorRole === 'moniteur' || requestorId === targetId) {

                // Leçons terminées
                const { data: lessons } = await supabase
                    .from('lessons')
                    .select('*, instructor:users!instructor_id(name)')
                    .eq('student_id', targetId)
                    .order('date', { ascending: false });

                // Rendez-vous (tous)
                const { data: appts } = await supabase
                    .from('appointments')
                    .select('*, instructor:users!instructor_id(name)')
                    .eq('student_id', targetId)
                    .order('date', { ascending: false });

                // Compétences de l'élève
                const { data: competencies } = await supabase
                    .from('student_competencies')
                    .select('*, ref:competencies_reference!competency_code(title, category)')
                    .eq('student_id', targetId);

                // Paiements
                const { data: payments } = await supabase
                    .from('payments')
                    .select('amount, status, date')
                    .eq('student_id', targetId);

                // Documents
                const { data: documents } = await supabase
                    .from('documents')
                    .select('name, type, status')
                    .eq('student_id', targetId);

                // Stats
                const completedAppts = (appts || []).filter((a: any) => a.status === 'completed').length;
                const pendingAppts = (appts || []).filter((a: any) => a.status === 'pending').length;
                const totalLessons = (lessons || []).length;
                const totalHours = completedAppts + totalLessons;
                const avgScore = totalLessons > 0
                    ? Math.round((lessons || []).reduce((sum: number, l: any) => sum + (l.score || 0), 0) / totalLessons * 10) / 10
                    : null;

                // Compétences regroupées par catégorie
                const competenciesByCategory: any = {};
                (competencies || []).forEach((c: any) => {
                    const cat = c.ref?.category || 'Autre';
                    if (!competenciesByCategory[cat]) competenciesByCategory[cat] = [];
                    competenciesByCategory[cat].push({ title: c.ref?.title || c.competency_code, level: c.level || 0 });
                });

                // Avancement global (% compétences >= 2 sur total)
                const totalComps = (competencies || []).length;
                const validatedComps = (competencies || []).filter((c: any) => c.level >= 2).length;
                const progressPercent = totalComps > 0 ? Math.round((validatedComps / totalComps) * 100) : 0;

                // Paiements
                const totalPaid = (payments || []).filter((p: any) => p.status === 'paid').reduce((s: number, p: any) => s + parseFloat(p.amount), 0);
                const totalDue = (payments || []).filter((p: any) => p.status === 'pending').reduce((s: number, p: any) => s + parseFloat(p.amount), 0);

                // Documents
                const docsStatus = {
                    total: (documents || []).length,
                    valid: (documents || []).filter((d: any) => d.status === 'valid').length,
                    pending: (documents || []).filter((d: any) => d.status === 'pending').length,
                };

                profile.stats = {
                    totalHours,
                    totalTarget: 35,
                    completedSessions: completedAppts,
                    pendingSessions: pendingAppts,
                    totalLessons,
                    avgScore,
                    progressPercent,
                    validatedComps,
                    totalComps,
                    totalPaid,
                    totalDue,
                    docsStatus,
                };

                profile.competencies = competenciesByCategory;

                // Historique fusionné
                const history: any[] = [];
                (lessons || []).forEach((l: any) => history.push({
                    date: l.date,
                    typeName: 'Leçon de conduite',
                    person: l.instructor?.name || 'Inconnu',
                    statusDisplay: l.status === 'done' ? 'Terminé' : l.status,
                    score: l.score,
                    title: l.title,
                }));
                (appts || []).forEach((a: any) => history.push({
                    date: a.date,
                    typeName: a.type || 'Rendez-vous',
                    person: a.instructor?.name || 'Inconnu',
                    statusDisplay: a.status === 'completed' ? 'Complété' : a.status === 'pending' ? 'À venir' : 'Annulé',
                    time: a.time,
                }));
                history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                profile.history = history;
            } else {
                return { success: false, error: 'Accès non autorisé' };
            }
        }

        // ===== PROFIL MONITEUR =====
        else if (targetUser.role === 'moniteur') {
            // Admin et le moniteur lui-même voient tout
            if (requestorRole === 'admin' || requestorId === targetId) {
                // Leçons dispensées
                const { data: givenLessons } = await supabase
                    .from('lessons')
                    .select('*, student:users!student_id(name)')
                    .eq('instructor_id', targetId)
                    .order('date', { ascending: false });

                // Rdv avec ses élèves
                const { data: givenAppts } = await supabase
                    .from('appointments')
                    .select('*, student:users!student_id(name)')
                    .eq('instructor_id', targetId)
                    .order('date', { ascending: false });

                // Avis/Reviews
                const { data: reviews } = await supabase
                    .from('reviews')
                    .select('rating, comment, student:users!student_id(name), created_at')
                    .eq('instructor_id', targetId)
                    .order('created_at', { ascending: false });

                // Élèves uniques
                const uniqueStudentIds = new Set<string>();
                (givenLessons || []).forEach((l: any) => uniqueStudentIds.add(l.student_id));
                (givenAppts || []).forEach((a: any) => uniqueStudentIds.add(a.student_id));

                const totalLessonsGiven = (givenLessons || []).length;
                const totalApptsCompleted = (givenAppts || []).filter((a: any) => a.status === 'completed').length;
                const totalApptsPending = (givenAppts || []).filter((a: any) => a.status === 'pending').length;
                const avgRating = (reviews || []).length > 0
                    ? Math.round((reviews || []).reduce((s: number, r: any) => s + r.rating, 0) / (reviews || []).length * 10) / 10
                    : null;

                profile.stats = {
                    totalLessonsGiven,
                    totalApptsCompleted,
                    totalApptsPending,
                    totalStudents: uniqueStudentIds.size,
                    totalHoursGiven: totalLessonsGiven + totalApptsCompleted,
                    avgRating,
                    reviewsCount: (reviews || []).length,
                };

                profile.reviews = (reviews || []).slice(0, 5).map((r: any) => ({
                    rating: r.rating,
                    comment: r.comment,
                    studentName: r.student?.name || 'Anonyme',
                    date: r.created_at,
                }));

                // Historique
                const history: any[] = [];
                (givenLessons || []).forEach((l: any) => history.push({
                    date: l.date,
                    typeName: 'Leçon dispensée',
                    person: l.student?.name || 'Inconnu',
                    statusDisplay: 'Terminée',
                    score: l.score,
                    title: l.title,
                }));
                (givenAppts || []).forEach((a: any) => history.push({
                    date: a.date,
                    typeName: a.type || 'Session',
                    person: a.student?.name || 'Inconnu',
                    statusDisplay: a.status === 'completed' ? 'Complétée' : a.status === 'pending' ? 'À venir' : 'Annulée',
                    time: a.time,
                }));
                history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                profile.history = history;
            } else {
                // Un élève voit le profil basique du moniteur, sans historique
                profile.stats = {};
                profile.history = [];
            }
        }

        // ===== PROFIL ADMIN =====
        else {
            profile.history = [];
            profile.stats = {};
        }

        return { success: true, profile };
    } catch (e: any) {
        console.error("Erreur profil public:", e);
        return { success: false, error: e.message };
    }
}
