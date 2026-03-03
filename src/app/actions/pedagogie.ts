'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getStudentPedagogyData(studentId: string) {
    try {
        // Récupérer toutes les compétences de référence
        const { data: reference } = await supabase
            .from('competencies_reference')
            .select('*')
            .order('code', { ascending: true });

        // Récupérer la progression de l'élève
        const { data: progress } = await supabase
            .from('student_competencies')
            .select('*')
            .eq('student_id', studentId);

        if (!reference) return null;

        // Fusionner les données pour l'affichage
        const categories = ['C1', 'C2', 'C3', 'C4'];
        const pedagogy = categories.map(cat => {
            const items = reference.filter(r => r.category === cat).map(r => {
                const studentData = progress?.find(p => p.competency_code === r.code);
                return {
                    code: r.code,
                    title: r.title,
                    description: r.description,
                    level: studentData?.level || 0,
                    updated_at: studentData?.updated_at || null
                };
            });

            const total = items.length;
            const acquired = items.filter(i => i.level >= 2).length; // Acquis ou Assimilé
            const percent = total > 0 ? Math.round((acquired / total) * 100) : 0;

            return {
                id: cat,
                title: `Compétence ${cat.replace('C', '')}`,
                progress: percent,
                items
            };
        });

        // Calcul du progrès global
        const totalItems = reference.length;
        const totalAcquired = (progress || []).filter(p => p.level >= 2).length;
        const globalProgress = totalItems > 0 ? Math.round((totalAcquired / totalItems) * 100) : 0;

        // Récupérer les leçons en attente de signature
        const { data: pendingLessons } = await supabase
            .from('lessons')
            .select('*')
            .eq('student_id', studentId)
            .eq('status', 'done')
            .is('signed_at', null);

        return {
            pedagogy,
            globalProgress,
            pendingSignatures: pendingLessons || []
        };
    } catch (error) {
        console.error("Erreur récupération pédagogie:", error);
        return null;
    }
}

export async function updateStudentCompetency(studentId: string, code: string, level: number, instructorId: string) {
    try {
        const { data, error } = await supabase
            .from('student_competencies')
            .upsert({
                student_id: studentId,
                competency_code: code,
                level,
                instructor_id: instructorId,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'student_id, competency_code'
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Erreur mise à jour compétence:", error);
        return { success: false, error };
    }
}

export async function getStudentsList() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name')
            .eq('role', 'eleve')
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Erreur récupération liste élèves:", error);
        return [];
    }
}

export async function completeLessonWithSignature(lessonId: string, signature: string) {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .update({
                signature,
                signed_at: new Date().toISOString(),
                status: 'done'
            })
            .eq('id', lessonId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Erreur signature leçon:", error);
        return { success: false, error };
    }
}

export async function getStudentLessons(studentId: string) {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('student_id', studentId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error("Erreur récupération leçons:", error);
        return [];
    }
}
