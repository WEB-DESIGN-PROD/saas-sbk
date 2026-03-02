// Templates d'emails HTML

export const emailTemplates = {
  // Email de bienvenue
  welcome: (name: string, appName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${appName}</h1>
          </div>
          <div class="content">
            <h2>Bienvenue ${name} ! 👋</h2>
            <p>Nous sommes ravis de vous accueillir sur ${appName}.</p>
            <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant vous connecter et commencer à utiliser la plateforme.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Accéder au dashboard</a>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Email de vérification
  verification: (name: string, verificationUrl: string, appName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${appName}</h1>
          </div>
          <div class="content">
            <h2>Vérifiez votre adresse email</h2>
            <p>Bonjour ${name},</p>
            <p>Merci de vous être inscrit sur ${appName}. Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
            <a href="${verificationUrl}" class="button">Vérifier mon email</a>
            <div class="warning">
              <p><strong>Note :</strong> Ce lien est valide pendant 24 heures.</p>
            </div>
            <p>Si vous n'avez pas créé de compte sur ${appName}, vous pouvez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Email de réinitialisation de mot de passe
  resetPassword: (name: string, resetUrl: string, appName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fef2f2; padding: 10px; border-radius: 4px; margin: 10px 0; border-left: 4px solid #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${appName}</h1>
          </div>
          <div class="content">
            <h2>Réinitialisation de mot de passe</h2>
            <p>Bonjour ${name},</p>
            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte ${appName}.</p>
            <p>Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            <div class="warning">
              <p><strong>Important :</strong></p>
              <ul>
                <li>Ce lien est valide pendant 1 heure</li>
                <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                <li>Votre mot de passe actuel reste inchangé jusqu'à ce que vous en choisissiez un nouveau</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Email OTP (code à usage unique)
  otp: (otp: string, type: string, appName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .otp-code { font-size: 48px; font-weight: bold; letter-spacing: 12px; text-align: center; color: #000; background: #fff; border: 2px solid #000; border-radius: 8px; padding: 20px; margin: 20px 0; font-family: monospace; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${appName}</h1>
          </div>
          <div class="content">
            <h2>Votre code de vérification</h2>
            <p>Utilisez ce code pour ${type === 'sign-in' ? 'vous connecter' : 'vérifier votre compte'} sur ${appName} :</p>
            <div class="otp-code">${otp}</div>
            <div class="warning">
              <p><strong>Note :</strong> Ce code expire dans 10 minutes. Ne le partagez avec personne.</p>
            </div>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,

  // Email Magic Link
  magicLink: (name: string, magicLinkUrl: string, appName: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${appName}</h1>
          </div>
          <div class="content">
            <h2>Votre lien de connexion ✨</h2>
            <p>Bonjour ${name},</p>
            <p>Cliquez sur le bouton ci-dessous pour vous connecter à ${appName} :</p>
            <a href="${magicLinkUrl}" class="button">Se connecter</a>
            <div class="warning">
              <p><strong>Note :</strong> Ce lien est à usage unique et expire dans 15 minutes.</p>
            </div>
            <p>Si vous n'avez pas demandé ce lien, vous pouvez ignorer cet email en toute sécurité.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${appName}. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `,
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
    subject: `Vérifiez votre email - ${appName}`,
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
    subject: `Réinitialisation de mot de passe - ${appName}`,
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
    subject: `Votre lien de connexion - ${appName}`,
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
    subject: `Votre code de vérification - ${appName}`,
    html: emailTemplates.otp(otp, type, appName),
  })
}
