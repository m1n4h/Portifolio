
from django.contrib import admin
from .models import Project, Skill, ContactMessage, UserActivity, EmailLog, SystemLog

# Register all models with default admin
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'featured', 'is_active', 'created_at']
    list_filter = ['category', 'status', 'featured', 'is_active']
    search_fields = ['title', 'description', 'technologies']

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['action', 'page', 'device_type', 'created_at']
    list_filter = ['action', 'device_type', 'created_at']
    readonly_fields = ['created_at']

@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'subject', 'status', 'sent_at']
    list_filter = ['status', 'sent_at']

@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'model_name', 'created_at']
    list_filter = ['action', 'model_name', 'created_at']

# Admin site headers
admin.site.site_header = 'Amina Kalonge Portfolio Administration'
admin.site.site_title = 'Portfolio Admin'
admin.site.index_title = 'Dashboard Overview'