import "server-only";
import { Resend } from "resend";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "OpenDayCare <onboarding@resend.dev>";

export type InvitationEmailInput = {
  to: string;
  childName: string;
  code: string;
  expiresAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const sendInvitationEmail = async ({
  to,
  childName,
  code,
  expiresAt,
}: InvitationEmailInput): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);
  const childFirstName = childName.split(" ")[0];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const activationUrl = `${appUrl}/activate-account?code=${code}`;
  const expiresAtLabel = dateFormatter.format(new Date(expiresAt));

  const html = `
<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background-color:#F6ECDF;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6ECDF;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#FBF4EC;border:1px solid #ECE0D0;border-radius:16px;padding:32px;">
            <tr>
              <td style="font-size:22px;font-weight:bold;color:#3F362E;padding-bottom:8px;">
                OpenDayCare
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.5;color:#3F362E;padding-bottom:16px;">
                Te invitaron a seguir a <strong>${childFirstName}</strong> en la guardería.
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color:#FBF1D6;border:1px dashed #E6D08A;border-radius:12px;padding:20px;">
                <div style="font-size:12px;letter-spacing:1px;color:#A88526;padding-bottom:8px;">CÓDIGO DE INVITACIÓN</div>
                <div style="font-size:34px;letter-spacing:8px;font-weight:bold;color:#8A7234;">${code}</div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 0;">
                <a href="${activationUrl}" style="display:inline-block;background-color:#EE8164;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;border-radius:12px;padding:14px 28px;">
                  Activar mi cuenta
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.5;color:#94887B;padding-bottom:8px;">
                Este código vence en 7 días (<strong>${expiresAtLabel}</strong>). Si venció, pedí una nueva invitación al personal de la guardería.
              </td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#A89A8B;">
                Si no esperabas este correo, podés ignorarlo.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Te invitaron a seguir a ${childFirstName} en OpenDayCare`,
    html,
  });

  if (error) {
    throw new Error(`Resend email failed (${error.name}): ${error.message}`);
  }
};
