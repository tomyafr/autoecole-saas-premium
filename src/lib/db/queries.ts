'use server';

import { db } from './index';
import { users, appointments, lessons, payments } from './schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getStudentDashboardData(studentId: string) {
    try {
        const student = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, studentId),
            with: {
                lessons: {
                    limit: 5,
                    orderBy: (lessons, { desc }) => [desc(lessons.date)],
                },
                appointmentsAsStudent: {
                    where: (appointments, { eq }) => eq(appointments.status, 'pending'),
                    orderBy: (appointments, { desc }) => [desc(appointments.date)],
                    with: {
                        instructor: true,
                    }
                },
                payments: {
                    limit: 5,
                    orderBy: (payments, { desc }) => [desc(payments.date)],
                }
            }
        });

        // Ensure safe serialization for Next.js Client Boundaries
        return student ? JSON.parse(JSON.stringify(student)) : null;
    } catch (err: any) {
        console.error("Erreur critique Db dans getStudentDashboardData:", err);
        throw new Error(err.message || 'Erreur lors de la lecture de la base de données');
    }
}

export async function getStudentDashboard(studentId: string) {
    return await getStudentDashboardData(studentId);
}

export async function getInstructorDashboardData(instructorId: string) {
    try {
        const instructor = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, instructorId),
            with: {
                appointmentsAsInstructor: {
                    orderBy: (appointments, { desc }) => [desc(appointments.date), desc(appointments.time)],
                    with: {
                        student: true,
                    }
                },
                lessons: {
                    limit: 10,
                    orderBy: (lessons, { desc }) => [desc(lessons.date)],
                    with: {
                        student: true,
                    }
                }
            }
        });

        const studentsCount = await db.query.users.findMany({
            where: (users, { eq }) => eq(users.role, 'eleve')
        }).then(res => res.length);

        const result = { ...instructor, totalStudents: studentsCount };
        return JSON.parse(JSON.stringify(result));
    } catch (err: any) {
        console.error("Erreur critique Db dans getInstructorDashboardData:", err);
        throw new Error(err.message || 'Erreur lors de la lecture de la base de données Instructeur');
    }
}

export async function getInstructorDashboard(instructorId: string) {
    return await getInstructorDashboardData(instructorId);
}
