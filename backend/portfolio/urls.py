# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import ProjectViewSet, SkillViewSet, ContactMessageViewSet

# router = DefaultRouter()
# router.register(r'projects', ProjectViewSet)
# router.register(r'skills', SkillViewSet)
# router.register(r'contact', ContactMessageViewSet)

# urlpatterns = [
#     path('api/', include(router.urls)),
    
# ]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, SkillViewSet, ContactMessageViewSet

# API Router
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'contact', ContactMessageViewSet)

urlpatterns = [
   
    
    # API Endpoints
    path('api/', include(router.urls)),
]