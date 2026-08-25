import pytest
from django.contrib.auth.models import User
from portfolio.models import Project, Skill, ContactMessage, Experience, Client, Education

pytestmark = pytest.mark.django_db

# ---- Project ----
class TestProjectModel:
    def test_create_project(self):
        p = Project.objects.create(title="Test Web App", description="A web app", category="web", technologies="React, Django", featured=True)
        assert str(p) == "Test Web App"
        assert p.is_active is True
        assert p.featured is True

    def test_project_ordering(self):
        # Create fresh projects for ordering test
        p1 = Project.objects.create(title="B", description="d", category="web", technologies="React", order=2)
        p2 = Project.objects.create(title="A", description="d", category="web", technologies="React", order=1)
        # Order by order field, then by -created_at
        ordered = list(Project.objects.filter(id__in=[p1.id, p2.id]).order_by("order", "-created_at").values_list("title", flat=True))
        assert ordered == ["A", "B"]

    def test_project_categories(self):
        for cat in ["web", "mobile", "desktop"]:
            p = Project.objects.create(title=f"P-{cat}", description="d", category=cat, technologies="X")
            assert p.category == cat

    def test_project_status_choices(self):
        for s in ["completed", "in_progress", "planned"]:
            p = Project.objects.create(title=f"S-{s}", description="d", category="web", technologies="X", status=s)
            assert p.status == s

# ---- Skill ----
class TestSkillModel:
    def test_create_skill(self):
        s = Skill.objects.create(name="React", category="frontend", proficiency=90)
        assert str(s) == "React"
        assert s.proficiency == 90

    def test_skill_default_proficiency(self):
        s = Skill.objects.create(name="Python", category="backend")
        assert s.proficiency == 80

    def test_skill_inactive(self):
        # Test inactive filtering works
        s = Skill.objects.create(name="OldSkill", category="tools", is_active=False)
        assert not s.is_active
        assert s not in Skill.objects.filter(is_active=True)

# ---- ContactMessage ----
class TestContactMessageModel:
    def test_create_contact(self):
        m = ContactMessage.objects.create(name="John", email="john@example.com", phone="+255700000000", country_code="TZ", subject="Hi", message="Hello")
        assert str(m) == "John - Hi"
        assert m.is_read is False

    def test_contact_ordering(self):
        m1 = ContactMessage.objects.create(name="A", email="a@a.com", subject="S1", message="m1")
        m2 = ContactMessage.objects.create(name="B", email="b@b.com", subject="S2", message="m2")
        msgs = list(ContactMessage.objects.filter(id__in=[m1.id, m2.id]).order_by("-created_at"))
        assert msgs[0].name == "B"

    def test_contact_country_code(self):
        m = ContactMessage.objects.create(name="X", email="x@x.com", phone="+819012345678", country_code="JP", subject="S", message="M")
        assert m.country_code == "JP"
        assert m.phone == "+819012345678"

# ---- Experience ----
class TestExperienceModel:
    def test_create_experience(self):
        e = Experience.objects.create(title="Mobile Dev", description="Apps", category="mobile", years=2.0, icon="📱")
        assert str(e) == "Mobile Dev"
        assert float(e.years) == 2.0

    def test_experience_ordering(self):
        e1 = Experience.objects.create(title="B", description="d", category="web", order=2)
        e2 = Experience.objects.create(title="A", description="d", category="web", order=1)
        ordered = list(Experience.objects.filter(id__in=[e1.id, e2.id]).order_by("order").values_list("title", flat=True))
        assert ordered == ["A", "B"]

# ---- Client ----
class TestClientModel:
    def test_create_client(self):
        c = Client.objects.create(name="Acme", description="Great", testimonial="Awesome!", rating=5)
        assert str(c) == "Acme"
        assert c.rating == 5

# ---- Education ----
class TestEducationModel:
    def test_create_education(self):
        e = Education.objects.create(institution="Uni", level="university", start_year=2024, course="BSc IT", is_current=True)
        assert "Uni" in str(e)
        assert e.is_current is True
        assert e.level == "university"

    def test_education_ongoing(self):
        e = Education.objects.create(institution="Uni", level="university", start_year=2024, end_year=None)
        assert e.end_year is None
        assert "Ongoing" in str(e)
