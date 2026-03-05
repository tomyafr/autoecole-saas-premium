'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createAppointment(studentId: string, instructorName: string, date: string | Date, time: string, type: string) {
    try {
        // ... previous code finding instructor ...
        const { data: instructor, error: instructorError } = await supabase
            .from('users')
            .select('id')
            .eq('name', instructorName)
            .single();

        if (instructorError || !instructor) {
            throw new Error('Instructor not found');
        }

        // 2. Insérer le rendez-vous
        const { error: insertError } = await supabase
            .from('appointments')
            .insert({
                student_id: studentId,
                instructor_id: instructor.id,
                date: new Date(date).toISOString(),
                time,
                type,
                status: 'pending',
            });

        if (insertError) throw insertError;

        // 3. Revalider les chemins
        revalidatePath('/dashboard/eleve');
        revalidatePath('/dashboard/moniteur');

        return { success: true };
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return { success: false, error: 'Database error' };
    }
}

export async function cancelAppointment(appointmentId: string) {
    try {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appointmentId)
            .eq('status', 'pending'); // On ne peut annuler QUE si c'est en attente

        if (error) throw error;

        revalidatePath('/dashboard/eleve/lecons');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to cancel appointment:', error);
        return { success: false, error: error.message || 'Database error' };
    }
}

export async function rescheduleAppointment(appointmentId: string, newDate: string | Date, newTime: string) {
    try {
        const { error } = await supabase
            .from('appointments')
            .update({
                date: new Date(newDate).toISOString(),
                time: newTime
            })
            .eq('id', appointmentId)
            .eq('status', 'pending'); // On ne peut modifier QUE si c'est en attente

        if (error) throw error;

        revalidatePath('/dashboard/eleve/lecons');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to reschedule appointment:', error);
        return { success: false, error: error.message || 'Database error' };
    }
}

export async function getAppointmentsForStudent(studentId: string) {
    const { data, error } = await supabase
        .from('appointments')
        .select('*, instructor:users!instructor_id(*)')
        .eq('student_id', studentId);

    return data || [];
}

export async function getBookedSlots(instructorName: string, date: Date) {
    try {
        const { data: instructor } = await supabase
            .from('users')
            .select('id')
            .eq('name', instructorName)
            .single();

        if (!instructor) return [];

        const { data: all } = await supabase
            .from('appointments')
            .select('*')
            .eq('instructor_id', instructor.id);

        const dateStr = new Date(date).toISOString().split('T')[0];
        const booked: string[] = [];

        (all || []).forEach(a => {
            if (a.date && new Date(a.date).toISOString().split('T')[0] === dateStr) {
                booked.push(a.time);
                if (a.type && a.type.includes('2H')) {
                    const hour = parseInt(a.time.split(':')[0], 10);
                    const nextTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                    booked.push(nextTime);
                }
            }
        });

        return booked;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function completeAppointmentWithEvaluation(
    appointmentId: string,
    studentId: string,
    instructorId: string,
    score: number,
    comment: string,
    negativePoints: string,
    studentSignature: string,
    instructorSignature: string
) {
    try {
        const { data: apt, error: aptError } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', appointmentId)
            .single();

        if (aptError || !apt) {
            throw new Error('Appointment not found');
        }

        const signatureJson = JSON.stringify({ student: studentSignature, instructor: instructorSignature });

        const { error: insertError } = await supabase
            .from('lessons')
            .insert({
                student_id: studentId,
                instructor_id: instructorId,
                date: apt.date,
                title: 'Leçon de conduite',
                score: score,
                note: typeof comment === 'string' ? comment : '', // some schema use note, some use comment. Assuming comment is mapped to "comment" properly or just stored
                // Actually, we saw dbData.lessons[0].score and dbData.lessons[0].title
                // So score and title are definitely there. Let's just pass comment as well.
                status: 'done',
                signature: signatureJson,
                signed_at: new Date().toISOString()
            } as any); // using any for missing dynamic columns like 'comment' if they aren't typed

        // Update the appointment status
        await supabase
            .from('appointments')
            .update({ status: 'completed' })
            .eq('id', appointmentId);

        revalidatePath('/dashboard/moniteur');
        revalidatePath('/dashboard/eleve');
        revalidatePath('/dashboard/admin');

        return { success: true };
    } catch (error: any) {
        console.error('Failed to complete appointment:', error);
        return { success: false, error: error.message || 'Database error' };
    }
}
