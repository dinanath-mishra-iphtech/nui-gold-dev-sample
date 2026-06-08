import twilio from "twilio";
import { logger } from "../../config/logger";
import { env } from "../../config/env";


/**
 * SMS Provider Interface
 *
 * Implement this interface to integrate with any SMS gateway
 * (e.g., Twilio, MSG91, AWS SNS, Fast2SMS).
 */
export interface SmsProvider {
  /**
   * Send an SMS message to the given phone number.
   * @param phone - Phone number in E.164 format (e.g., +919876543210)
   * @param message - The SMS body text
   * @returns true if the SMS was dispatched successfully
   */
  sendSms(phone: string, message: string): Promise<boolean>;
}

/**
 * Twilio SMS Provider
 *
 * Sends real SMS messages via the Twilio API.
 *
 * Requirements:
 * - Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env
 */
class TwilioSmsProvider implements SmsProvider {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(phone: string, message: string): Promise<boolean> {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: env.TWILIO_PHONE_NUMBER,
        to: phone,
      });

      logger.info(
        { messageSid: result.sid, to: phone },
        "SMS sent successfully via Twilio",
      );

      return true;
    } catch (error) {
      logger.error({ error, to: phone }, "Failed to send SMS via Twilio");
      throw error;
    }
  }
}

/**
 * Console SMS Provider (Development Only)
 *
 * Logs OTP messages to the console instead of sending real SMS.
 * Replace this with a real provider (Twilio, MSG91, etc.) for production.
 */
class ConsoleSmsProvider implements SmsProvider {
  async sendSms(phone: string, message: string): Promise<boolean> {
    logger.info(
      { phone, message },
      "📱 [DEV SMS] OTP message dispatched (console-only)",
    );
    return true;
  }
}

/**
 * Active SMS provider instance.
 *
 * Uses Twilio when TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and
 * TWILIO_PHONE_NUMBER are configured, otherwise falls back to
 * console logging for development.
 */
export const smsProvider: SmsProvider =
  env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER
    ? new TwilioSmsProvider()
    : new ConsoleSmsProvider();
