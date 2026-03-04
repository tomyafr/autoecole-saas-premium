import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { to, subject, html, attachmentBase64, attachmentName } = await req.json();

        // ⚠️ Configuration SMTP à remplacer par celle de l'auto-école ou la tienne professionnelle
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || "ton-email@gmail.com",
                pass: process.env.SMTP_PASS || "ton-mot-de-passe-d-application",
            },
        });

        const mailOptions: any = {
            from: `"AutoDrive Pro" <${process.env.SMTP_USER || "noreply@autodrive-pro.com"}>`,
            to: to,
            subject: subject,
            html: html,
        };

        if (attachmentBase64 && attachmentName) {
            mailOptions.attachments = [
                {
                    filename: attachmentName,
                    content: attachmentBase64.split('base64,')[1] || attachmentBase64,
                    encoding: 'base64',
                    contentType: 'application/pdf'
                }
            ];
        }

        // Simuler l'envoi si les identifiants SMTP ne sont pas encore configurés
        if (!process.env.SMTP_USER) {
            console.log("SIMULATION ENVOI EMAIL:", mailOptions.subject);
            return NextResponse.json({ success: true, message: 'Simulation d\'envoi réussie (SMTP non configuré)' });
        }

        const info = await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, messageId: info.messageId });

    } catch (error: any) {
        console.error("Erreur d'envoi d'email:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
