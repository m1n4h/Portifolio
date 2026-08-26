from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from django.views.generic import TemplateView

urlpatterns = [
    # Default Django admin
    path('admin/', admin.site.urls),

    # Portfolio app URLs (includes API endpoints at /api/)
    path('', include('portfolio.urls')),

    # Serve React frontend - catch-all for all other routes
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]

# Update default admin site headers
admin.site.site_header = 'Amina Kalonge Portfolio Administration'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Dashboard Overview'
