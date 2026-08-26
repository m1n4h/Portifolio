from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from django.views.generic import TemplateView

def api_root(request):
    return JsonResponse({
        'message': 'Amina Kalonge Portfolio API',
        'endpoints': {
            'projects': '/api/projects/',
            'skills': '/api/skills/',
            'contact': '/api/contact/',
            'admin': '/admin/',
            'dashboard': '/api/dashboard/statistics/',
            'analytics': '/api/dashboard/analytics/',
            'activities': '/api/activities/',
        },
        'version': '2.0.0',
        'developer': 'Amina Kalonge'
    })

urlpatterns = [
    # Root API endpoint
    path('', api_root, name='api-root'),

    # Portfolio app URLs (includes both API and admin)
    path('', include('portfolio.urls')),

    # Default Django admin
    path('admin/', admin.site.urls),

    # Serve React frontend - catch-all for non-API routes
    path('app/', TemplateView.as_view(template_name='index.html'), name='frontend'),
    re_path(r'^app/(?:.*)/?$', TemplateView.as_view(template_name='index.html'), name='frontend-catchall'),
]

# Update default admin site headers
admin.site.site_header = 'Amina Kalonge Portfolio Administration'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Dashboard Overview'
