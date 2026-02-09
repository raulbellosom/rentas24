import nodemailer from "nodemailer";

export function must(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export function safeBodyJson(req) {
  try {
    const raw = req.body ?? req.payload ?? "{}";
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

export function json(res, status, body) {
  return res.json(body, status);
}

export async function sendEmailWithNodemailer(to, subject, html) {
  const host = must("EMAIL_SMTP_HOST");
  const port = parseInt(process.env.EMAIL_SMTP_PORT || "587", 10);
  const secure = (process.env.EMAIL_SMTP_SECURE || "false") === "true";
  const user = must("EMAIL_SMTP_USER");
  const pass = must("EMAIL_SMTP_PASS");
  const fromName = process.env.EMAIL_FROM_NAME || "Rentas24";
  const fromAddress = must("EMAIL_FROM_ADDRESS");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject,
    html,
  });
}

export function getVerificationEmailHtml(token, baseUrl) {
  const safeBase = String(baseUrl || "").replace(/\/$/, "");
  const link = `${safeBase}/verify-email?token=${token}`;
  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verifica tu correo - Rentas24</title>
  </head>
  <body style="margin:0;padding:24px;background:#0f172a;font-family:Arial,sans-serif;">
    <table role="presentation" style="width:100%;max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px;background:#0f172a;color:#e2e8f0;">
          <h1 style="margin:0;font-size:24px;">Rentas24</h1>
          <p style="margin:8px 0 0 0;color:#94a3b8;">Verificación de correo</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;color:#334155;">
          <h2 style="margin:0 0 12px 0;font-size:22px;color:#0f172a;">Confirma tu cuenta</h2>
          <p style="margin:0 0 16px 0;line-height:1.6;">
            Para activar tu cuenta en Rentas24, verifica tu correo con el siguiente botón.
          </p>
          <a href="${link}" style="display:inline-block;padding:12px 20px;background:#06b6d4;color:#0f172a;text-decoration:none;border-radius:10px;font-weight:600;">
            Verificar correo
          </a>
          <p style="margin:18px 0 0 0;font-size:13px;color:#64748b;line-height:1.6;">
            Si el botón no funciona, copia y pega este enlace:
            <br />
            <a href="${link}" style="color:#0ea5e9;text-decoration:none;word-break:break-all;">${link}</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}
