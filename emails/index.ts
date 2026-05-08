import { Resend } from "resend";
import { SENDER_EMAIL, APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import dotenv from "dotenv";
import PurchaseReceiptEmail from "./purchase-receipt";
import BuildForgotPasswordHtml from "./forgot-password-email";
import { EmailParams, Recipient, Sender } from "mailersend";
import { mailerSend } from "./mail";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: PurchaseReceiptEmail({ order }),
  });
};

export const sendPasswordResetEmail = async ({
  resetUrl,
  email,
}: {
  resetUrl: string;
  email: string;
}) => {
  const sentFrom = new Sender(
    "MS_Qdjo9J@test-dnvo4d9yee9g5r86.mlsender.net",
    "Naga Steel Depots",
  );
  const recipients = [new Recipient(email, email)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Reset Your Password").setHtml(`
 <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
  </head>
  <body style="background:#f4f4f5;margin:0;padding:40px 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;padding:48px 40px;">
            <tr>
              <td>
                <!-- Logo -->
                <img
                  src="https://imufildv0e.ufs.sh/f/V23buOIySRbrJv5bDY5RQcnbEPXhFqDtgV46emwdfsvLkMAK"
                  alt="Naga Steel Depot"
                  width="120"
                  style="display:block;margin:0 0 8px;object-fit:contain;"
                />
                <p style="font-size:11px;color:#a1a1aa;margin:0 0 36px;text-transform:uppercase;letter-spacing:2px;">Password Reset</p>

                <p style="font-size:22px;font-weight:700;color:#18181b;margin:0 0 12px;">
                  Reset your password
                </p>
                <p style="font-size:15px;color:#71717a;margin:0 0 32px;line-height:1.6;">
                  We received a request to reset the password for your account.
                  Click the button below to choose a new one. This link expires in <strong style="color:#3f3f46;">1 hour</strong>.
                </p>

                <a href="${resetUrl}"
                   style="display:inline-block;background:#18181b;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
                  Reset Password →
                </a>

                <p style="font-size:13px;color:#a1a1aa;margin:32px 0 0;line-height:1.6;">
                  If you didn't request this, you can safely ignore this email — your password won't change.
                </p>

                <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0;" />
                <p style="font-size:11px;color:#a1a1aa;margin:0;">
                  Or copy this link into your browser:<br />
                  <span style="color:#71717a;word-break:break-all;">${resetUrl}</span>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `);

  await mailerSend.email.send(emailParams);
};
