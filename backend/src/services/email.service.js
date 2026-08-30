import nodemailer from "nodemailer";

/**
 * Creates and configures the Nodemailer transporter using environment variables.
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  const host = process.env.EMAIL_HOST?.trim() || "smtp.gmail.com";
  const port = parseInt(process.env.EMAIL_PORT?.trim() || "465", 10);
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Escape HTML special characters to prevent HTML/XSS injection in emails
 */
const escapeHtml = (unsafeStr = "") => {
  if (typeof unsafeStr !== "string") return "";
  return unsafeStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Sends an instant email notification to the administrator when a new feature suggestion is submitted.
 * Completely decoupled and isolated so no admin identities or contact info are ever exposed to the client.
 */
export const sendFeatureRequestNotification = async ({
  user,
  suggestion,
  createdAt,
  requestId,
}) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log(
        "ℹ️ [Email Service] Feature notification skipped: EMAIL_USER and EMAIL_PASS not yet configured in .env."
      );
      return { success: false, reason: "credentials_not_configured" };
    }

    const adminRecipient =
      process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
      process.env.EMAIL_USER?.trim();

    if (!adminRecipient) {
      console.log("ℹ️ [Email Service] No recipient email configured.");
      return { success: false, reason: "no_recipient" };
    }

    const formattedDate = createdAt
      ? new Date(createdAt).toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        })
      : new Date().toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        });

    const submitterName = user?.trim() || "Archive Member";
    const safeSuggestion = escapeHtml(suggestion);
    const safeSubmitter = escapeHtml(submitterName);
    const safeRequestId = escapeHtml(requestId || "N/A");

    const mailOptions = {
      from: `"The Many Strings Archive" <${process.env.EMAIL_USER}>`,
      to: adminRecipient,
      subject: `🔔 New Feature Suggestion from ${safeSubmitter}`,
      text: `New Feature Request Submitted:\n\nSubmitter: ${submitterName}\nDate: ${formattedDate}\n\nSuggestion:\n"${suggestion}"\n\nStatus: Pending Review\nRequest ID: ${requestId || "N/A"}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; border: 1px solid #E5DFC0; border-radius: 12px; overflow: hidden; color: #2B2825; box-shadow: 0 4px 16px rgba(43, 40, 37, 0.06);">
          <div style="background-color: #2B2825; padding: 24px; text-align: center;">
            <h1 style="color: #F5F1E8; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.02em;">
              The Many Strings Archive
            </h1>
            <p style="color: #968F85; margin: 6px 0 0; font-size: 13px;">
              New Feature Request Alert
            </p>
          </div>

          <div style="padding: 28px 24px;">
            <div style="margin-bottom: 20px;">
              <span style="display: inline-block; background-color: #E2DBD0; color: #403B37; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.06em;">
                Pending Submission
              </span>
            </div>

            <h2 style="font-size: 17px; margin: 0 0 16px; color: #2B2825;">
              A new community suggestion has been received:
            </h2>

            <div style="background-color: #FFFFFF; border-left: 4px solid #800020; border: 1px solid #E5DFC0; border-left-width: 4px; border-radius: 6px; padding: 18px; margin: 16px 0 24px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #2B2825; font-style: italic;">
                &ldquo;${safeSuggestion}&rdquo;
              </p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
              <tr>
                <td style="padding: 8px 0; color: #6B655D; width: 120px;"><strong>Submitted by:</strong></td>
                <td style="padding: 8px 0; color: #2B2825;">${safeSubmitter}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B655D;"><strong>Received at:</strong></td>
                <td style="padding: 8px 0; color: #2B2825;">${escapeHtml(formattedDate)}</td>
              </tr>
              ${
                requestId
                  ? `<tr>
                      <td style="padding: 8px 0; color: #6B655D;"><strong>Request ID:</strong></td>
                      <td style="padding: 8px 0; color: #2B2825; font-family: monospace;">${safeRequestId}</td>
                    </tr>`
                  : ""
              }
            </table>

            <div style="border-top: 1px solid #E2DBD0; padding-top: 18px; margin-top: 18px; text-align: center;">
              <p style="font-size: 12px; color: #968F85; margin: 0;">
                This notification is generated automatically by your archive backend system.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ [Email Service] Admin notification sent successfully! MessageId:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ [Email Service] Failed to send email alert:", error.message);
    return { success: false, error: error.message };
  }
};
