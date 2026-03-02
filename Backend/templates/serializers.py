from rest_framework import serializers
from templates.models import Template


class TemplateSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True, default=None)

    class Meta:
        model = Template
        fields = [
            'id', 'template_name', 'template_description',
            'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_name', 'created_at', 'updated_at']


class TemplateCreateUpdateSerializer(serializers.Serializer):
    template_name = serializers.CharField(max_length=255)
    template_description = serializers.CharField(required=False, allow_blank=True, default='')
