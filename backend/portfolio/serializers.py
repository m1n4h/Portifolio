from rest_framework import serializers
from .models import Project, ContactMessage, Skill, UserActivity, EmailLog, SystemLog, Experience, Client, Education, ProfessionalQualification

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

    def validate_phone(self, value):
        if not value:
            return value
        country = self.initial_data.get('country_code', 'TZ')
        from .sms_utils import format_phone_e164
        formatted, is_valid, error = format_phone_e164(value, country)
        if not is_valid:
            raise serializers.ValidationError(f"Invalid phone number for {country}: {error}")
        return formatted

    def validate(self, attrs):
        # Store the formatted phone
        phone = attrs.get('phone', '')
        if phone:
            country = attrs.get('country_code', self.initial_data.get('country_code', 'TZ'))
            from .sms_utils import format_phone_e164
            formatted, is_valid, error = format_phone_e164(phone, country)
            if not is_valid:
                raise serializers.ValidationError({"phone": f"Invalid phone number: {error}"})
            attrs['phone'] = formatted
        return attrs

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


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class ProfessionalQualificationSerializer(serializers.ModelSerializer):
    certificate_url = serializers.SerializerMethodField()

    class Meta:
        model = ProfessionalQualification
        fields = '__all__'
        extra_kwargs = {
            'is_active': {'default': True},
        }

    def get_certificate_url(self, obj):
        if obj.certificate:
            return obj.certificate.url
        return None