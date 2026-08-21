from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, ProjectViewSet, SkillViewSet, ContactMessageViewSet,
    AdminDashboardViewSet, UserActivityViewSet
)

# API Router
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'dashboard', AdminDashboardViewSet, basename='dashboard')
router.register(r'activities', UserActivityViewSet, basename='activity')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    # API Endpoints
    path('api/', include(router.urls)),
]