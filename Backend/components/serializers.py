from rest_framework import serializers
from components.models import Component


class ComponentTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ['id', 'name']


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ['id', 'name', 'schema', 'created_at']
        read_only_fields = ['id', 'created_at']


class ComponentCreateUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    schema = serializers.JSONField()

    def validate_schema(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Schema must be a JSON object (dict).")
        if 'fields' not in value:
            raise serializers.ValidationError("Schema must contain a 'fields' key.")
        if not isinstance(value['fields'], list):
            raise serializers.ValidationError("Schema 'fields' must be a list.")
        return value
