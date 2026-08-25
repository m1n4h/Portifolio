import pytest
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from portfolio.models import ContactMessage, Project, Skill

pytestmark = pytest.mark.django_db

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user():
    u = User.objects.create_superuser("admin", "admin@test.com", "admin123")
    Token.objects.create(user=u)
    return u

@pytest.fixture
def admin_client(api_client, admin_user):
    token = Token.objects.get(user=admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client

@pytest.fixture
def regular_user():
    u = User.objects.create_user("regular", "reg@test.com", "pass123")
    Token.objects.create(user=u)
    return u

@pytest.fixture
def regular_client(api_client, regular_user):
    token = Token.objects.get(user=regular_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client

class TestAuthSecurity:
    def test_token_required_for_protected_endpoints(self, api_client):
        r = api_client.post("/api/projects/", {"title": "X", "description": "d", "category": "web", "technologies": "Y"})
        assert r.status_code == 401

    def test_invalid_token_rejected(self, api_client):
        api_client.credentials(HTTP_AUTHORIZATION="Token invalid123")
        r = api_client.post("/api/projects/", {"title": "X", "description": "d", "category": "web", "technologies": "Y"})
        assert r.status_code == 401

    def test_token_belongs_to_user(self, regular_client):
        r = regular_client.get("/api/auth/me/")
        assert r.status_code == 200
        assert r.data["username"] == "regular"

class TestInputValidation:
    def test_sql_injection_contact_subject(self, api_client):
        data = {"name": "A", "email": "a@a.com", "phone": "+255700000000", "country_code": "TZ", 
                "subject": "'; DROP TABLE portfolio_contactmessage; --", "message": "test"}
        r = api_client.post("/api/contact/", data)
        assert r.status_code in (201, 400)

    def test_xss_in_contact_message(self, api_client):
        data = {"name": "A", "email": "a@a.com", "phone": "+255700000000", "country_code": "TZ",
                "subject": "Test", "message": "<script>alert('xss')</script>"}
        r = api_client.post("/api/contact/", data)
        assert r.status_code == 201
        assert "<script>" in r.data["message"]

    def test_phone_validation_blocks_invalid(self, api_client):
        data = {"name": "A", "email": "a@a.com", "phone": "123", "country_code": "US",
                "subject": "T", "message": "M"}
        r = api_client.post("/api/contact/", data)
        assert r.status_code == 400
        assert "phone" in r.data

    def test_long_input_truncated_or_rejected(self, api_client):
        long_text = "A" * 10000
        data = {"name": "A", "email": "a@a.com", "phone": "+255700000000", "country_code": "TZ",
                "subject": long_text, "message": long_text}
        r = api_client.post("/api/contact/", data)
        assert r.status_code in (201, 400)

class TestCSRFProtection:
    def test_no_csrf_for_token_auth_get(self, api_client):
        r = api_client.get("/api/projects/")
        assert r.status_code == 200

    def test_token_auth_write_requires_staff(self, regular_client):
        # Token auth alone is not enough - must be staff
        r = regular_client.post("/api/projects/", {"title": "Test", "description": "d", "category": "web", "technologies": "React"})
        assert r.status_code == 403

class TestRateLimiting:
    def test_rapid_requests_not_rate_limited_currently(self, api_client):
        for i in range(10):
            r = api_client.get("/api/projects/")
            assert r.status_code == 200

class TestAdminPermissions:
    def test_regular_user_cannot_access_dashboard(self, regular_client):
        r = regular_client.get("/api/dashboard/statistics/")
        assert r.status_code == 403

    def test_superuser_can_access_dashboard(self, admin_client):
        r = admin_client.get("/api/dashboard/statistics/")
        assert r.status_code == 200

    def test_regular_user_cannot_create_skill(self, regular_client):
        r = regular_client.post("/api/skills/", {"name": "Test", "category": "frontend", "proficiency": 50})
        assert r.status_code == 403

    def test_admin_can_create_skill(self, admin_client):
        r = admin_client.post("/api/skills/", {"name": "NewSkill", "category": "backend", "proficiency": 80})
        assert r.status_code == 201

class TestSMSReplySecurity:
    def test_reply_via_sms_only_with_phone(self, admin_client):
        msg = ContactMessage.objects.create(name="A", email="a@a.com", phone="+255700000000", country_code="TZ", subject="S", message="M")
        r = admin_client.post(f"/api/contact/{msg.id}/reply/", {"reply": "Hi", "via": "sms"})
        assert r.status_code == 200
        assert "sms" in r.data["details"]

    def test_reply_via_sms_skipped_without_phone(self, admin_client):
        msg = ContactMessage.objects.create(name="A", email="a@a.com", subject="S", message="M")
        r = admin_client.post(f"/api/contact/{msg.id}/reply/", {"reply": "Hi", "via": "sms"})
        assert r.status_code == 200
        assert r.data["details"]["sms"] == "skipped: no phone number"

    def test_reply_via_email_works(self, admin_client):
        msg = ContactMessage.objects.create(name="A", email="a@a.com", phone="+255700000000", country_code="TZ", subject="S", message="M")
        r = admin_client.post(f"/api/contact/{msg.id}/reply/", {"reply": "Hi", "via": "email"})
        assert r.status_code == 200
        assert "email" in r.data["details"]
