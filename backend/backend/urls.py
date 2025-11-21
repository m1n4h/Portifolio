# """
# URL configuration for backend project.

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/5.1/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """
# from django.contrib import admin
# from django.urls import path, include  # Fixed: comma instead of capital I
# from django.http import JsonResponse

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include('portfolio.urls')),
    
# ]
"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Define the function BEFORE using it in urlpatterns
def api_root(request):
    return JsonResponse({
        'message': 'Amina Kalonge Portfolio API',
        'endpoints': {
            'projects': '/api/projects/',
            'skills': '/api/skills/',
            'contact': '/api/contact/',
            'admin': '/admin/',
            'portfolio_admin': '/admin/portfolio/',
            'analytics': '/admin/portfolio/analytics/'
        },
        'version': '1.0.0',
        'developer': 'Amina Kalonge'
    })

urlpatterns = [
    # Root API endpoint (must come first to avoid conflicts)
    path('', api_root, name='api-root'),
    
    # Portfolio app URLs (includes both API and enhanced admin)
    path('', include('portfolio.urls')),
    
    # Default Django admin (for backward compatibility)
    path('admin/', admin.site.urls),
]

# Update default admin site headers
admin.site.site_header = 'Amina Kalonge Portfolio Administration'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Dashboard Overview'