// Client email pour Resend ou SMTP

// Type conditionnel selon le provider
type EmailClient = {
  send: (options: {
    to: string
    subject: string
    html: string
    from?: string
  }) => Promise<void>
}

// Client Resend
async function createResendClient(): Promise<EmailClient> {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  return {
    send: async ({ to, subject, html, from }) => {
      await resend.emails.send({
        from: from || process.env.EMAIL_FROM || 'noreply@example.com',
        to,
        subject,
        html,
      })
    },
  }
}

// Client SMTP avec Nodemailer
async function createSMTPClient(): Promise<EmailClient> {
  const nodemailer = await import('nodemailer')

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  return {
    send: async ({ to, subject, html, from }) => {
      await transporter.sendMail({
        from: from || process.env.EMAIL_FROM || 'noreply@example.com',
        to,
        subject,
        html,
      })
    },
  }
}

// Factory pour créer le bon client selon la config
export async function getEmailClient(): Promise<EmailClient> {
  const provider = process.env.RESEND_API_KEY ? 'resend' : 'smtp'

  if (provider === 'resend') {
    return createResendClient()
  } else {
    return createSMTPClient()
  }
}

// Helper pour envoyer des emails
export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  const client = await getEmailClient()
  await client.send(options)
}
