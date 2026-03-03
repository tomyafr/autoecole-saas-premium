import { pgTable, text, timestamp, integer, boolean, uuid, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const rolesEnum = ['eleve', 'moniteur', 'admin'] as const;

export const centers = pgTable('centers', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(), // Should be hashed in a real app
    role: text('role', { enum: rolesEnum }).notNull().default('eleve'),
    avatar: text('avatar'), // Initials or URL
    centerId: uuid('center_id').references(() => centers.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    center: one(centers, {
        fields: [users.centerId],
        references: [centers.id],
    }),
    appointmentsAsStudent: many(appointments, { relationName: 'student' }),
    appointmentsAsInstructor: many(appointments, { relationName: 'instructor' }),
    lessons: many(lessons, { relationName: 'student_lesson' }),
    instructorLessons: many(lessons, { relationName: 'instructor_lesson' }),
    payments: many(payments),
}));

export const appointments = pgTable('appointments', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').references(() => users.id).notNull(),
    instructorId: uuid('instructor_id').references(() => users.id).notNull(),
    date: timestamp('date').notNull(),
    time: text('time').notNull(), // 'hh:mm'
    type: text('type').notNull(), // 'Conduite urbaine', etc.
    status: text('status', { enum: ['pending', 'completed', 'cancelled'] }).notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
    student: one(users, {
        fields: [appointments.studentId],
        references: [users.id],
        relationName: 'student',
    }),
    instructor: one(users, {
        fields: [appointments.instructorId],
        references: [users.id],
        relationName: 'instructor',
    }),
}));

export const lessons = pgTable('lessons', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').references(() => users.id).notNull(),
    instructorId: uuid('instructor_id').references(() => users.id),
    title: text('title').notNull(),
    score: integer('score'), // 0 to 20
    date: timestamp('date').notNull(),
    status: text('status', { enum: ['planned', 'done', 'missed'] }).notNull().default('planned'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const lessonsRelations = relations(lessons, ({ one }) => ({
    student: one(users, {
        fields: [lessons.studentId],
        references: [users.id],
        relationName: 'student_lesson'
    }),
    instructor: one(users, {
        fields: [lessons.instructorId],
        references: [users.id],
        relationName: 'instructor_lesson'
    }),
}));

export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    studentId: uuid('student_id').references(() => users.id).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    date: timestamp('date').defaultNow().notNull(),
    status: text('status', { enum: ['paid', 'pending', 'failed'] }).notNull().default('pending'),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
    student: one(users, {
        fields: [payments.studentId],
        references: [users.id],
    }),
}));

export const vehicles = pgTable('vehicles', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(), // ex: "Peugeot 208 #1"
    brand: text('brand').notNull(),
    model: text('model').notNull(),
    plate: text('plate').notNull().unique(),
    year: integer('year'),
    status: text('status', { enum: ['active', 'maintenance', 'retired'] }).notNull().default('active'),
    centerId: uuid('center_id').references(() => centers.id),
    lastService: timestamp('last_service'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
    center: one(centers, {
        fields: [vehicles.centerId],
        references: [centers.id],
    }),
}));
