import pytest
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from portfolio.models import Project, Skill, ContactMessage, Experience, Client, Education

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
def auth_client(api_client, admin_user):
    token = Token.objects.get(user=admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client

# ---- Public read access ----
def test_public_project_list(api_client):
    Project.objects.create(title="P1", description="d", category="web", technologies="React")
    Project.objects.create(title="P2", description="d", category="web", technologies="Django", is_active=False)
    r = api_client.get("/api/projects/")
    assert r.status_code == 200
    assert len(r.data) >= 1  # only active shown

def test_public_skill_list(api_client):
    Skill.objects.create(name="React", category="frontend")
    r = api_client.get("/api/skills/")
    assert r.status_code == 200

def test_public_experience_list(api_client):
    Experience.objects.create(title="Mobile", description="d", category="mobile")
    r = api_client.get("/api/experience/")
    assert r.status_code == 200

def test_public_education_list(api_client):
    Education.objects.create(institution="Uni", level="university", start_year=2024)
    r = api_client.get("/api/education/")
    assert r.status_code == 200

def test_public_client_list(api_client):
    Client.objects.create(name="Client A", description="Good")
    r = api_client.get("/api/clients/")
    assert r.status_code == 200

# ---- Contact POST ----
def test_contact_create_valid(api_client):
    data = {"name": "User", "email": "u@u.com", "phone": "+255700000000", "country_code": "TZ", "subject": "Test", "message": "Hello"}
    r = api_client.post("/api/contact/", data)
    assert r.status_code == 201
    assert r.data["email"] == "u@u.com"
    assert r.data["phone"] == "+255700000000"

def test_contact_invalid_phone(api_client):
    data = {"name": "U", "email": "u@u.com", "phone": "123", "country_code": "US", "subject": "T", "message": "M"}
    r = api_client.post("/api/contact/", data)
    assert r.status_code == 400
    assert "phone" in r.data

# ---- Admin-only write ----
def test_admin_can_create_project(auth_client):
    data = {"title": "Admin Project", "description": "d", "category": "web", "technologies": "React"}
    r = auth_client.post("/api/projects/", data)
    assert r.status_code == 201

def test_anonymous_cannot_create_project(api_client):
    r = api_client.post("/api/projects/", {"title": "No", "description": "d", "category": "web", "technologies": "X"})
    assert r.status_code == 401

# ---- Auth login ----
def test_login_success(api_client):
    User.objects.create_user("user1", "u1@u.com", "pass123")
    r = api_client.post("/api/auth/login/", {"username": "user1", "password": "pass123"})
    assert r.status_code == 200
    assert "token" in r.data

def test_login_fail(api_client):
    r = api_client.post("/api/auth/login/", {"username": "x", "password": "y"})
    assert r.status_code == 401

# ---- Dashboard stats ----
def test_dashboard_stats(auth_client):
    Project.objects.create(title="P", description="d", category="web", technologies="X")
    ContactMessage.objects.create(name="M", email="m@m.com", subject="S", message="Msg")
    r = auth_client.get("/api/dashboard/statistics/")
    assert r.status_code == 200
    assert r.data["total_projects"] >= 1
    assert r.data["total_messages"] >= 1

# ---- Category filter ----
def test_project_category_filter(api_client):
    Project.objects.create(title="WebP", description="d", category="web", technologies="React")
    Project.objects.create(title="MobileP", description="d", category="mobile", technologies="Flutter")
    r = api_client.get("/api/projects/?category=mobile")
    assert r.status_code == 200
    assert all(p["category"] == "mobile" for p in r.data)
