import pytest
from rest_framework.test import APIRequestFactory
from portfolio.serializers import ProjectSerializer, SkillSerializer, ContactMessageSerializer, ExperienceSerializer

pytestmark = pytest.mark.django_db

class TestProjectSerializer:
    def test_serialize_project(self):
        from portfolio.models import Project
        p = Project.objects.create(title="Test", description="desc", category="web", technologies="React, Django")
        s = ProjectSerializer(p)
        assert s.data["title"] == "Test"
        assert "technologies_list" in s.data
        assert s.data["technologies_list"] == ["React", "Django"]

    def test_deserialize_project(self):
        data = {"title": "New", "description": "desc", "category": "mobile", "technologies": "Flutter"}
        s = ProjectSerializer(data=data)
        assert s.is_valid()
        p = s.save()
        assert p.title == "New"

class TestSkillSerializer:
    def test_skill_serialization(self):
        from portfolio.models import Skill
        sk = Skill.objects.create(name="Python", category="backend", proficiency=85)
        s = SkillSerializer(sk)
        assert s.data["proficiency"] == 85

class TestContactMessageSerializer:
    def test_valid_contact(self):
        data = {"name": "A", "email": "a@a.com", "phone": "+255700000000", "country_code": "TZ", "subject": "Hi", "message": "Hello"}
        s = ContactMessageSerializer(data=data)
        assert s.is_valid()
        m = s.save()
        assert m.phone == "+255700000000"

    def test_invalid_phone_for_country(self):
        data = {"name": "A", "email": "a@a.com", "phone": "123", "country_code": "US", "subject": "Hi", "message": "Hello"}
        s = ContactMessageSerializer(data=data)
        assert not s.is_valid()
        assert "phone" in s.errors

    def test_japan_phone(self):
        data = {"name": "J", "email": "j@j.com", "phone": "+819012345678", "country_code": "JP", "subject": "Hi", "message": "Hello"}
        s = ContactMessageSerializer(data=data)
        assert s.is_valid()

class TestExperienceSerializer:
    def test_experience(self):
        from portfolio.models import Experience
        e = Experience.objects.create(title="Web Dev", description="Websites", category="web", years=3.0)
        s = ExperienceSerializer(e)
        assert s.data["years"] == "3.0"
