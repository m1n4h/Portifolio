from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.conf import settings
import os

def serve_frontend(request, path=''):
    """Serve React build files from frontend_dist directory"""
    frontend_dist = os.path.join(settings.BASE_DIR, 'frontend_dist')

    if path:
        file_path = os.path.join(frontend_dist, path)
        if os.path.isfile(file_path):
            ext = os.path.splitext(path)[1].lower()
            content_types = {
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.html': 'text/html',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
            }
            content_type = content_types.get(ext, 'application/octet-stream')
            with open(file_path, 'rb') as f:
                return HttpResponse(f.read(), content_type=content_type)

    # Fallback to index.html for SPA routing
    index_path = os.path.join(frontend_dist, 'index.html')
    if os.path.isfile(index_path):
        with open(index_path, 'r') as f:
            return HttpResponse(f.read(), content_type='text/html')

    return HttpResponse('Frontend not built yet', status=404)

urlpatterns = [
    # Default Django admin
    path('admin/', admin.site.urls),

    # Portfolio API URLs
    path('', include('portfolio.urls')),

    # Catch-all: serve React for all other paths (assets, pages, etc.)
    re_path(r'^(?P<path>.+)$', serve_frontend, name='frontend'),
    re_path(r'^$', serve_frontend, name='frontend-root'),
]

admin.site.site_header = 'Amina Kalonge Portfolio Administration'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Dashboard Overview'
