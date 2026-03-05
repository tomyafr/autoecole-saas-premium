import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `"AutoDrive Pro" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Email envoyé:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
}

export function buildReminderEmail(studentName: string, date: string, time: string, instructorName: string, type: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0B0F14; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background: #111820; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo h1 { color: #00F5FF; font-size: 24px; font-weight: 900; letter-spacing: 2px; margin: 0; }
            .logo p { color: #5F6B7A; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin: 4px 0 0; }
            .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 24px 0; }
            h2 { color: #ffffff; font-size: 20px; margin: 0 0 8px; }
            .subtitle { color: #8A94A6; font-size: 14px; margin: 0 0 24px; }
            .info-row { padding: 12px 16px; background: #161F28; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 8px; }
            .info-label { color: #5F6B7A; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            .info-value { color: #ffffff; font-size: 14px; font-weight: 600; }
            .highlight { background: linear-gradient(135deg, rgba(0,245,255,0.1), rgba(0,245,255,0.02)); border: 1px solid rgba(0,245,255,0.2); border-radius: 12px; padding: 16px; text-align: center; margin-top: 24px; }
            .highlight p { color: #00F5FF; font-size: 13px; font-weight: 600; margin: 0; }
            .footer { text-align: center; margin-top: 32px; color: #5F6B7A; font-size: 11px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">
                    <h1>AUTODRIVE</h1>
                    <p>Auto-École Premium</p>
                </div>
                <div class="divider"></div>
                <h2>📋 Rappel de votre session</h2>
                <p class="subtitle">Bonjour ${studentName}, voici un rappel pour votre prochaine session.</p>
                
                <div class="info-row">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="left" class="info-label" width="30%">Type</td>
                            <td align="right" class="info-value" width="70%">${type}</td>
                        </tr>
                    </table>
                </div>
                <div class="info-row">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="left" class="info-label" width="30%">Date</td>
                            <td align="right" class="info-value" width="70%">${date}</td>
                        </tr>
                    </table>
                </div>
                <div class="info-row">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="left" class="info-label" width="30%">Heure</td>
                            <td align="right" class="info-value" width="70%">${time}</td>
                        </tr>
                    </table>
                </div>
                <div class="info-row">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="left" class="info-label" width="30%">Formateur</td>
                            <td align="right" class="info-value" width="70%">${instructorName}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="highlight">
                    <p>⏰ N'oubliez pas d'arriver 5 minutes en avance !</p>
                </div>
            </div>
            <div class="footer">
                <p>Cet email a été envoyé automatiquement par AutoDrive Pro.</p>
                <p>© ${new Date().getFullYear()} AutoDrive — Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
