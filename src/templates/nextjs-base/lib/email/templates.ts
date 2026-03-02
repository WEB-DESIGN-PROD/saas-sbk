// Templates d'emails HTML — design moderne, compatible dark mode email clients

// Wrapper commun (outer + header)
function emailWrapper(appName: string, content: string) {
  return `<!DOCTYPE html>
<html lang="fr" style="color-scheme: light;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${appName}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5 !important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5 !important;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Header : nom du projet -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:22px;font-weight:700;color:#0f172a !important;letter-spacing:-0.5px;">${appName}</span>
            </td>
          </tr>
        </table>
        <!-- Card principale -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff !important;border-radius:12px;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:13px;color:#6b7280 !important;">© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Bouton CTA primaire
function ctaButton(url: string, label: string, color = '#4f46e5') {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
    <tr>
      <td align="left" style="border-radius:8px;background-color:${color} !important;">
        <a href="${url}" target="_blank" style="display:inline-block;padding:14px 28px;background-color:${color} !important;color:#ffffff !important;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;border:2px solid ${color};">${label}</a>
      </td>
    </tr>
  </table>`
}

// Box info / avertissement
function infoBox(text: string, type: 'info' | 'warning' | 'danger' = 'info') {
  const styles = {
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    danger:  { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
  }
  const s = styles[type]
  return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0 4px;">
    <tr>
      <td style="background-color:${s.bg} !important;border:1px solid ${s.border};border-radius:8px;padding:14px 18px;">
        <p style="margin:0;font-size:14px;color:${s.text} !important;line-height:1.6;">${text}</p>
      </td>
    </tr>
  </table>`
}

export const emailTemplates = {
  // Email de bienvenue
  welcome: (name: string, appName: string) => emailWrapper(appName, `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0f172a !important;letter-spacing:-0.5px;">Bienvenue sur ${appName} !</h1>
    <p style="margin:0 0 20px;font-size:16px;color:#6b7280 !important;">Votre compte est prêt.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151 !important;line-height:1.6;">Bonjour ${name},</p>
    <p style="margin:0 0 24px;font-size:15px;color:#374151 !important;line-height:1.6;">Votre compte a été créé avec succès sur <strong style="color:#0f172a !important;">${appName}</strong>. Vous pouvez dès maintenant accéder à votre espace personnel.</p>
    ${ctaButton(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`, 'Accéder au dashboard')}
    <p style="margin:24px 0 0;font-size:14px;color:#9ca3af !important;line-height:1.6;">Si vous n'avez pas créé ce compte, vous pouvez ignorer cet email.</p>
  `),

  // Email de vérification
  verification: (name: string, verificationUrl: string, appName: string) => emailWrapper(appName, `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0f172a !important;letter-spacing:-0.5px;">Vérifiez votre email</h1>
    <p style="margin:0 0 20px;font-size:16px;color:#6b7280 !important;">Une dernière étape pour activer votre compte.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151 !important;line-height:1.6;">Bonjour ${name},</p>
    <p style="margin:0 0 24px;font-size:15px;color:#374151 !important;line-height:1.6;">Merci de vous être inscrit sur <strong style="color:#0f172a !important;">${appName}</strong>. Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et accéder à votre compte.</p>
    ${ctaButton(verificationUrl, 'Vérifier mon email')}
    ${infoBox('<strong>Ce lien est valide pendant 24 heures.</strong> Après expiration, vous pourrez en demander un nouveau depuis la page de connexion.', 'info')}
    <p style="margin:20px 0 0;font-size:14px;color:#9ca3af !important;line-height:1.6;">Si vous n'avez pas créé de compte sur ${appName}, ignorez cet email.</p>
  `),

  // Email de réinitialisation de mot de passe
  resetPassword: (name: string, resetUrl: string, appName: string) => emailWrapper(appName, `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0f172a !important;letter-spacing:-0.5px;">Réinitialisation de mot de passe</h1>
    <p style="margin:0 0 20px;font-size:16px;color:#6b7280 !important;">Une demande a été effectuée pour votre compte.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151 !important;line-height:1.6;">Bonjour ${name},</p>
    <p style="margin:0 0 24px;font-size:15px;color:#374151 !important;line-height:1.6;">Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte <strong style="color:#0f172a !important;">${appName}</strong>. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.</p>
    ${ctaButton(resetUrl, 'Réinitialiser mon mot de passe', '#dc2626')}
    ${infoBox('⚠️ <strong>Ce lien expire dans 1 heure.</strong> Votre mot de passe actuel reste inchangé tant que vous n\'en choisissez pas un nouveau.', 'warning')}
    <p style="margin:20px 0 0;font-size:14px;color:#9ca3af !important;line-height:1.6;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email — votre compte reste sécurisé.</p>
  `),

  // Email OTP (code à usage unique)
  otp: (otp: string, type: string, appName: string) => emailWrapper(appName, `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0f172a !important;letter-spacing:-0.5px;">Votre code de vérification</h1>
    <p style="margin:0 0 20px;font-size:16px;color:#6b7280 !important;">Code à usage unique pour ${type === 'sign-in' ? 'vous connecter' : 'vérifier votre compte'}.</p>
    <p style="margin:0 0 24px;font-size:15px;color:#374151 !important;line-height:1.6;">Utilisez le code ci-dessous pour ${type === 'sign-in' ? 'vous connecter' : 'vérifier votre compte'} sur <strong style="color:#0f172a !important;">${appName}</strong> :</p>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td align="center" style="background-color:#f8fafc !important;border:2px solid #e2e8f0;border-radius:12px;padding:28px 20px;">
          <span style="font-size:52px;font-weight:800;letter-spacing:16px;color:#0f172a !important;font-family:'Courier New',Courier,monospace;">${otp}</span>
        </td>
      </tr>
    </table>
    ${infoBox('⏱️ Ce code expire dans <strong>10 minutes</strong>. Ne le partagez avec personne.', 'warning')}
    <p style="margin:20px 0 0;font-size:14px;color:#9ca3af !important;line-height:1.6;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
  `),

  // Email Magic Link
  magicLink: (name: string, magicLinkUrl: string, appName: string) => emailWrapper(appName, `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#0f172a !important;letter-spacing:-0.5px;">Votre lien de connexion</h1>
    <p style="margin:0 0 20px;font-size:16px;color:#6b7280 !important;">Connexion sans mot de passe.</p>
    <p style="margin:0 0 12px;font-size:15px;color:#374151 !important;line-height:1.6;">Bonjour ${name},</p>
    <p style="margin:0 0 24px;font-size:15px;color:#374151 !important;line-height:1.6;">Cliquez sur le bouton ci-dessous pour vous connecter instantanément à <strong style="color:#0f172a !important;">${appName}</strong>. Aucun mot de passe requis.</p>
    ${ctaButton(magicLinkUrl, 'Se connecter maintenant')}
    ${infoBox('🔒 Ce lien est <strong>à usage unique</strong> et expire dans <strong>15 minutes</strong>.', 'info')}
    <p style="margin:20px 0 0;font-size:14px;color:#9ca3af !important;line-height:1.6;">Si vous n'avez pas demandé ce lien, ignorez cet email — votre compte reste sécurisé.</p>
  `),
}

// Helper pour envoyer les emails avec les bons templates
export async function sendWelcomeEmail(to: string, name: string, appName: string) {
  const { sendEmail } = await import('./client')
  await sendEmail({
    to,
    subject: `Bienvenue sur ${appName} !`,
    html: emailTemplates.welcome(name, appName),
  })
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string,
  appName: string
) {
  const { sendEmail } = await import('./client')
  await sendEmail({
    to,
    subject: `Vérifiez votre email — ${appName}`,
    html: emailTemplates.verification(name, verificationUrl, appName),
  })
}

export async function sendResetPasswordEmail(
  to: string,
  name: string,
  resetUrl: string,
  appName: string
) {
  const { sendEmail } = await import('./client')
  await sendEmail({
    to,
    subject: `Réinitialisation de mot de passe — ${appName}`,
    html: emailTemplates.resetPassword(name, resetUrl, appName),
  })
}

export async function sendMagicLinkEmail(
  to: string,
  name: string,
  magicLinkUrl: string,
  appName: string
) {
  const { sendEmail } = await import('./client')
  await sendEmail({
    to,
    subject: `Votre lien de connexion — ${appName}`,
    html: emailTemplates.magicLink(name, magicLinkUrl, appName),
  })
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  type: string,
  appName: string
) {
  const { sendEmail } = await import('./client')
  await sendEmail({
    to,
    subject: `Votre code de vérification — ${appName}`,
    html: emailTemplates.otp(otp, type, appName),
  })
}
