from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from django.utils import timezone

class Project(models.Model):
    PROJECT_CATEGORIES = [
        ('web', 'Web Development'),
        ('mobile', 'Mobile Application'),
        ('desktop', 'Desktop'),
    ]
    
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
        ('planned', 'Planned'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=PROJECT_CATEGORIES)
    technologies = models.CharField(max_length=500)
    image_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order', '-created_at']

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    country_code = models.CharField(max_length=5, blank=True, default="TZ")
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    is_replied = models.BooleanField(default=False)
    reply = models.TextField(blank=True, null=True)
    replied_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
    
    class Meta:
        ordering = ['-created_at']

class Skill(models.Model):
    SKILL_CATEGORIES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('mobile', 'Mobile'),
        ('database', 'Database'),
        ('tools', 'Tools'),
        ('design', 'Design'),
        ('devops', 'DevOps'),
    ]
    
    name = models.CharField(max_length=50)
    category = models.CharField(max_length=20, choices=SKILL_CATEGORIES)
    proficiency = models.IntegerField(default=80)  # Percentage
    icon = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'order']

    def __str__(self):
        return self.name

class UserActivity(models.Model):
    ACTION_CHOICES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('view', 'View'),
        ('click', 'Click'),
        ('submit', 'Submit'),
        ('download', 'Download'),
        ('visit', 'Visit'),
        ('scroll', 'Scroll'),
        ('hover', 'Hover'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True, null=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    page = models.CharField(max_length=255, blank=True, null=True)
    section = models.CharField(max_length=255, blank=True, null=True)
    data = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    device_type = models.CharField(max_length=50, blank=True, null=True)
    browser = models.CharField(max_length=50, blank=True, null=True)
    os = models.CharField(max_length=50, blank=True, null=True)
    duration = models.IntegerField(blank=True, null=True, help_text='Duration in seconds')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action', 'created_at']),
            models.Index(fields=['session_id']),
        ]
    
    def __str__(self):
        return f"{self.action} - {self.created_at}"

class EmailLog(models.Model):
    recipient = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ], default='pending')
    error_message = models.TextField(blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"Email to {self.recipient} - {self.status}"

class Experience(models.Model):
    CATEGORY_CHOICES = [
        ('mobile', 'Mobile Development'),
        ('web', 'Web Development'),
        ('cybersecurity', 'Cybersecurity'),
        ('networking', 'Networking'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    years = models.DecimalField(max_digits=3, decimal_places=1, default=1.0)
    icon = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Client(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    company = models.CharField(max_length=200, blank=True)
    testimonial = models.TextField(blank=True)
    rating = models.IntegerField(default=5)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Education(models.Model):
    LEVEL_CHOICES = [
        ('primary', 'Primary'),
        ('secondary', 'Secondary'),
        ('advanced', 'Advanced'),
        ('university', 'University'),
    ]
    institution = models.CharField(max_length=300)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    start_year = models.IntegerField()
    end_year = models.IntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    course = models.CharField(max_length=300, blank=True)
    is_current = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'start_year']

    def __str__(self):
        return f"{self.institution} ({self.start_year}-{self.end_year or 'Ongoing'})"


class SystemLog(models.Model):
    action = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    model_name = models.CharField(max_length=100, blank=True, null=True)
    object_id = models.IntegerField(blank=True, null=True)
    changes = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action} by {self.user} at {self.created_at}"


class ProfessionalQualification(models.Model):
    MODE_CHOICES = [
        ('online', 'Online'),
        ('in_person', 'In Person'),
        ('hybrid', 'Hybrid'),
    ]

    country = models.CharField(max_length=100)
    institution = models.CharField(max_length=300)
    course = models.CharField(max_length=300)
    mode_of_learning = models.CharField(max_length=20, choices=MODE_CHOICES, default='online')
    issuer = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    certificate = models.FileField(upload_to='certificates/', blank=True, null=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-start_date']

    def __str__(self):
        return f"{self.course} - {self.institution}"