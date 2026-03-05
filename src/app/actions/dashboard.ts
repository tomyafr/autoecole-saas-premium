'use server';

import { supabase } from '@/lib/supabase';

export async function getStudentDashboard(studentId: string) {
    try {
        // Obtenir les infos de l'élève
        const { data: student, error: studentError } = await supabase
            .from('users')
            .select('*')
            .eq('id', studentId)
            .single();

        if (studentError || !student) throw studentError || new Error('Student not found');

        // Obtenir les leçons avec l'instructeur
        const { data: lessons } = await supabase
            .from('lessons')
            .select('*, instructor:users!instructor_id(*)')
            .eq('student_id', studentId)
            .order('date', { ascending: false });

        // Obtenir les rendez-vous en attente
        const { data: appointmentsAsStudent } = await supabase
            .from('appointments')
            .select('*, instructor:users!instructor_id(*)')
            .eq('student_id', studentId)
            .eq('status', 'pending')
            .order('date', { ascending: true });

        // Obtenir les paiements
        const { data: payments } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', studentId)
            .order('date', { ascending: false });

        const result = {
            ...student,
            lessons: lessons || [],
            appointmentsAsStudent: appointmentsAsStudent || [],
            payments: payments || []
        };

        return JSON.stringify({ success: true, data: result });
    } catch (err: any) {
        console.error("Erreur Dashboard Student:", err);
        return JSON.stringify({ success: false, error: err.message || 'Erreur inconnue' });
    }
}

export async function getInstructorDashboard(instructorId: string) {
    try {
        // Obtenir les infos du moniteur
        const { data: instructor, error: instructorError } = await supabase
            .from('users')
            .select('*')
            .eq('id', instructorId)
            .single();

        if (instructorError || !instructor) throw instructorError || new Error('Instructor not found');

        // Obtenir les rendez-vous du moniteur
        const { data: appointmentsAsInstructor } = await supabase
            .from('appointments')
            .select('*, student:users!student_id(*)')
            .eq('instructor_id', instructorId)
            .order('date', { ascending: false })
            .order('time', { ascending: false });

        // Obtenir les leçons du moniteur
        const { data: instructorLessons } = await supabase
            .from('lessons')
            .select('*, student:users!student_id(*)')
            .eq('instructor_id', instructorId)
            .order('date', { ascending: false });

        // Nombre total d'élèves (stat globale)
        const { count: totalStudents } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'eleve');

        const result = {
            ...instructor,
            appointmentsAsInstructor: appointmentsAsInstructor || [],
            instructorLessons: instructorLessons || [],
            lessons: instructorLessons || [], // Alias pour compatibilité
            totalStudents: totalStudents || 0
        };

        return JSON.stringify({ success: true, data: result });
    } catch (err: any) {
        console.error("Erreur Dashboard Moniteur:", err);
        return JSON.stringify({ success: false, error: err.message || 'Erreur inconnue' });
    }
}
