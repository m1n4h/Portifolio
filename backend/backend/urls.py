from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import os

def serve_frontend(request, path=''):
    """Serve React build files from frontend_dist directory"""
    frontend_dist = os.path.join(settings.BASE_DIR, 'frontend_dist')

    if path and path != '/':
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

    index_path = os.path.join(frontend_dist, 'index.html')
    if os.path.isfile(index_path):
        with open(index_path, 'r') as f:
            return HttpResponse(f.read(), content_type='text/html')

    return HttpResponse(f'Frontend not found. BASE_DIR={settings.BASE_DIR}, frontend_dist exists={os.path.isdir(frontend_dist)}, contents={os.listdir(frontend_dist) if os.path.isdir(frontend_dist) else "N/A"}', status=404)

def debug_frontend(request):
    """Debug endpoint to check frontend files"""
    frontend_dist = os.path.join(settings.BASE_DIR, 'frontend_dist')
    exists = os.path.isdir(frontend_dist)
    files = []
    if exists:
        for root, dirs, filenames in os.walk(frontend_dist):
            for f in filenames:
                rel = os.path.relpath(os.path.join(root, f), frontend_dist)
                files.append(rel)
    return JsonResponse({
        'BASE_DIR': str(settings.BASE_DIR),
        'frontend_dist_exists': exists,
        'frontend_dist_path': frontend_dist,
        'files': sorted(files),
    })

urlpatterns = [
    # Debug endpoint
    path('_debug/frontend/', debug_frontend, name='debug-frontend'),

    # Default Django admin
    path('admin/', admin.site.urls),

    # Portfolio app URLs (includes API endpoints at /api/)
    path('', include('portfolio.urls')),

    # Serve React frontend - catch-all
    re_path(r'^(?:.*)/?$', serve_frontend, name='frontend'),
]

admin.site.site_header = 'Amina Kalonge Portfolio Administration'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Dashboard Overview'
