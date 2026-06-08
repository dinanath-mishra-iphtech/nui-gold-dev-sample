import nodemailer from "nodemailer";
import { logger } from "../../config/logger";
import { env } from "../../config/env";

/**
 * Email Provider Interface
 *
 * Implement this interface to integrate with any email service
 * (e.g., Nodemailer + SMTP, AWS SES, SendGrid, Resend).
 */
export interface EmailProvider {
  /**
   * Send an email.
   * @param to - Recipient email address
   * @param subject - Email subject line
   * @param html - HTML body content
   * @returns true if the email was dispatched successfully
   */
  sendEmail(to: string, subject: string, html: string): Promise<boolean>;
}

/**
 * Gmail Email Provider (Nodemailer + Gmail SMTP)
 *
 * Sends real emails via Gmail's SMTP server.
 *
 * Requirements:
 * - Enable 2-Factor Authentication on your Google account
 * - Generate an App Password: https://myaccount.google.com/apppasswords
 * - Set SMTP_USER (your Gmail address) and SMTP_PASS (the app password) in .env
 */
class GmailEmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"NUI Gold" <${env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      logger.info(
        { messageId: info.messageId, to },
        "📧 Email sent successfully",
      );

      return true;
    } catch (error) {
      logger.error({ error, to, subject }, "📧 Failed to send email");
      throw error;
    }
  }
}

/**
 * Console Email Provider (Development Fallback)
 *
 * Logs email details to the console when SMTP is not configured.
 */
class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    logger.info(
      { to, subject, htmlLength: html.length },
      "📧 [DEV EMAIL] Email dispatched (console-only)",
    );

    // Extract the reset link from the HTML for easy dev testing
    const linkMatch = html.match(/href="([^"]*reset-password[^"]*)"/);
    if (linkMatch) {
      logger.info(
        { resetLink: linkMatch[1] },
        "🔗 [DEV EMAIL] Reset link for testing",
      );
    }

    return true;
  }
}

/**
 * Active email provider instance.
 *
 * Uses Gmail SMTP when SMTP_USER and SMTP_PASS are configured,
 * otherwise falls back to console logging for development.
 */
export const emailProvider: EmailProvider =
  env.SMTP_USER && env.SMTP_PASS
    ? new GmailEmailProvider()
    : new ConsoleEmailProvider();
