import os
import logging

logger = logging.getLogger(__name__)


def send_sms(to_phone, message):
    """
    Send SMS to a phone number.
    - If Twilio credentials are configured, sends real SMS via Twilio.
    - Otherwise, logs to console/file (dev mode) and returns success.
    Returns (success: bool, info: str)
    """
    twilio_sid = os.environ.get('TWILIO_ACCOUNT_SID', '')
    twilio_token = os.environ.get('TWILIO_AUTH_TOKEN', '')
    twilio_from = os.environ.get('TWILIO_PHONE_NUMBER', '')

    if twilio_sid and twilio_token and twilio_from:
        try:
            from twilio.rest import Client
            client = Client(twilio_sid, twilio_token)
            msg = client.messages.create(
                body=message,
                from_=twilio_from,
                to=to_phone
            )
            logger.info(f"SMS sent via Twilio to {to_phone}: SID {msg.sid}")
            return True, f"Sent via Twilio (SID: {msg.sid})"
        except ImportError:
            logger.warning("twilio package not installed, falling back to console log")
        except Exception as e:
            logger.error(f"Twilio SMS failed: {e}")
            return False, str(e)

    # Dev mode: log to console and file
    log_msg = f"[SMS] To: {to_phone} | Message: {message}"
    print(log_msg)
    logger.info(log_msg)
    # Also log to a file for admin to see
    try:
        from pathlib import Path
        log_file = Path(__file__).resolve().parent.parent / "sms_log.txt"
        with open(log_file, "a") as f:
            from datetime import datetime
            f.write(f"{datetime.now().isoformat()} | {log_msg}\n")
    except Exception:
        pass

    return True, "Logged (dev mode - configure Twilio for real SMS)"


def format_phone_e164(phone, country_code="TZ"):
    """
    Format phone number to E.164 format using phonenumbers library.
    Returns (formatted_phone, is_valid, error_message)
    """
    try:
        import phonenumbers
        # If phone already starts with +, parse directly
        if phone.startswith("+"):
            parsed = phonenumbers.parse(phone, None)
        else:
            # Remove leading 0 if present for national numbers
            parsed = phonenumbers.parse(phone, country_code)

        is_valid = phonenumbers.is_valid_number(parsed)
        is_possible = phonenumbers.is_possible_number(parsed)
        formatted = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)

        if not is_valid and not is_possible:
            return phone, False, "Invalid phone number for the selected country"

        return formatted, True, ""
    except Exception as e:
        return phone, False, str(e)
