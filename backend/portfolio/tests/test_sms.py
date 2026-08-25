import pytest
from portfolio.sms_utils import format_phone_e164

def test_format_tanzania_phone():
    formatted, valid, err = format_phone_e164("0700000000", "TZ")
    assert valid
    assert formatted == "+255700000000"

def test_format_already_e164():
    formatted, valid, err = format_phone_e164("+255700000000", "TZ")
    assert valid
    assert formatted == "+255700000000"

def test_format_japan_phone():
    formatted, valid, err = format_phone_e164("09012345678", "JP")
    assert valid
    assert formatted == "+819012345678"

def test_format_us_phone():
    formatted, valid, err = format_phone_e164("4155551234", "US")
    assert valid
    assert formatted == "+14155551234"

def test_invalid_us_phone():
    formatted, valid, err = format_phone_e164("123", "US")
    assert not valid

def test_format_kenya_phone():
    formatted, valid, err = format_phone_e164("0712345678", "KE")
    assert valid
    assert formatted == "+254712345678"

# SMS send test (dev mode - just checks it doesn't crash)
@pytest.mark.django_db
def test_send_sms_dev_mode():
    from portfolio.sms_utils import send_sms
    ok, info = send_sms("+255700000000", "Test message")
    assert ok
    assert "dev mode" in info.lower()
