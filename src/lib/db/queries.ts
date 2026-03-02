import { db } from './index';
import { users, appointments, lessons, payments } from './schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getStudentDashboardData(studentId: string) {
    const student = await db.query.users.findFirst({
        where: eq(users.id, studentId),
        with: {
            lessons: {
                limit: 5,
                orderBy: [desc(lessons.date)],
            },
            appointmentsAsStudent: {
                where: eq(appointments.status, 'pending'),
                orderBy: [desc(appointments.date)],
                with: {
                    instructor: true,
                }
            },
            payments: {
                limit: 5,
                orderBy: [desc(payments.date)],
            }
        }
    });

    return student;
}

export async function getStudentDashboard(studentId: string) {
    return await getStudentDashboardData(studentId);
}

export async function getInstructorDashboardData(instructorId: string) {
    const instructor = await db.query.users.findFirst({
        where: eq(users.id, instructorId),
        with: {
            appointmentsAsInstructor: {
                where: eq(appointments.status, 'pending'),
                with: {
                    student: true,
                }
            },
            lessons: {
                limit: 10,
                orderBy: [desc(lessons.date)],
                with: {
                    student: true,
                }
            }
        }
    });

    return instructor;
}

export async function getInstructorDashboard(instructorId: string) {
    return await getInstructorDashboardData(instructorId);
}
