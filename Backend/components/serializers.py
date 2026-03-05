from rest_framework import serializers
from components.models import Component, RatingScale, ScoringParameter


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


class RatingScaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingScale
        fields = ['id', 'value', 'label', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class RatingScaleCreateUpdateSerializer(serializers.Serializer):
    value = serializers.IntegerField()
    label = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True, default='')
    is_active = serializers.BooleanField(default=True)


class ScoringParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoringParameter
        fields = ['id', 'name', 'description', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class ScoringParameterCreateUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True, default='')
    is_active = serializers.BooleanField(default=True)

