interface VerifyOtpEmailTemplateParams {
  name: string;
  otp: string | number;
  description: string;
  organization: string;
}

const verifyOtpEmailTemplate = ({ name, otp, description, organization }: VerifyOtpEmailTemplateParams): string => {
  const digits = String(otp).split("");

  const digitBoxes = digits
    .map(
      (d: string) => `
    <td style="padding: 0 5px;">
      <div style="
        width: 48px; height: 56px;
        background-color: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-size: 24px; font-weight: 500;
        color: #111111;
        text-align: center; line-height: 56px;
        font-family: Arial, sans-serif;
      ">${d}</div>
    </td>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: Arial, sans-serif;">

    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 40px auto;">
      <tr>
        <td>
          <div style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e0e0e0;">

            <!-- Header bar -->
            <div style="background: #111111; padding: 16px 28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="width: 8px; height: 8px; background: #ff5f57; border-radius: 50%; display: inline-block; margin-right: 6px;"></div>
                    <div style="width: 8px; height: 8px; background: #febc2e; border-radius: 50%; display: inline-block; margin-right: 6px;"></div>
                    <div style="width: 8px; height: 8px; background: #28c840; border-radius: 50%; display: inline-block; margin-right: 14px;"></div>
                  </td>
                  <td style="font-size: 12px; color: #888888; letter-spacing: 0.5px;">no-reply@${organization.toLowerCase().replace(/\s+/g, '')}.com</td>
                </tr>
              </table>
            </div>

            <!-- Body -->
            <div style="padding: 36px 32px 32px;">

              <!-- Sender row -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 44px; vertical-align: middle;">
                    <div style="width: 44px; height: 44px; background: #111111; border-radius: 50%; text-align: center; line-height: 44px; font-size: 18px; color: #ffffff;">✉</div>
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <p style="margin: 0; font-size: 12px; color: #888888; letter-spacing: 0.3px;">Verification email</p>
                    <p style="margin: 0; font-size: 15px; font-weight: bold; color: #111111;">${organization}</p>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <h1 style="font-size: 24px; font-weight: normal; color: #111111; margin: 0 0 8px;">Hello, ${name} 👋</h1>
              <p style="font-size: 15px; color: #444444; line-height: 1.6; margin: 0 0 4px;">${description}</p>
              <p style="font-size: 13px; color: #888888; margin: 0 0 28px;">From ${organization}</p>

              <!-- OTP digits -->
              <p style="font-size: 11px; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; color: #888888; margin: 0 0 10px;">Your one-time code</p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>${digitBoxes}</tr>
              </table>

              <!-- Expiry notice -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 28px; width: 100%;">
                <tr>
                  <td style="background: #f9f9f9; border: 1px solid #e8e8e8; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #666666;">
                    ⏱ This code expires in <strong style="color: #111111;">15 minutes</strong>
                  </td>
                </tr>
              </table>

              <!-- Footer note -->
              <div style="border-top: 1px solid #f0f0f0; padding-top: 20px;">
                <p style="font-size: 12px; color: #aaaaaa; line-height: 1.6; margin: 0;">
                  © 2026 NexForm, If you didn't request this code, you can safely ignore this email. Someone may have typed your address by mistake.
                </p>
              </div>

            </div>
          </div>
        </td>
      </tr>
    </table>

  </body>
</html>`;
};

export { verifyOtpEmailTemplate };
export type { VerifyOtpEmailTemplateParams };
