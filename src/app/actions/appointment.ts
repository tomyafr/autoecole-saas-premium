'use server';

import { db } from '@/lib/db';
import { appointments, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createAppointment(studentId: string, instructorName: string, date: Date, time: string, type: string) {
    try {
        // 1. Find instructor by name (in this mock-to-real system)
        // In a real app we would have the instructorId directly
        const instructor = await db.query.users.findFirst({
            where: eq(users.name, instructorName)
        });

        if (!instructor) {
            throw new Error('Instructor not found');
        }

        // 2. Insert new appointment
        await db.insert(appointments).values({
            studentId,
            instructorId: instructor.id,
            date,
            time,
            type,
            status: 'pending',
        });

        // 3. Revalidate dashboard path
        revalidatePath('/dashboard/eleve');
        revalidatePath('/dashboard/moniteur');

        return { success: true };
    } catch (error) {
        console.error('Failed to create appointment:', error);
        return { success: false, error: 'Database error' };
    }
}

export async function getAppointmentsForStudent(studentId: string) {
    return await db.query.appointments.findMany({
        where: eq(appointments.studentId, studentId),
        with: {
            instructor: true
        }
    });
}

export async function getBookedSlots(instructorName: string, date: Date) {
    try {
        const instructor = await db.query.users.findFirst({
            where: eq(users.name, instructorName)
        });

        if (!instructor) return [];

        const all = await db.query.appointments.findMany({
            where: eq(appointments.instructorId, instructor.id)
        });

        const dateStr = new Date(date).toISOString().split('T')[0];
        const booked: string[] = [];

        all.forEach(a => {
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
