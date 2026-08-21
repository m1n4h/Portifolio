from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Project, ContactMessage, Skill, UserActivity, EmailLog, SystemLog
from .serializers import (
    ProjectSerializer, ContactMessageSerializer, SkillSerializer,
    UserActivitySerializer, EmailLogSerializer, SystemLogSerializer,
    AdminDashboardSerializer
)
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.shortcuts import get_object_or_404

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'technologies', 'category']
    ordering_fields = ['title', 'order', 'created_at', 'status']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated, IsAdminUser]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = Project.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # If user is not admin, only show active projects
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        return queryset.order_by('-featured', '-created_at')
    
    def perform_create(self, serializer):
        project = serializer.save()
        self.log_activity('create', project)
    
    def perform_update(self, serializer):
        project = serializer.save()
        self.log_activity('update', project)
    
    def perform_destroy(self, instance):
        self.log_activity('delete', instance)
        instance.delete()
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        data = request.data
        project_ids = data.get('ids', [])
        updates = data.get('updates', {})
        
        if not project_ids or not updates:
            return Response({'error': 'Missing ids or updates'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        updated = Project.objects.filter(id__in=project_ids).update(**updates)
        return Response({'updated_count': updated})
    
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        project_ids = request.data.get('ids', [])
        
        if not project_ids:
            return Response({'error': 'Missing ids'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        deleted = Project.objects.filter(id__in=project_ids).delete()
        return Response({'deleted_count': deleted[0]})
    
    @action(detail=False, methods=['post'])
    def bulk_featured(self, request):
        project_ids = request.data.get('ids', [])
        featured = request.data.get('featured', False)
        
        if not project_ids:
            return Response({'error': 'Missing ids'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        updated = Project.objects.filter(id__in=project_ids).update(featured=featured)
        return Response({'updated_count': updated})
    
    def log_activity(self, action, instance):
        SystemLog.objects.create(
            action=action,
            user=self.request.user if self.request.user.is_authenticated else None,
            model_name='Project',
            object_id=instance.id,
            changes={'title': instance.title, 'category': instance.category},
            ip_address=self.get_client_ip()
        )
    
    def get_client_ip(self):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return self.request.META.get('REMOTE_ADDR')

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category', 'description']
    ordering_fields = ['name', 'category', 'order']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated, IsAdminUser]
        return super().get_permissions()
    
    def get_queryset(self):
        queryset = Skill.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # If user is not admin, only show active skills
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        return queryset

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'subject', 'message']
    ordering_fields = ['created_at', 'is_read']

    def create(self, request, *args, **kwargs):
        # Allow public to send messages
        self.permission_classes = [AllowAny]
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Send email notification
        try:
            send_mail(
                f'Portfolio Contact: {serializer.validated_data["subject"]}',
                f'Name: {serializer.validated_data["name"]}\n'
                f'Email: {serializer.validated_data["email"]}\n'
                f'Phone: {serializer.validated_data.get("phone", "")}\n\n'
                f'Message:\n{serializer.validated_data["message"]}',
                settings.DEFAULT_FROM_EMAIL,
                ['admin@example.com'],  # Replace with your email
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'])
    def bulk_mark_read(self, request):
        message_ids = request.data.get('ids', [])
        if not message_ids:
            return Response({'error': 'Missing ids'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        updated = ContactMessage.objects.filter(id__in=message_ids).update(is_read=True)
        return Response({'updated_count': updated})
    
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        message_ids = request.data.get('ids', [])
        if not message_ids:
            return Response({'error': 'Missing ids'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        deleted = ContactMessage.objects.filter(id__in=message_ids).delete()
        return Response({'deleted_count': deleted[0]})
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        message = self.get_object()
        reply_text = request.data.get('reply', '')
        
        if not reply_text:
            return Response({'error': 'Reply message required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            send_mail(
                subject=f"Re: {message.subject}",
                message=reply_text,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[message.email],
                fail_silently=False,
            )
            message.is_replied = True
            message.reply = reply_text
            message.replied_at = timezone.now()
            message.save()
            
            EmailLog.objects.create(
                recipient=message.email,
                subject=f"Re: {message.subject}",
                message=reply_text,
                status='sent'
            )
            
            return Response({'status': 'reply sent successfully'})
        except Exception as e:
            return Response({'error': str(e)}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        data = {
            'total_projects': Project.objects.count(),
            'active_projects': Project.objects.filter(is_active=True).count(),
            'total_skills': Skill.objects.count(),
            'active_skills': Skill.objects.filter(is_active=True).count(),
            'total_messages': ContactMessage.objects.count(),
            'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
            'total_visits': UserActivity.objects.filter(action='visit').count(),
            'unique_visitors': UserActivity.objects.values('session_id').distinct().count(),
            'recent_messages': ContactMessage.objects.all()[:10],
            'recent_activities': UserActivity.objects.all()[:10],
        }
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        messages_by_date = ContactMessage.objects.filter(
            created_at__gte=thirty_days_ago
        ).extra(
            select={'date': 'date(created_at)'}
        ).values('date').annotate(count=Count('id'))
        
        skills_by_category = Skill.objects.values('category').annotate(count=Count('id'))
        projects_by_status = Project.objects.values('status').annotate(count=Count('id'))
        
        activity_by_action = UserActivity.objects.filter(
            created_at__gte=thirty_days_ago
        ).values('action').annotate(count=Count('id'))
        
        visits_by_day = UserActivity.objects.filter(
            action='visit',
            created_at__gte=thirty_days_ago
        ).extra(
            select={'date': 'date(created_at)'}
        ).values('date').annotate(count=Count('id'))
        
        device_types = UserActivity.objects.filter(
            created_at__gte=thirty_days_ago
        ).values('device_type').annotate(count=Count('id'))
        
        browsers = UserActivity.objects.filter(
            created_at__gte=thirty_days_ago
        ).values('browser').annotate(count=Count('id'))
        
        return Response({
            'messages_by_date': messages_by_date,
            'skills_by_category': skills_by_category,
            'projects_by_status': projects_by_status,
            'activity_by_action': activity_by_action,
            'visits_by_day': visits_by_day,
            'device_types': device_types,
            'browsers': browsers,
        })
    
    @action(detail=False, methods=['get'])
    def recent_activity(self, request):
        limit = int(request.GET.get('limit', 20))
        activities = UserActivity.objects.all()[:limit]
        serializer = UserActivitySerializer(activities, many=True)
        return Response(serializer.data)

class UserActivityViewSet(viewsets.ModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        user_agent = self.request.META.get('HTTP_USER_AGENT', '')
        device_type = self.get_device_type(user_agent)
        browser = self.get_browser(user_agent)
        os = self.get_os(user_agent)
        
        serializer.save(
            ip_address=self.get_client_ip(),
            user_agent=user_agent,
            device_type=device_type,
            browser=browser,
            os=os,
            user=self.request.user if self.request.user.is_authenticated else None
        )
    
    def get_client_ip(self):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return self.request.META.get('REMOTE_ADDR')
    
    def get_device_type(self, user_agent):
        user_agent = user_agent.lower()
        if 'mobile' in user_agent:
            return 'mobile'
        elif 'tablet' in user_agent:
            return 'tablet'
        else:
            return 'desktop'
    
    def get_browser(self, user_agent):
        user_agent = user_agent.lower()
        if 'chrome' in user_agent:
            return 'chrome'
        elif 'firefox' in user_agent:
            return 'firefox'
        elif 'safari' in user_agent:
            return 'safari'
        elif 'edge' in user_agent:
            return 'edge'
        else:
            return 'other'
    
    def get_os(self, user_agent):
        user_agent = user_agent.lower()
        if 'windows' in user_agent:
            return 'windows'
        elif 'mac' in user_agent:
            return 'macos'
        elif 'linux' in user_agent:
            return 'linux'
        elif 'android' in user_agent:
            return 'android'
        elif 'ios' in user_agent:
            return 'ios'
        else:
            return 'other'

        
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            # Create activity log
            UserActivity.objects.create(
                user=user,
                action='login',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                page='admin login'
            )
            
            # Get or create token
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        if not current_password or not new_password or not confirm_password:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check current password
        if not user.check_password(current_password):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        
        # Log activity
        SystemLog.objects.create(
            action='password_change',
            user=user,
            model_name='User',
            object_id=user.id,
            ip_address=self.get_client_ip(request)
        )
        
        return Response({'message': 'Password updated successfully'})
    
    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate new password
        new_password = get_random_string(12)
        user.set_password(new_password)
        user.save()
        
        # Send email with new password
        try:
            send_mail(
                subject='Portfolio Admin - Password Reset',
                message=f"""
                Hello {user.username},
                
                Your password has been reset successfully.
                
                New Password: {new_password}
                
                Please login and change your password immediately.
                
                Login URL: http://localhost:5173/admin/login
                
                Best regards,
                Portfolio Admin Team
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            # Log activity
            SystemLog.objects.create(
                action='password_reset',
                user=user,
                model_name='User',
                object_id=user.id,
                ip_address=self.get_client_ip(request)
            )
            
            return Response({'message': 'Password reset email sent successfully'})
        except Exception as e:
            return Response({'error': f'Failed to send email: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'is_superuser': request.user.is_superuser,
            'date_joined': request.user.date_joined
        })
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        if request.user.is_authenticated:
            UserActivity.objects.create(
                user=request.user,
                action='logout',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            # Delete token
            Token.objects.filter(user=request.user).delete()
        
        logout(request)
        return Response({'message': 'Logged out successfully'})
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')