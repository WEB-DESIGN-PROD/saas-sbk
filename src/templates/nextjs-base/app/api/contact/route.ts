import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/client"

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 })
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    return NextResponse.json({ error: "Configuration manquante." }, { status: 500 })
  }

  try {
    await sendEmail({
      to: adminEmail,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
            Nouveau message de contact
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px; font-size: 14px;">Nom</td>
              <td style="padding: 8px 0; color: #111; font-size: 14px; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; font-size: 14px;">
                <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Sujet</td>
              <td style="padding: 8px 0; color: #111; font-size: 14px;">${subject}</td>
            </tr>
          </table>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 8px;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Message</p>
            <p style="color: #111; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            Répondre directement à : <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Erreur envoi contact:", err)
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 })
  }
}
