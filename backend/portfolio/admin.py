# from django.contrib import admin
# from .models import Project, Skill, ContactMessage

# @admin.register(Project)
# class ProjectAdmin(admin.ModelAdmin):
#     list_display = ['title', 'category', 'featured', 'created_at']
#     list_filter = ['category', 'featured', 'created_at']
#     search_fields = ['title', 'description', 'technologies']
#     list_editable = ['featured']
#     ordering = ['-created_at']

# @admin.register(Skill)
# class SkillAdmin(admin.ModelAdmin):
#     list_display = ['name', 'category', 'proficiency', 'order']
#     list_filter = ['category']
#     search_fields = ['name']
#     ordering = ['category', 'order']

# @admin.register(ContactMessage)
# class ContactMessageAdmin(admin.ModelAdmin):
#     list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
#     list_filter = ['is_read', 'created_at']
#     search_fields = ['name', 'email', 'subject']
#     readonly_fields = ['created_at']
#     list_editable = ['is_read']
from django.contrib import admin
from .models import Project, Skill, ContactMessage
from django.urls import path


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'featured', 'created_at']
    list_filter = ['category', 'featured', 'created_at']
    search_fields = ['title', 'description', 'technologies']
    list_editable = ['featured']
    ordering = ['-created_at']

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'order']
    list_filter = ['category']
    search_fields = ['name']
    ordering = ['category', 'order']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['created_at']
    list_editable = ['is_read']