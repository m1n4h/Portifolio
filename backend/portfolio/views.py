from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Project, ContactMessage, Skill
from .serializers import ProjectSerializer, ContactMessageSerializer, SkillSerializer

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by('-featured', '-created_at')

class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Send email notification
        try:
            send_mail(
                f'Portfolio Contact: {serializer.validated_data["subject"]}',
                f'Name: {serializer.validated_data["name"]}\nEmail: {serializer.validated_data["email"]}\nPhone: {serializer.validated_data.get("phone", "")}\n\nMessage:\n{serializer.validated_data["message"]}',
                settings.DEFAULT_FROM_EMAIL,
                ['amina.kalonge@example.com'],  # Replace with actual email
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)