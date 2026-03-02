'use server';

import { db } from './index';
import { users, appointments, lessons, payments } from './schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getStudentDashboard(studentId: string) {
    try {
        const student = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, studentId),
            with: {
                lessons: {
                    limit: 5,
                    orderBy: (l, { desc }) => [desc(l.date)],
                },
                appointmentsAsStudent: {
                    where: (a, { eq }) => eq(a.status, 'pending'),
                    orderBy: (a, { desc }) => [desc(a.date)],
                    with: {
                        instructor: true,
                    }
                },
                payments: {
                    limit: 5,
                    orderBy: (p, { desc }) => [desc(p.date)],
                }
            }
        });
        return JSON.stringify({ success: true, data: student });
    } catch (err: any) {
        console.error("Erreur BD Student:", err);
        return JSON.stringify({ success: false, error: err.message || 'Erreur DB inconnue' });
    }
}

export async function getInstructorDashboard(instructorId: string) {
    try {
        const instructor = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, instructorId),
            with: {
                appointmentsAsInstructor: {
                    orderBy: (a, { desc }) => [desc(a.date), desc(a.time)],
                    with: {
                        student: true,
                    }
                },
                lessons: {
                    limit: 10,
                    orderBy: (l, { desc }) => [desc(l.date)],
                    with: {
                        student: true,
                    }
                }
            }
        });

        const studentsCount = await db.query.users.findMany({
            where: (u, { eq }) => eq(u.role, 'eleve')
        }).then(res => res.length);

        const result = { ...instructor, totalStudents: studentsCount };
        return JSON.stringify({ success: true, data: result });
    } catch (err: any) {
        console.error("Erreur BD Moniteur:", err);
        return JSON.stringify({ success: false, error: err.message || 'Erreur DB inconnue' });
    }
}
