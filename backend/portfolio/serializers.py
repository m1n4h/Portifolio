from rest_framework import serializers
from .models import Project, ContactMessage, Skill, UserActivity, EmailLog, SystemLog

class ProjectSerializer(serializers.ModelSerializer):
    technologies_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = '__all__'
    
    def get_technologies_list(self, obj):
        return [tech.strip() for tech in obj.technologies.split(',') if tech.strip()]

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = '__all__'

class EmailLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailLog
        fields = '__all__'

class SystemLogSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SystemLog
        fields = ['id', 'action', 'user', 'user_username', 'model_name', 'object_id', 
                 'changes', 'ip_address', 'created_at']

class AdminDashboardSerializer(serializers.Serializer):
    total_projects = serializers.IntegerField()
    active_projects = serializers.IntegerField()
    total_skills = serializers.IntegerField()
    active_skills = serializers.IntegerField()
    total_messages = serializers.IntegerField()
    unread_messages = serializers.IntegerField()
    total_visits = serializers.IntegerField()
    unique_visitors = serializers.IntegerField()
    recent_messages = ContactMessageSerializer(many=True)
    recent_activities = UserActivitySerializer(many=True)