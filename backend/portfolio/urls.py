from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, ProjectViewSet, SkillViewSet, ContactMessageViewSet,
    AdminDashboardViewSet, UserActivityViewSet, ExperienceViewSet, ClientViewSet, EducationViewSet,
    ProfessionalQualificationViewSet
)

# API Router
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'dashboard', AdminDashboardViewSet, basename='dashboard')
router.register(r'activities', UserActivityViewSet, basename='activity')
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'qualifications', ProfessionalQualificationViewSet, basename='qualification')

urlpatterns = [
    # API Endpoints
    path('api/', include(router.urls)),
]